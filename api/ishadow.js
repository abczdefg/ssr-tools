const cheerio = require('cheerio')
class Ishadow {
  constructor() {
    this.url = 'http://ss.ishadowx.com/';
  }
  parseSSConfig(text) {
    const defaultConfig = {
      "server_udp_port" : 0,
      "protocol" : "origin",
      "protocolparam" : "",
      "obfs" : "plain",
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
      let kv, key;
      if(item.includes(':')) {
        kv = item.split(':');
        key = keyMap[kv[0].trim()];
        if(key) {
          config[key] = kv[1].trim();
        }
      } else if(/auth_/.test(item)) {
        kv = item.split(/\s+/);
        config.protocol = kv[0];
        config.obfs = kv[1];
      }
    });
    return Object.assign(defaultConfig, config);
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
}

module.exports = new Ishadow();
