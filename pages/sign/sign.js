const app = getApp();
const httpRequest = require("../../utils/httpRequest.js");
const util = require("../../utils/util.js");


Page({
  data: {
    qdView: false,
    calendarSignData: "",
    is_qd: false,
    isShowShare: false,
  },
  calendarSign: function(e) {
    if (this.haveSign){
      httpRequest.showCodeMsg(51);
      return;
    }
    httpRequest.signIn((res) => {
      let coin = res.coin;
      this.coin = coin;
      let data = res.data;
      app.addCoins(coin);
      this.setData({
        isShowShare: true,
        integral: coin
      })
    });
  },
  onLoad: function(options) {
    let mydate = new Date();
    let year = mydate.getFullYear();
    let month = mydate.getMonth() + 1;
    let date = mydate.getDate();
    app.log("date " + date)
    let day = mydate.getDay();
    app.log("day " + day)
    let nbsp = 7 - ((date - day) % 7);
    app.log("nbsp " + nbsp);
    let monthDaySize;
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
      monthDaySize = 31;
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
      monthDaySize = 30;
    } else if (month == 2) {
      // 计算是否是闰年,如果是二月份则是29天
      if ((year - 2000) % 4 == 0) {
        monthDaySize = 29;
      } else {
        monthDaySize = 28;
      }
    };
    httpRequest.acquireSignData((res) => {
      // return;
      let is_qd = false;
      let calendarSignData = new Array(monthDaySize);
      for (let i in res.data) {
        let time = parseInt(res.data[i]);
        let c_date = util.getDateByTime(time);
        calendarSignData[c_date] = c_date;
        app.log(c_date);
        if (c_date == date) {
          is_qd = true;
        }
      }
      this.haveSign = is_qd;
      this.calendarSignData = calendarSignData;

      this.setData({
        is_qd: is_qd,
        year: year,
        month: month,
        date: date,
        nbsp: nbsp,
        monthDaySize: monthDaySize,
        calendarSignData: calendarSignData,
        coins: app.globalData.coins,
      });
    })
  },

  onReady: function() {
    this.dialog = this.selectComponent('#dp-dialog');
  },
  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function(res) {
    return util.shareContent(app,res);
  },
  tapDialog: function(title, content) {
    this.dialog.setData({
      title: title,
      content: content,
      okText: '确定',
      isOneBtn: true,
    });
    this.dialog.show();
  },
  cancelEvent: function() {
    app.log(this.dialog.data.cancelText);
    this.dialog.close();
  },
  okEvent: function() {
    app.log(this.dialog.data.okText);
    this.dialog.close();
  },
  onNotShare: function() {
    this.setData({
      coins: app.globalData.coins,
      isShowShare: false
    })
  },
})