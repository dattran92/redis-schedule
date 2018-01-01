# redis-schedule
Simple Scheduler Solution for Node based on REDIS.

# How to use

```
const scheduler = require('redis-scheduler');
scheduler.connect({ host: 'localhost', port: 6379' });

scheduler.schedule('someJob', 'key', Date.now());

scheduler.register('someJob', (data) => {
  console.log('got data from scheduler');
});
```

# API

### "connect"

Redis scheduler use singleton for the connection to REDIS. connect once and you can use it everywhere

```
connect(options)
```

`connect` use the same options with `redis` connect: [https://github.com/NodeRedis/node_redis/blob/master/README.md#connect](https://github.com/NodeRedis/node_redis/blob/master/README.md#connect)


###  "schedule"

```
schedule(jobName, key, timestamp);
```

#### Parameter

| Property  | Default   | Description |
|-----------|-----------|-------------|
| jobName   |           | Name of the Job |
| key       |           | Identifer of the schedule |
| timestamp |           | Unix timestamp where the job should be executed |
