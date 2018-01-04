const logger = require('log4js').getLogger('redis-schedule');

function Planner(client) {
  this.redisClient = client;
}

Planner.prototype.schedule = function (jobName, key, timestamp) {
  return redisClient.zadd([jobName, timestamp, key]);
};

Planner.prototype.cancel = function (jobName, key) {
  return redisClient.zrem([jobName, key]);
};

module.exports = Planner;
