"use strict"
const TAG = "httpserver-start.js";
global.g_serverData = {};
g_serverData.logger = require("../utils/log_launch")("http-server");
const logger = g_serverData.logger;
const errcode = require("../share/errcode");
const URL = require("url");
const queryString = require("querystring");
const config = require("../share/config");
const networkHttp = require("../utils/network_http");
const dbConn = require("../utils/db_connection");

logger.info("连接数据库");
const mainService = require("./service/main_service");

const serverInfo = JSON.parse(process.argv[2]);
const clusterInfo = JSON.parse(process.argv[3]);
g_serverData.serverName = serverInfo.NAME;
g_serverData.serverId = serverInfo.ID;
g_serverData.accessCount = 0;
g_serverData.gateServerNum = 0;

logger.info(TAG, "http server start ~~!!!!", serverInfo.ID, process.pid, process.cwd());


var listenHttpClient = function(){
    var options = {
        port: 8879,
    }
    networkHttp.createHttp(options, function(req, res){
        const statusCode = res.statusCode;
        if (statusCode !== 200){
            return res.end("fail");
        }
        requestRouteHandler(req, (ret)=>{
            res.end(JSON.stringify(ret));
        });
    });
    //requestRouteHandler({url: "/validateUser?code=081roMln014eNj1Xdtnn0HNWln0roMlQ&MiniId=1"})
}

var requestRouteHandler = function(req, next){
    var urlData = URL.parse(req.url);
    if (urlData.pathname == "/validateUser"){
        ++g_serverData.accessCount;
        logger.info(TAG, "验证用户身份，获取推荐码", urlData.query);
        mainService.validateUser(queryString.parse(urlData.query), next);
    }else if (urlData.pathname == "/checkRecommendation"){
        mainService.checkRecommendation(queryString.parse(urlData.query), next);
    }else{
        next({code: errcode.ROUTE_ERR});
    }
}
///启动http server
listenHttpClient();

process.on("exit", function(){
    logger.warn(TAG, "exit 事件", process.pid);
});

// process.on("SIGINT", function(){
//     logger.warn(TAG, "sigint 事件", process.pid);
// });

process.on("uncaughtException", (err)=>{
    console.error("caught exception: ", err.stack);
});