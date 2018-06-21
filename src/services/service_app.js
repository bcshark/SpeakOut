var AppService = ['$resource', '$http', 'ConfigService', function($resource, $http, configService) {
    var service = {
		categoires : [],
        getCategories: function(callback) {
			if (!service.categories) {
				$http.get(configService.category_url)
					.then(function(response) {
						callback(response.data);
					});
			} else {
				return service.categoires;
			}
        },
    };

    return service;
}];
