// pages/main/main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    level:30,
    coins: 1000000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("@@@@@@@")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("main 界面 ready!!")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  onExchange: function(){
    console.log("onExchange!!!")
  },
  onImgLoad: function(){
    console.log("图片加载成功！！！");
  },
  onImgError: function(err){
    console.log("图片加载失败 ", err);
  },
  onLuck: function(){
    console.log("求签！！");
    wx.navigateTo({
      url: '/pages/luck/luck',
    });
  }
})