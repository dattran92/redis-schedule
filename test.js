const RedisClient = require('./RedisClient');
RedisClient.connect({ host: 'localhost', port: 6379 });

RedisClient.zadd(['test', 1517529600000, 'dsauifdsahufs'])
  .then((data) => {
    console.log('test', data);
  })
  .catch((err) => {
    console.log('wth', err)
  });
