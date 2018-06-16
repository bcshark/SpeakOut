"use strict";

var ConfigService = function($resource, $http) {
	var web3_url = "http://127.0.0.1:8545";

	var config = {
		"web3_url": web3_url,
		"adoption_url": "/Adoption.json",
		"baidu": {
			"grant_type": "client_credentials",
			"client_id": "rY02cfzrDI4QXe1PFdLApK0Y",
			"client_secret": "f12KrCGYVDzBukQOsFlBpIDHisLjen1v",
			// ref: http://ai.baidu.com/docs#/Auth/top
			"oauth_url": "https://aip.baidubce.com/oauth/2.0/token?grant_type=&client_id=&client_secret=&",
			// ref: http://ai.baidu.com/docs#/TextCensoring-API/top
			"spam_url": "https://aip.baidubce.com/rest/2.0/antispam/v2/spam?access_token=&"
		}
	};

	return config;
};
