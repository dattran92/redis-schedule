# redis-schedule
Simple Scheduler Solution for Node based on REDIS.

# How to use

```
npm install redis-schedule --save
```

planner.js

```
const scheduler = require('redis-scheduler');
scheduler.connect({ host: 'localhost', port: 6379' });

scheduler.worker.register('someJob', (data) => {
  console.log('got data from scheduler');
});
```

worker.js

```
const scheduler = require('redis-scheduler');
scheduler.connect({ host: 'localhost', port: 6379' });

scheduler.worker.register('someJob', (data) => {
  console.log('got data from scheduler');
});
```

# API

### "connect"

Redis scheduler use singleton for the connection to REDIS. connect once and you can use it everywhere

```
scheduler.connect(options)
```

`connect` use the same options with `redis` connect: [https://github.com/NodeRedis/node_redis/blob/master/README.md#connect](https://github.com/NodeRedis/node_redis/blob/master/README.md#connect)


###  "schedule"

Schedule a task to run at a specific timestamp.

```
scheduler.schedule(jobName, key, timestamp);
```

#### Parameter

| Property  | Default   | Description |
|-----------|-----------|-------------|
| jobName   |           | Name of the Job |
| key       |           | Identifer of the schedule |
| timestamp |           | Unix timestamp where the job should be executed |


###  "cancel"

Cancel a task with a key.

> Notes: All the tasks with the same key in the Job will be cancel.

```
scheduler.cancel(jobName, key);
```

#### Parameter

| Property  | Default   | Description |
|-----------|-----------|-------------|
| jobName   |           | Name of the Job |
| key       |           | Identifer of the schedule |


### Worker

Handle jobs

#### Register

Register a worker which process the task at the due time.

```
scheduler.worker.register(jobName, handler, prefetch)
```

```
handler = (key) => { // do something with the key}
```

| Property  | Default   | Description |
|-----------|-----------|-------------|
| jobName   |           | Name of the Job |
| handler   |           | Function to process schedule job |
| prefetch  |5          | Number of items to be received for each interval |

#### Cancel

Remove a worker

```
scheduler.worker.cancel(jobName)
```

| Property  | Default   | Description |
|-----------|-----------|-------------|
| jobName   |           | Name of the Job |

> Note: Only one worker should exist at once. otherwise, duplicated messages will be processed

# Behind the scence
- schedule: `ZADD jobName key timestamp`
- cancel: `ZREM jobName key`
- worker:
  - interval get data from redis `ZRANGES jobName 0 {prefetch -1} WITHSCORES`
  - check if the score is smaller than now
    - If it's `true`, process message, `ZREM jobName key`
    - If it's `false`, ignore it

# LIMITATIONS

- This is a very basic version of scheduler. It should be used for small sized application only.
- If you need more advanced feature, go with `RabbitMQ` with `x-delayed-message` plugin.
- No `ack` implemented for worker. Therefore, you have to implement yourself `requeue` when a job is failed.
- The timestamp is from your application. So make sure the `planner` and the `worker` have consistent time.
- The key should be unique, since when we use `ZREM jobName key`. All duplicated items with that key will be removed.
