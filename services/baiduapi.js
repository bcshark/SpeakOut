var express = require('express');
var router = express.Router();

var https = require('https');
var qs = require('querystring');
var fs = require('fs');
var $config = require('../config');

var $token = { "access_token": "", "expires_at": 0 };

router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", 'SpeakOut 0.1.0')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

router.get('/spam', function(req, res, next) {
    const content = req.query.content;
    const result = { content: content, passed: true, rejectLables: [] };
    const today = new Date();

    const checkSpam = function(content) {
        const postData = qs.stringify({
            'content': content
        });

        const tokenParam = qs.stringify({
            'access_token': $token.access_token
        });

        const baidu_req = https.request({
            hostname: $config.baidu.hostname,
            path: $config.baidu.spam_url + '?' + tokenParam,
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

                    if (parsedData && parsedData.result) {
                        result.passed = parsedData.result.spam == 0;
                        result.rejectLables = parsedData.result.reject;
                    }

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

    if ($config.baidu.enabled === true) {
        if ($token.access_token == "" || today.getTime() > $token.expires_at) {
            const oauth_params = qs.stringify($config.baidu.oauth_params);

            https.get({
                hostname: $config.baidu.hostname,
                path: $config.baidu.oauth_url + '?' + oauth_params,
                agent: false
            }, (baidu_res) => {
                console.log('statusCode:', baidu_res.statusCode);

                let rawData = '';

                baidu_res.setEncoding('utf8');
                baidu_res.on('data', function(chunk) { rawData += chunk; });
                baidu_res.on('end', function() {
                    try {
                        const parsedData = JSON.parse(rawData);

                        if (parsedData && parsedData.access_token) {
                            $token.access_token = parsedData.access_token;
                            $token.expires_at = new Date().getTime() + parsedData.expires_in * 1000;
                        }

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
    } else {
        res.json(result);
        res.end();
    }
});

module.exports = router;