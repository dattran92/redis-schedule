const redis = require("redis");
const logger = require('log4js').getLogger('redis-schedule');

const commands = ['zadd', 'zrange', 'zrem']

function RedisClient() {
  this.client = null;
};

RedisClient.prototype.connect = function(options) {
  this.client = redis.createClient(options);
  this.client.on("error", function (err) {
    logger.error("Error " + err);
  });
};

commands.forEach((command) => {
  RedisClient.prototype[command] = function (args) {
    return new Promise((resolve, reject) => {
      this.client[command](args, (err, reply) => {
        if (err) {
          return reject(err);
        }

        return resolve(reply);
      });
    });
  }
});

module.exports = new RedisClient();
