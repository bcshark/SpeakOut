var ConfigService = function($resource, $http) {
    var web3_url = "http://127.0.0.1:8545";

    var config = {
        "web3_url": web3_url,
        "adoption_url": "/contracts/Adoption.json",
        "baiduapi_spam_url": "/baiduapi/spam",
		"category_url": "/data/category.json"
    };

    return config;
};
