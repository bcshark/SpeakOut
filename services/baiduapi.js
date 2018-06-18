var express = require('express');
var router = express.Router();
var https = require('https');
var qs = require('querystring');
var fs = require('fs');

var $conf = require('../config');
var $token = { "access_token": "", "expires_at": 0 };

router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", 'SpeakOut 0.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

router.get('/spam', function(req, res, next) {
    var content = req.query.content;
    var result = { content: content, passed: true, rejectLables: [] };
    var today = new Date();

    var checkSpam = function(content) {
        const postData = qs.stringify({
            'content': content
        });

        var baidu_req = https.request({
            hostname: 'aip.baidubce.com',
            path: '/rest/2.0/antispam/v2/spam?access_token=' + $token.access_token,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            },
            agent: false
        }, (baidu_res) => {
            console.log('statusCode:', baidu_res.statusCode);

            let rawData = '';

            baidu_res.setEncoding('utf8');
            baidu_res.on('data', function(chunk) { rawData += chunk; });
            baidu_res.on('end', function() {
                try {
                    const parsedData = JSON.parse(rawData);

                    result.passed = parsedData.result.spam == 0;
                    result.rejectLables = parsedData.result.reject;

                    res.json(result);
                    res.end();
                } catch (e) {
                    console.error(e.message);
                }
            });
        }).on('error', (e) => {
            console.error(e);
        });

        baidu_req.write(postData);
        baidu_req.end();
    };

    if ($token.access_token == "" || today.getTime() > $token.expires_at) {
        var oauth_params = qs.stringify($conf.baidu.oauth_params);
        https.get({
            hostname: 'aip.baidubce.com',
            path: '/oauth/2.0/token?' + oauth_params,
            agent: false
        }, (baidu_res) => {
            console.log('statusCode:', baidu_res.statusCode);

            let rawData = '';

            baidu_res.setEncoding('utf8');
            baidu_res.on('data', function(chunk) { rawData += chunk; });
            baidu_res.on('end', function() {
                try {
                    const parsedData = JSON.parse(rawData);

                    $token.access_token = parsedData.access_token;
                    $token.expires_at = new Date().getTime() + parsedData.expires_in * 1000;

                    checkSpam(content);
                } catch (e) {
                    console.error(e.message);
                }
            });
        }).on('error', (e) => {
            console.error(e);
        });
    } else {
        checkSpam(content);
    }
});

module.exports = router;