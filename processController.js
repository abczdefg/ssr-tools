const util = require('util');
const childProcess = require('child_process');
const path = require('path');
class ProcessController {
  constructor(option) {
    option = option || {};
    this.exeFullPath = path.join(option.dir, option.exeName)
  }
  getProcessId(name) {
    return new Promise((resolve, reject) => {
      const cmd = process.platform === 'win32' ? 'tasklist' : 'ps aux';
      const exec = util.promisify(childProcess.exec);
      exec(cmd)
        .then(res => {
          res.stdout.split(/\s*\n\s*/).forEach(line => {
            let processMessage = line.trim().split(/\s+/)
            let processName = processMessage[0];
            let processId = processMessage[1];
            if((new RegExp(name)).test(processName)) {
              return resolve(processId);
            }
          });
          return reject(`${name} is not found`);
        })
        .catch(err => reject(err))
    });
  }
  killProcess(file) {
    let name = /\\([^\\]+?)$/.exec(file)[1];
    return new Promise((resolve, reject) => {
      this.getProcessId(name)
        .then((pid) => {
          process.kill(pid);
          console.log(`kill ${name}`)
          return resolve(pid);
        })
        .catch(err => {
          if(err) {
            console.log(err)
          } else {
            console.log(`kill ${name} error`)
          }
          return reject(err);
        });
    });
  }
  runProcess(file) {
    return childProcess.execFileSync(file);
  }
  async restartProcess(file) {
    this.killProcess(file)
      .then(() => {
        this.runProcess(file);
        console.log('exit');
      })
      .catch(() => {
        this.runProcess(file);
        console.log('exit');
      })
  }
  restart() {
    this.restartProcess(this.exeFullPath);
  }
}
module.exports = ProcessController;
