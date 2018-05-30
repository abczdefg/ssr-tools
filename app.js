const path = require('path')
const SS = require('./ss.js')
const ishadow = require('./api/ishadow.js')
// const ProcessController = require('./processController.js')
// 子进程需要保持打开才能运行exe
// 改用bat方式执行

const option = {
  dir: path.resolve(__dirname, 'ShadowsocksR'),
  exeName: 'ShadowsocksR.exe',
  configName: 'gui-config.json',
  api: ishadow
};

let ss = new SS(option);
ss.run().then(res => {
  console.log('========== Finish Update SSR ==========')
  process.exit(0);
})

