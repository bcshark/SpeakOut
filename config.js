module.exports = {
    "baidu": {
        "enabled": false,
        "hostname": "aip.baidubce.com",
        "oauth_params": {
            "grant_type": "client_credentials",
            "client_id": "rY02cfzrDI4QXe1PFdLApK0Y",
            "client_secret": "f12KrCGYVDzBukQOsFlBpIDHisLjen1v"
        },
        "oauth_url": "/oauth/2.0/token",            // doc: http://ai.baidu.com/docs#/Auth/top
        "spam_url": "/rest/2.0/antispam/v2/spam"    // doc: http://ai.baidu.com/docs#/TextCensoring-API/top
    }
};