const SS = require('./ss.js')
const ProcessController = require('./processController.js')
// 子进程需要保持打开才能运行exe
// 改用bat方式执行

const option = {
  dir: 'E:\\工具\\网络工具\\梯子\\ShadowsocksR',
  exeName: 'ShadowsocksR.exe',
  configName: 'gui-config.json',
  url: 'http://ss.ishadowx.com/'
};

let ss = new SS(option);
ss.run().then(res => {
  console.log('========== Finish Update SSR ==========')
  process.exit(0);
})

