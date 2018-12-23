// Synchronous Event Emitter
// const EventEmitter = require('events');

// class WithLog extends EventEmitter {
//   execute(taskFunc) {
//     console.log('Before executing');
//     this.emit('begin');
//     taskFunc();
//     this.emit('end');
//     console.log('After executing');
//   }
// }

// const withLog = new WithLog();

// withLog.on('begin', () => console.log('About to execute'));
// withLog.on('end', () => console.log('Done with execute'));

// withLog.execute(() => console.log('*** Executing task***'));

// Asynchronous Event Emitter
const fs = require('fs');
const EventEmitter = require('events');

class WithTime extends EventEmitter {
  execute(asyncFunc, ...args) {
    console.time('execute');
    this.emit('begin');
    asyncFunc(...args, (err, data) => {
      if (err) {
        return this.emit('error', err);
      }
      this.emit('data', data);
      console.timeEnd('execute');
      this.emit('end');
    });
  }
}

const withTime = new WithTime();

withTime.on('begin', () => console.log('About to execute'));
withTime.on('end', () => console.log('Done with execute'));

// arguments for listeners, if many listeners use .prependListener to make first
withTime.on('data', data => {
  console.log(`Length: ${data.length}`);
});

// errors
withTime.on('error', console.error); // neither nor exit

process.on('uncaughtException', err => {
  console.log(err);
  // do some cleanup
  process.exit(1); // exit
});

withTime.execute(fs.readFile, __filename);
