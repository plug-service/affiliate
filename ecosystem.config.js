module.exports = {
  apps: [
    {
      name: 'affiliate',
      script: './dist/main.js', // use for pm2 start
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      env_production: {
        NEST_PORT: 4000,
        NODE_ENV: 'production',

        MONGO_URL: 'localhost',
        MONGO_DB_NAME: 'affiliate',

        MIN_LENGTH_REFERRAL_CODE: 3,
        MAX_LENGTH_REFERRAL_CODE: 15,
        DEFAULT_REFERRAL_CODE_RATE: 0.2,
      },
    },
  ],
  deploy: {
    production: {
      user: 'root',
      path: '/var/www/affiliate',
      repo: 'git@github.com:plug-service/affiliate.git',
      'post-deploy': 'yarn install && yarn build && pm2 start --env production', // --env use env_production above
      host: '157.230.245.190',
      ref: 'origin/master',
    },
  },
};
