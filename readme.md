<p align="center"><img src="https://github.com/matthewmorek/blindfold/raw/master/public/images/og-image.png" srcset="https://github.com/matthewmorek/blindfold/raw/master/public/images/og-image@2x.png 2x" alt="blindfold banner" /></p>

# Blindfold

_Blindfold_ is a small web app built in Node.js that allows you to turn off/on retweets from the people you follow on Twitter. Because life is too short to keep ingesting negative crap all the time.

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What you’ll need to get started.

- Git
- NodeJS 10+
- `npm` or Yarn

### Initial setup

1. Using Git, clone this repository to your local machine.
2. Run `npm install` or `yarn` from inside the project's directory to install all dependencies.
3. Get your Consumer Key and Secret from https://apps.twitter.com.
4. Run `cp ./env.local.sample ./.env` and adjust config variables.

### Configuration

_Blindfold_ has only a handful of options, but they are all required before the app can run, otherwise expect it to complain.

### Development

If you want to tinker with this project, you can use Vue CLI to help you handle Hot Module Reloading (HMR).

```bash
# launch dev server for the frontend UI
$ yarn serve
# or
$ npm run serve

# launch dev server for the backend API
$ yarn express
# or
$ npm run express
```

### Contributing

This is a hobby project that most likely has bugs, untested things, and can likely fall on its head when mistreated. Feel free to report any issues, feature requests, etc.

If you spot something you can fix yourself, fork the repo, commit your code on a feature branch and open a pull request.

**I will happily review all contributions, especially those that help with establishing testing of the app.**

#### Notice

This app was never meant to be yet another Twitter client of any kind, so don't expect me to add new features such as feeds, lists, etc.

---

&copy; Matthew Morek
