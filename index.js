const redisClient = require('./redisClient');
const Worker = require('./Worker');
const Planner = require('./Planner');

const connect = (options) => {
  return redisClient.connect(options);
};

const worker = new Worker(redisClient);
const planner = new Planner(redisClient);

module.exports = {
  connect,
  schedule: planner.schedule,
  cancel: planner.cancel,
  worker
};
