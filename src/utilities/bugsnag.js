import bugsnag from '@bugsnag/js';

const bugsnagClient = bugsnag({
  apiKey: process.env.VUE_APP_BUGSNAG_ID,
  appVersion: process.env.VUE_APP_VERSION,
  appType: 'client',
  collectUserIp: false
});

export default bugsnagClient;
