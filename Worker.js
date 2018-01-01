const logger = require('log4js').getLogger('redis-schedule');

function Worker(client, options) {
  const defaultOptions = {
    interval: 2000
  }

  this.redisClient = client;
  this.options = Object.assign({}, defaultOptions, options);
  this.jobs = {};
}

Worker.prototype.cancel = function(jobName) {
  clearInterval(this.jobs[jobName]);
  delete this.jobs[jobName];
}

Worker.prototype.register = function(jobName, handler, prefetch = 5) {
  const stopPoint = prefetch - 1;

  if (this.jobs[jobName]) {
    return Promise.reject(new Error('Job existed'));
  }

  const interval = setInterval(() => {
    this.redisClient.zrange([jobName, 0, stopPoint, 'WITHSCORES'])
      .then((data) => {
        logger.debug(`Worker "${jobName}": `, data);

        for (let i = 0; i < data.length; i += 2) {
          const key = data[i];
          const score = data[i+1];
          const timestamp = parseInt(score, 0);
          if (timestamp <= Date.now()) {
            handler(key);
            this.redisClient.zrem([jobName, key]);
          }
        }
      })
      .catch((err) => {
        logger.error(`Error getting for job ${jobName}`, err);
      })
  }, this.options.interval);

  this.jobs[jobName] = interval;
}

module.exports = Worker;
