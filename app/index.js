/*!
 * Node.js Server Script
 */
const promiseLimit = require('promise-limit');
const express = require('express');
const sanitizer = require('express-sanitizer');
const session = require('cookie-session');
const config = require('./config');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cache = require('apicache');
const cacheMiddleware = cache.middleware;
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const Twitter = require('twitter');
const Bugsnag = require('@bugsnag/js');
const BugsnagPluginExpress = require('@bugsnag/plugin-express');

export default (app, http) => {
  var isProduction = config.env === 'production' ? true : false;

  var _twitter;
  var _limit = promiseLimit(25);
  var _session = {
    secret: config.salt,
    cookie: {
      secure: isProduction,
      secureProxy: isProduction,
      sameSite: true,
      httpOnly: true,
      overwrite: true,
      maxAge: 24 * 3600
    }
  };

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: config.app_key,
        consumerSecret: config.app_secret,
        callbackURL: '/api/auth/callback',
        proxy: config.env.use_proxy
      },
      function(token, tokenSecret, profile, cb) {
        return cb(null, profile, {
          consumer_key: config.app_key,
          consumer_secret: config.app_secret,
          access_token_key: token,
          access_token_secret: tokenSecret
        });
      }
    )
  );

  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

  Bugsnag.start({
    apiKey: config.bs_key,
    plugins: [BugsnagPluginExpress],
    appVersion: config.app_version,
    enabledReleaseStages: ['production']
  });

  const { requestHandler, errorHandler } = Bugsnag.getPlugin('express');
  app.use(requestHandler);

  // app.use(logger('dev'));
  app.use(helmet());
  app.enable('trust proxy', 1);
  app.use(express.static(path.join(__dirname, './../dist'), { index: false }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(sanitizer());
  app.use(session(_session));

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('*', function(req, res, next) {
    if (req.protocol === 'http' && isProduction) {
      return res.redirect(301, `https://${req.hostname}${req.originalUrl}`);
    } else {
      return next();
    }
  });

  // Initiate authentication with Twitter
  app.get('/api/auth', passport.authenticate('twitter'));

  // Process Twitter callback and verify authentication
  app.get('/api/auth/callback', function(req, res, next) {
    passport.authenticate('twitter', { session: true }, function(
      err,
      user,
      info,
      status
    ) {
      if (err) {
        req.bugsnag.notify(
          new Error('Problem authenticating with Twitter API'),
          function(event) {
            event.addMetadata('api', err);
          }
        );
        return res.status(500).json({ error: err });
      }

      req.session.auth = info;
      req.session.user = {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        photo: user.photos[0].value
      };
      res.redirect('/');
    })(req, res, next);
  });

  app.get('/api/profile', function(req, res, next) {
    if (req.session.auth) {
      _twitter = new Twitter(req.session.auth);
      res.json({ profile: req.session.user });
    } else {
      res.status(401).json({
        error: 'You must be signed in with Twitter to fetch your profile.'
      });
    }
  });

  app.post('/api/signout', function(req, res) {
    req.session = null;
    res.sendStatus(200);
  });

  // Fetch data about friendships from the API
  app.get(
    '/api/friends',
    cacheMiddleware('5 minutes', isProduction),
    function(req, res, next) {
      req.apicacheGroup = 'friends';
      // Define a payload response object
      res.payload = {};
      // Fetch number of retweeters blocked
      _twitter.get('friendships/no_retweets/ids', function(errors, response) {
        if (errors) {
          req.bugsnag.notify(
            new Error('Problem getting `no_retweets` ids'),
            function(event) {
              event.addMetadata('api', err);
            }
          );

          res.status(500).json({ error: 'Problem getting `no_retweets` ids' });
        } else {
          var retweetersBlocked = {
            count: response.length,
            ids: response
          };
          res.payload.retweeters_blocked = retweetersBlocked;
          next();
        }
      });
    },
    function(req, res, next) {
      // Fetch number of friends (people you follow)
      _twitter.get('friends/ids', { stringify_ids: true }, function(
        errors,
        response
      ) {
        if (errors) {
          req.bugsnag.notify(
            new Error('Problem getting friends/ids'),
            event => {
              event.addMetadata('api', err);
            }
          );
          res.status(500).json({ error: 'Problem getting friends/ids' });
        } else {
          res.payload.following = response.ids;
          next();
        }
      });
    },
    function(req, res) {
      res.json(res.payload);
    }
  );

  app.post(
    '/api/friends',
    function(req, res, next) {
      // setTimeout(() => res.sendStatus(500), 2500);
      _twitter
        .get('friends/ids', { stringify_ids: true })
        .then(function(response) {
          res.following = response.ids;
          next();
        })
        .catch(function(errors) {
          req.bugsnag.notify(
            new Error('Problem getting friends/ids'),
            event => {
              event.addMetadata('api', err);
            }
          );
          res.status(500).json({ error: 'Problem getting friends/ids' });
        });
    },
    function(req, res, next) {
      var following = res.following;
      var count = 0;

      Promise.all(
        following.map(function(id) {
          return _limit(function() {
            return _twitter
              .post('friendships/update', {
                user_id: id,
                retweets: req.body.wantRetweets
              })
              .then(function(response) {
                count += 1;
              })
              .catch(function(errors) {
                req.bugsnag.notify(
                  new Error('Problem with posting and update to Twitter API'),
                  event => {
                    event.addMetadata('api', err);
                  }
                );
                next(errors);
              });
          });
        })
      )
        .then(function(data) {
          next();
        })
        .catch(function(errors) {
          req.bugsnag.notify(
            new Error('Problem with posting and update to Twitter API'),
            event => {
              event.addMetadata('api', errors);
            }
          );
          res.status(500).json({ errors });
        });
    },
    function(req, res) {
      _twitter.get('friendships/no_retweets/ids', function(errors, response) {
        if (errors) {
          req.bugsnag.notify(
            new Error('roblem getting `no_retweets` ids'),
            event => {
              event.addMetadata('api', errors);
            }
          );
          res.status(500).json({ error: 'Problem getting `no_retweets` ids' });
        } else {
          cache.clear('friends');
          res.json({
            retweeters_blocked: {
              count: response.length,
              ids: response
            }
          });
        }
      });
    }
  );

  app.use(errorHandler);
};
