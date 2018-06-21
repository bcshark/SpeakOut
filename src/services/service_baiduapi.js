var BaiduApiService = ['$resource', '$http', 'ConfigService', function($resource, $http, configService) {
    var service = {
        spamLabels: ['其他', '暴恐违禁', '文本色情', '政治敏感', '恶意推广', '低俗辱骂'],

        checkSpam: function(content, callback) {
            $http.get(configService.baiduapi_spam_url, { params: { content: content } })
                .then(function(response) {
                    callback(response.data);
                });
        },
    };

    return service;
}];