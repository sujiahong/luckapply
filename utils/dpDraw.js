var dpDraw = {

  setApp: function(app) {
    this.app = app;
    this.winSize = app.globalData.winSize;

  },
  shiftSize: function(value) {
    return value * (this.app.globalData.winSize.width / 320);
  },
  drawImage: function(canvas, imgRes, x, y, w, h) {
    let _w = this.shiftSize(w);
    let _h = this.shiftSize(h);
    canvas.drawImage(imgRes, x - _w / 2, y - _h / 2, _w, _h);
  },
  pAdd: function (v1, v2){
    return {x:v1.x + v2.x, y:v1.y + v2.y};
  },
  pSub: function (v1, v2){
    return { x: v1.x - v2.x, y: v1.y - v2.y };
  },
  pMult: function (point, floatVar) {
    return { x: point.x * floatVar, y: point.y * floatVar };
  },
}


module.exports = dpDraw