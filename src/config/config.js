"use strict";

var ConfigService = function($resource, $http) {
	var web3_url = "http://127.0.0.1:8545";

	var config = {
		"web3_url": web3_url,
		"adoption_url": "/Adoption.json" 
	};

	return config;
};