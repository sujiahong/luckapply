let errCode = require("./errCode.js");
let util = require("./util.js")
let httpRequest = {
  httpStr: "http://",
  serverUrl: "",
  startUrl: "192.168.10.34:8090",
};
httpRequest.setApp = function(app) {
  this.app = app;
};
httpRequest.initUrl = function(data) {
  this.serverUrl = data.ip + ":" + data.port
};
httpRequest.getUrl = function() {
  let url = this.httpStr + (this.serverUrl == "" ? this.startUrl : this.serverUrl);
  this.app.log("url " + url);
  return url;
};
httpRequest.getServer = function(code, cb) {
  let MiniId = this.app.globalData.MiniId;
  let accountType = this.app.globalData.accountType;
  let sendData = {
    accountData: {
      code: code,
    },
    MiniId: MiniId,
    accountType: accountType
  }
  this.requestGet("validateUser", sendData, (data) => {
    this.app.serverData = data;
    wx.setStorageSync("serverData", this.app.serverData);
    this.app.globalData.isCheckSesson = true;
    this.initUrl(data);
    if (cb) {
      cb();
    }
  });
};
httpRequest.doLogin = function(cb) {
  let self = this;
  let MiniId = this.app.globalData.MiniId;
  let accountType = this.app.globalData.accountType;
  let cliType = this.app.globalData.cliType;
  let nickName = encodeURIComponent(this.app.globalData.userInfo.nickName); //
  let avatarUrl = encodeURIComponent(this.app.globalData.userInfo.avatarUrl); //

  let sendData = {
    accountData: {
      avatarUrl: avatarUrl,
      gender: this.app.globalData.userInfo.gender,
      nickName: nickName,
    },
    cliType: cliType,
    MiniId: MiniId,
    recommendation: this.app.serverData.recommendation,
    accountType: accountType,
    account: this.app.serverData.account,
  }
  this.requestGet("login", sendData, (data) => {
    let userId = data.userId;
    let coins = data.coins;
    this.app.globalData.userId = userId;
    this.app.globalData.coins = coins;
    if (cb) {
      cb();
    }
  });
};
httpRequest.luckTest = function(cb) {
  let sendData = {
    userId: this.app.globalData.userId
  };
  this.requestGet("luckTest", sendData, (data) => {
    let coins = parseInt(data.coins);
    if (!isNaN(coins)) {
      this.app.globalData.coins = coins;
    }
    if (cb) {
      cb();
    }
  });
};
httpRequest.acquireSignData = function(cb) {
  let sendData = {
    userId: this.app.globalData.userId
  };
  this.requestGet("acquireSignData", sendData, (data) => {
    if (cb) {
      cb(data);
    }
  });
};
httpRequest.signIn = function(cb) {
  let sendData = {
    userId: this.app.globalData.userId
  };
  this.requestGet("signIn", sendData, (data) => {
    if (cb) {
      cb(data);
    }
  });
};
httpRequest.shareSignInSuccess = function(coin,cb){
  let sendData = {
    userId: this.app.globalData.userId,
    coin: coin,
  };
  this.requestGet("shareSignInSuccess", sendData, (data) => {
    if (cb) {
      cb(data);
    }
  });
};
httpRequest.requestGet = function(route, data, cb) {
  this.request(route, "GET", data, cb);
};
httpRequest.reLogin = function(route, method, data, cb) {
  this.doLogin(() => {
    util.showToast("重新登录成功，请重试。");

    // this.requestGet(route, method, data, cb);
  })
};
httpRequest.request = function(route, method, data, cb) {
  let self = this;
  self.app.log("request " + route, data);
  wx.showLoading({
    title: '数据请求中',
    mask: true
  });
  wx.request({
    url: self.getUrl() + '/' + route,
    data: data,
    method: method,
    success: function(result) {
      wx.hideLoading();
      let statusCode = result.statusCode;
      if (statusCode == 200) {
        let data = result.data
        self.app.log("response " + route, data);
        let code = data.code;
        if (code == 0) {
          cb(data);
        } else if (code == 5) {
          wx.removeStorageSync('serverData');
          self.showCodeError(code, '登录失效，请重新登录');
        } else if (code == 13) {
          self.reLogin(route, method, data, cb);
        } else {
          self.showCodeMsg(code);
        }
      } else {
        self.showNetError();
      }
    },
    fail: function(res) {
      wx.hideLoading();
      self.showNetError();
    },
    complete: function(res) {

    },
  })
};
httpRequest.showCodeMsg = function(code) {
  let errMsg = errCode.getErrorCodeMsg(code);
  util.showToast(errMsg);
};
httpRequest.showCodeError = function(code, content) {
  let self = this;
  wx.showModal({
    title: '提示',
    content: content,
    showCancel: false,
    success(res) {
      if (res.confirm) {
        self.serverUrl = "";
        self.app.gobackLogin(1);
      }
    }
  })
}

httpRequest.showNetError = function(code) {
  let self = this;
  wx.showModal({
    title: '提示',
    content: '网络错误，请重试',
    showCancel: false,
    success(res) {
      if (res.confirm) {
        self.serverUrl = "";
        self.app.gobackLogin(1);
      }
    }
  })
}
module.exports = httpRequest;