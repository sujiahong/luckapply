const luckData = require("../../data/LuckTestData.js");
let util = require("../../utils/util.js");
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    oneData: null,
    codeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.hideFunc) {
      app.globalData.hideFunc();
    }
    
    let codeStr = app.globalData.codeStr ;
    // for (let i = 0; i < 6; i++) {
    //   let code = Math.floor(Math.random() * 100);
    //   codeStr += "" + (code % 2);
    // }
    // console.log(codeStr);
    for (let i = 0; i < luckData.dataList.length; i++) {
      let data = luckData.dataList[i];
      if (data.code == codeStr) {
        this.showLuckData(data);
        break;
      }
    }
  },
  showLuckData: function(data) {
    let codeList = [];
    for (let i = 0; i < data.code.length; i++) {
      let str = "../../resources/images/gua" + data.code[i] + ".png";
      codeList.push(str);
    }
    this.setData({
      oneData: data,
      codeList: codeList
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
   

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (app,res) {
    return util.shareContent(res);
  }
})