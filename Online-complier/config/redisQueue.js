const Queue = require('bull');

const submissionQueue = new Queue('submission', {
  redis: {
    host: 'host.docker.internal', 
    port: 6379
  }
});

const runQueue = new Queue('run', {
  redis: {
    host: 'host.docker.internal',
    port: 6379
  }
});

module.exports = { submissionQueue, runQueue };
