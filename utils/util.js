const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const showWaitting = () => {
  wx.showLoading({
    title: '加载中',
    mask: true,
  })
}
const showToast = (content) => {
  wx.showToast({
    title: content,
    icon: 'none',
    duration: 2000,
  })
}

const hideWaitting = () => {
  wx.hideLoading();
}

function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }
  let _lastTime = null
  return function() {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      // 将this和参数传给原函数
      fn.apply(this, arguments)
      _lastTime = _nowTime
    }
  }
}
const changeTime = function(time) {
  let date = new Date(time);
  console.log("date ", date.getTime());
  date.setHours(0);
  date.setMinutes(0)
  date.setSeconds(0);
  console.log("date ", date.getTime());

}
const getDateByTime = function (time) {
  let date = new Date(time);
  return date.getDate();
}
const shareContent = function(app,res){
  return {
    title: "转发",
    path: '/pages/login/login?sid=' + app.globalData.userId,
  }
}
module.exports = {
  formatTime: formatTime,
  showWaitting: showWaitting,
  hideWaitting: hideWaitting,
  throttle: throttle,
  showToast: showToast,
  changeTime: changeTime,
  getDateByTime: getDateByTime,
  shareContent: shareContent,
}