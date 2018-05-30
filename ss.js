const fs = require('fs')
const path = require('path')
const superagent = require('superagent')
class SS {
  constructor(option) {
    if(!option || !Object.prototype.toString.call(option.url)) {
      throw new Error('Url is missing.');
    }
    this.option = option;
  }
  run() {
    const translator = {
      'IP Address': 'address',
      'Port': 'port',
      'Password': 'password',
      'Method': 'method'
    };
    return new Promise((resolve, reject) => {
      console.log(this.option.api)
      superagent.get(this.option.api.url).then(res => {
        let config = this.option.api.getSSConfig(res.text);
        let data = this.writeConfig(config);
        return resolve(data);
      }).catch(err => {
        return reject(err);
      })
    });
  }
  writeConfig(config) {
    let fullPath = path.resolve(this.option.dir, this.option.configName)
    if (!fs.existsSync(fullPath)) {
      throw new Error(`${fullPath} not exists.`);
    }
    const fileData = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    fileData.configs = fileData.configs.filter(item => item.group !== 'free');
    [].push.apply(fileData.configs, config);
    fs.writeFileSync(fullPath, JSON.stringify(fileData, null, 2));
    return fileData;
  }
}

module.exports = SS;
