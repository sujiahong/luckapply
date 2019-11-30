let errcode = {

}
errcode.CODE_MSG = {
  50: "抽奖次数今日已达上限",
  51: "今天已经签过了"
};
errcode.getErrorCodeMsg = function(code, _typeStr) {
  let typeStr = _typeStr ? _typeStr : "数据错误";
  return this.CODE_MSG[code] ? this.CODE_MSG[code] : typeStr + "[" + code + "]";
};
module.exports = errcode;