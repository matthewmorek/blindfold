/*!
 * Node.js Server Script
 */
const promiseLimit = require("promise-limit");
const express = require("express");
const sanitizer = require("express-sanitizer");
const cors = require("cors");
const session = require("express-session");
const redis = require("redis");
const redisClient = redis.createClient(process.env.REDIS_URL);
const redisStore = require("connect-redis")(session);
const config = require("./config");
const path = require("path");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cache = require("apicache");
const cacheMiddleware = cache.middleware;
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const Twitter = require("twitter");
const Bugsnag = require("@bugsnag/js");
const BugsnagPluginExpress = require("@bugsnag/plugin-express");
const isEmpty = require("lodash/fp/isEmpty");

export default (app) => {
  var isProduction = config.env === "production" ? true : false;

  if (!isProduction) {
    redisClient.on("connect", function () {
      console.log("Connected to Redis");
    });

    redisClient.on("error", (err) => {
      console.log("Redis error: ", err);
    });
  }

  var nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  var _twitter;
  var _limit = promiseLimit(25);

  Bugsnag.start({
    apiKey: config.bs_key,
    plugins: [BugsnagPluginExpress],
    appVersion: config.app_version,
    enabledReleaseStages: ["production"],
  });

  const { requestHandler, errorHandler } = Bugsnag.getPlugin("express");
  app.use(requestHandler);

  // app.use(logger('dev'));
  app.set("trust proxy", true);
  app.use(helmet());
  app.use(cors({ credentials: true, origin: "frontend address" }));
  app.use(express.static(path.join(__dirname, "./../dist"), { index: false }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(sanitizer());

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: config.app_key,
        consumerSecret: config.app_secret,
        callbackURL: "/api/auth/callback",
        proxy: config.env.use_proxy,
        includeStatus: true,
        passReqToCallback: true,
      },
      function (req, token, tokenSecret, profile, done) {
        const { id, username, displayName, photos } = profile;

        req.session.auth = {
          consumer_key: config.app_key,
          consumer_secret: config.app_secret,
          access_token_key: token,
          access_token_secret: tokenSecret,
        };

        return done(null, {
          id,
          username,
          displayName,
          photo: photos[0].value,
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  app.use(
    session({
      secret: config.salt,
      name: "_session",
      saveUninitialized: false,
      resave: false,
      rolling: false,
      cookie: {
        secure: "auto",
        key: "_blindfold",
        sameSite: "Lax",
        httpOnly: true, //isProduction,
        maxAge: 30 * 24 * 36000,
        expires: nextYear,
      },
      store: new redisStore({ client: redisClient }),
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  function checkAuth(req, res, next) {
    try {
      if (req.user) {
        next();
      } else {
        res.status(401).json({ error: "abandon all hope" });
      }
    } catch {
      res.status(500).json({ error: "something went wrong" });
    }
  }

  // Automatically upgrade to HTTPS in production
  app.get("*", function (req, res, next) {
    if (req.protocol === "http" && isProduction) {
      return res.redirect(301, `https://${req.hostname}${req.originalUrl}`);
    } else {
      return next();
    }
  });

  // Initiate authentication with Twitter
  app.get("/api/auth", passport.authenticate("twitter"));

  // Process Twitter callback and verify authentication
  app.get(
    "/api/auth/callback",
    passport.authenticate("twitter", {
      failureRedirect: "/401",
    }),
    (req, res) => {
      if (req.user) {
        res.redirect("/");
      } else {
        res.status(401).end();
      }
    }
  );

  // handle 401 route
  app.get("/401", (req, res) => res.status(401).end());

  // get user profile data
  app.get("/api/profile", checkAuth, function (req, res) {
    res.status(200).json({ profile: req.user });
  });

  // nuke the session
  app.post("/api/signout", function (req, res) {
    req.session = null;
    res.status(200).end();
  });

  // enable/disable retweets
  app.post(
    "/api/friends",
    checkAuth,
    function (req, res, next) {
      // setTimeout(() => res.status(500), 2500);
      _twitter = new Twitter(req.session.auth);
      _twitter
        .get("friends/ids", { stringify_ids: true })
        .then(function (response) {
          res.following = response.ids;
          next();
        })
        .catch(function (errors) {
          req.bugsnag.notify(
            new Error("Problem getting friends/ids"),
            (event) => {
              event.addMetadata("api", errors);
            }
          );
          res.status(500).json({ error: "Problem getting friends/ids" });
        });
    },
    function (req, res, next) {
      Promise.all(
        res.following.map(function (id) {
          return _limit(function () {
            return _twitter
              .post("friendships/update", {
                user_id: id,
                retweets: req.body.wantRetweets,
              })
              .catch(function (errors) {
                req.bugsnag.notify(
                  new Error("Problem with posting and update to Twitter API"),
                  (event) => {
                    event.addMetadata("api", errors);
                  }
                );
                res.status(500).json({ errors });
              });
          });
        })
      )
        .then(function () {
          next();
        })
        .catch(function (errors) {
          req.bugsnag.notify(
            new Error("Problem with posting and update to Twitter API"),
            (event) => {
              event.addMetadata("api", errors);
            }
          );
          res.status(500).json({ errors });
        });
    },
    function (req, res) {
      _twitter
        .get("friendships/no_retweets/ids", {})
        .then(function (response) {
          cache.clear("friends");
          res.status(200).end();
        })
        .catch(function (errors) {
          req.bugsnag.notify(
            new Error("roblem getting `no_retweets` ids"),
            (event) => {
              event.addMetadata("api", errors);
            }
          );
          res.status(500).json({ error: "Problem getting `no_retweets` ids" });
        });
    }
  );

  app.use(errorHandler);
};
