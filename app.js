let httpRequest = require("./utils/httpRequest.js");
App({
  log: function(...msg) {
    console.log(...msg);
  },
  onLaunch: function() {
    console.log("小程序app launched!!!")
    let self = this;
    httpRequest.setApp(this);
    wx.getSystemInfo({
      success(res) {
        self.globalData.sysInfo = res;
        self.globalData.winSize = {
          width: res.windowWidth,
          height: res.windowHeight
        }
        // console.log(res);
      }
    })
  },
  onShow: function(opts){
    console.log("2222222222", opts)
  },
  onHide: function(){
    console.log("3333333333")
  },
  onError: function(msg){
    console.error("err: =", msg)
  },
  onPageNotFound: function(res){
    console.log("界面不存在，将直接去主界面")
    wx.redirectTo({
      url: 'pages/main/main',
    });
  },

  globalData: {
    MiniId: 1,
    userInfo: null,
    openId: "",
    accountType: "wechat",
    cliType: "mini_program",
    isCheckSesson: true,
    userId: "",
    coins: 0,
  },
  addCoins: function(coin) {
    this.globalData.coins += coin ? coin : 0;
  },
  serverData: {

  },
  gobackLogin: function(value) {
    let currentPage = getCurrentPages();
    this.globalData.isCheckSesson = false;
    if (currentPage.length > 1) {
      wx.reLaunch({
        url: '../login/login?closeSession=' + value,
      })
    } else {
      if (this.reLogin) {
        this.reLogin();
      }
    }
  },
  gotoLuck: function() {
    wx.navigateTo({
      url: '../luck/luck'
    });
  },
  gotoSign: function() {
    wx.navigateTo({
      url: '../sign/sign'
    });
  }
})