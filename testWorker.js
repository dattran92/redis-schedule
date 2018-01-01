const { connect, worker } = require('./index');

connect({ host: 'localhost', port: 6379 });

worker.register('test', (data) => {
  console.log('test', data);
});
