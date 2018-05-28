const fs = require('fs')
const path = require('path')
const superagent = require('superagent')
const cheerio = require('cheerio')
const file = 'E:\\工具\\网络工具\\梯子\\ShadowsocksR\\gui-config.json';
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
      superagent.get(this.option.url).then(res => {
        let config = this.getSSConfig(res.text);
        let data = this.writeConfig(config);
        return resolve(data);
      }).catch(err => {
        return reject(err);
      })
    });
  }
  getSSConfig(html) {
    const self = this;
    let config = [];
    const $ = cheerio.load(html);
    $('.portfolio-items .portfolio-item').each(function(i) {
      const text = $(this).text().trim();
      let result = self.parseSSConfig(text);
      config.push(result);
    });
    return config;
  }
  parseSSConfig(text) {
    const defaultConfig = {
      "server_udp_port" : 0,
      "protocol" : "auth_sha1_v4",
      "protocolparam" : "",
      "obfs" : "tls1.2_ticket_auth",
      "obfsparam" : "",
      "enable" : false,
      "udp_over_tcp" : false,
      "group": "free"
    };
    let config = {};
    const keyMap = {
      'IP Address': 'server',
      'Port': 'server_port',
      'Password': 'password',
      'Method': 'method'
    };
    text.split(/\s*\n\s*/).forEach(item => {
      let kv = item.split(':');
      let key = keyMap[kv[0].trim()];
      if(key) {
        config[key] = kv[1].trim();
      }
    });
    return Object.assign(defaultConfig, config);
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
