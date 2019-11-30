const app = getApp();
const util = require("../../utils/util.js");
const dpDraw = require("../../utils/dpDraw.js");
dpDraw.setApp(app);
const httpRequest = require("../../utils/httpRequest.js");
const Base64 = require("../../utils/base64.js");
Page({

  name: "login",

  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isShowAuth: false,
    coins: 0,
  },
  onLoad(options) {
    let sid = options.sid;
    app.globalData.sid = sid ? sid : "";
    this.imageLength = 55;
    app.reLogin = () => {
      this.checkLogin();
    };
  },

  onReady() {
    this.dialog = this.selectComponent('#dp-dialog');
    this.toast = this.selectComponent('#wxc-toast');
    this.checkLogin();
  },
  addSprite: function() {
    this.coinList = [];
    this.sprites = [];
    let size = app.globalData.winSize;
    let scale = 0.6;
    this.scale = scale;
    let posList = [{
        x: -125,
        y: -120
      }, //0
      {
        x: -80,
        y: -150
      }, //1
      {
        x: -27,
        y: -168
      }, //2
      {
        x: 27,
        y: -168
      }, //3
      {
        x: 80,
        y: -150
      }, //4
      {
        x: 125,
        y: -120
      }, //5
    ];
    this.centerPos = {
      x: size.width / 2,
      y: size.height / 2
    }

    for (let i = 0; i < 6; i++) {
      let coin = {
        img: "/resources/images/coin1.png",
        tag: "coin_" + i,
        contentSize: {
          width: 67 * scale,
          height: 67 * scale
        },
        position: {
          x: size.width / 2 + dpDraw.shiftSize(posList[i].x),
          y: size.height / 2 + dpDraw.shiftSize(posList[i].y),
        },
        startPosition: {
          x: size.width / 2 + dpDraw.shiftSize(posList[i].x),
          y: size.height / 2 + dpDraw.shiftSize(posList[i].y),
        }
      }
      this.sprites.push(coin);
      this.coinList.push(coin);
    }
    let ke = {
      img: "/resources/images/ke.png",
      tag: "ke",
      contentSize: {
        width: 170 * scale,
        height: 250 * scale
      },
      position: {
        x: size.width / 2,
        y: size.height / 2,
      }
    }
    this.sprites.push(ke);
    this.ke = ke;

    let coin = {
      img: "/resources/images/coin0.png",
      tag: "coin_" + 99,
      contentSize: {
        width: 67 * scale,
        height: 67 * scale
      },
      position: {
        x: size.width * 2,
        y: size.height * 2,
      },
    }
    this.sprites.push(coin);


    this.moveToPos = [

      {
        pos: {
          x: -10,
          y: -8
        },
        duration: 80,
      },
      {
        pos: {
          x: 0,
          y: 0
        },
        duration: 50,
      },
      {
        pos: {
          x: -8,
          y: 10
        },
        duration: 50,
      },
      {
        pos: {
          x: 0,
          y: 0
        },
        duration: 50,
      },
      {
        pos: {
          x: -6,
          y: 10
        },
        duration: 50,
      },
      {
        pos: {
          x: 0,
          y: 0
        },
        duration: 50,
      },
    ]
  },
  drawImage: function() {
    let context = wx.createCanvasContext('firstCanvas');

    for (let i = 0; i < this.sprites.length; i++) {
      let sprite = this.sprites[i];
      let contentSize = sprite.contentSize;
      dpDraw.drawImage(context, sprite.img, sprite.position.x, sprite.position.y, contentSize.width, contentSize.height);
    }
    context.draw();
  },
  doAni: function(backCall) {
    let self = this;
    this.setData({
      showAniShow: true
    })
    this.drawTimer = setInterval(function() {
      self.drawImage();
    }, 40);
    this.addSprite();
    let endCall = function() {
      setTimeout(function() {
        if (backCall) {
          backCall();
        }
      }, 500);
    }
    self.drawImage();
    this.doSetpOne(endCall, 0);
  },
  doSetpOne: function(endCall, type) {
    let self = this;
    let delayTime = 1000;
    if (type == 1) {
      delayTime = 0;
    }
    for (let i = 0; i < this.coinList.length; i++) {
      let _endPosition = this.centerPos;
      if (type == 1) {
        _endPosition = this.coinList[i].startPosition;
      }
      let target = this.coinList[i];
      let startPos = {
        x: this.coinList[i].position.x,
        y: this.coinList[i].position.y
      }
      let _positionDelta = dpDraw.pSub(_endPosition, startPos);
      let _elapsed = 0;
      let _duration = 500;
      let isEnd = false;
      if (i == this.coinList.length - 1) {
        isEnd = true;
      }
      setTimeout(function() {
        let timerCoin = setInterval(function() {
          _elapsed += 40;
          let updateDt = Math.max(0, Math.min(1, _elapsed / _duration));
          target.position = dpDraw.pAdd(startPos, dpDraw.pMult(_positionDelta, updateDt));
          if (_elapsed >= _duration) {
            clearInterval(timerCoin);
            if (isEnd) {
              if (type == 1) {
                if (endCall) {
                  endCall();
                }
              } else {
                self.doSetpTwo(endCall, 0);
              }
            }
          }
        }, 40);
      }, i * 200 + delayTime);
    }
  },
  doSetpTwo: function(endCall, index) {
    if (index == this.moveToPos.length) {
      this.doSetpThree(endCall);
      return;
    }
    let target = this.ke;
    let self = this;
    let startPos = {
      x: this.ke.position.x,
      y: this.ke.position.y
    }
    let _duration = this.moveToPos[index].duration ? this.moveToPos[index].duration : 50;
    let _endPosition = dpDraw.pAdd(this.centerPos, dpDraw.pMult(this.moveToPos[index].pos, this.scale));
    let _positionDelta = dpDraw.pSub(_endPosition, startPos);
    let _elapsed = 0;
    let timerCoin = setInterval(function() {
      _elapsed += 40;
      let updateDt = Math.max(0, Math.min(1, _elapsed / _duration));
      target.position = dpDraw.pAdd(startPos, dpDraw.pMult(_positionDelta, updateDt));
      if (_elapsed >= _duration) {
        clearInterval(timerCoin);
        self.doSetpTwo(endCall, index + 1);
      }
    }, 40);
  },
  doSetpThree: function(endCall) {
    let codeStr = "";
    for (let i = 0; i < 6; i++) {
      let code = Math.floor(Math.random() * 100);
      this.coinList[i].img = "/resources/images/coin" + (code % 2) + ".png";
      codeStr += "" + (code % 2);
    }
    this.doSetpOne(endCall, 1);
    app.globalData.codeStr = codeStr;
  },
  onShow() {

  },
  onHide() {

  },
  onUnload() {

  },
  onPullDownRefresh() {

  },
  checkLogin: function() {
    let self = this;
    if (app.globalData.isCheckSesson) {
      wx.checkSession({
        success() {
          console.log("success");
          app.serverData = wx.getStorageSync("serverData");
          if (!app.serverData) {
            self.doWXLogin();
            return;
          }
          httpRequest.initUrl(app.serverData);
          self.checkUserInfo();
        },
        fail() {
          console.log("fail");
          self.doWXLogin();
        }
      })
    } else {
      self.doWXLogin();
    }

  },
  doWXLogin: function() {
    let self = this;
    wx.login({
      success: res => {
        let code = res.code;
        httpRequest.getServer(code, () => {
          self.checkUserInfo();
        });
      }
    })
  },
  checkUserInfo() {
    let self = this;
    wx.getSetting({
      success(res) {
        let userInfo = res.authSetting['scope.userInfo'];
        if (userInfo) {
          wx.getUserInfo({
            success(res) {
              app.globalData.userInfo = res.userInfo;
              self.sendGameLogin();
            }
          });
        } else {
          self.setData({
            isShowAuth: true
          });
        }
      }
    })
  },
  sendGameLogin: function() {
    httpRequest.doLogin(() => {
      this.setData({
        coins: app.globalData.coins,
      })
      console.log("Login Success");
    });
  },
  bindGetUserInfo(e) {
    let self = this;
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      // httpRequest.doLogin();
      self.sendGameLogin();
      self.setData({
        isShowAuth: false
      });
    } else {
      util.showToast('授权失败');
    }
  },
  onShareAppMessage: function(app, res) {
    return util.shareContent(res);
  },
  //开始
  onBeginClick: function() {
    if (app.globalData.userId) {
      httpRequest.luckTest(() => {
        this.onStartRandomAni();
      })
    }
  },
  //联系我们
  onContact: function() {
    let name = getCurrentPages();
    console.log(name);
  },
  //签到
  onSign: function() {
    if (app.globalData.userId) {
      app.gotoSign();
    }
  },
  //关于我
  onAbout: function() {
    this.onStartRandomAni();
  },
  onStartRandomAni: function() {
    let self = this;
    if (app.globalData.isNext == true) {
      return;
    }
    app.globalData.isNext = true;
    app.globalData.hideFunc = function() {
      app.globalData.isNext = false;
      clearInterval(self.drawTimer);
      self.setData({
        showAniShow: false
      });
    }
    this.doAni(function() {
      app.gotoLuck();
    });
  },
  tapDialog: function() {
    this.dialog.setData({
      title: '温馨提示',
      content: '分享后才能查看',
      cancelText: '取消',
      okText: '确定',
    });
    this.dialog.show();
  },
  cancelEvent: function() {
    this.dialog.close();
  },
  okEvent: function() {
    this.dialog.close();
  }
})