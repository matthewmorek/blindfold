const path = require('path');
const dotenv = require('dotenv');

class Config {
  constructor() {
    this.root = path.normalize(path.join(__dirname, '/..'));
    this.rootPath = process.env.ROOT_PATH || '/';
    this.port = parseInt(process.env.PORT) || 3000;
    this.env = process.env.NODE_ENV || 'production';
    this.server_cache = process.env.SERVER_CACHE || false;
    this.site_host = process.env.SITE_HOST || process.env.HOST || '127.0.0.1';
    this.bind_host = process.env.BIND_HOST || '0.0.0.0';
    this.app_key = process.env.APP_KEY || null;
    this.app_secret = process.env.APP_SECRET || null;
    this.app_version = require('../package').version;
    this.salt = process.env.SALT || null;
    this.bs_key = process.env.BS_KEY || null;
  }
}

dotenv.config({
  path: path.join(__dirname, '../.env')
});

const config = new Config();

module.exports = config;
