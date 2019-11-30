let httpRequest = require("./utils/httpRequest.js");
App({
  log: function(...msg) {
    console.log(...msg);
  },
  onLaunch: function() {
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