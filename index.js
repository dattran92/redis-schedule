const redisClient = require('./redisClient');
const Worker = require('./Worker');

const connect = (options) => {
  return redisClient.connect(options);
};

const schedule = (jobName, key, timestamp) => {
  return redisClient.zadd([jobName, timestamp, key]);
};

const cancel = (jobName, key) => {
  return redisClient.zrem([jobName, key]);
};

const worker = new Worker(redisClient);

module.exports = {
  connect,
  schedule,
  cancel,
  worker
};
