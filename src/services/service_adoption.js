"use strict";

var AdoptionService = ['$resource', '$http', 'ConfigService', function($resource, $http, configService) {
    var service = {
        web3Provider: null,
        contracts: {},
        callback: null,

        initWeb3: function() {
            if (typeof web3 !== 'undefined') {
                service.web3Provider = web3.currentProvider;
            } else {
                service.web3Provider = new Web3.providers.HttpProvider(configService.web3_url);
            }

            web3 = new Web3(service.web3Provider);

            return service.initContract();
        },

        initContract: function() {
            $http.get(configService.adoption_url)
                .then(function(data) {
                    var AdoptionArtifact = data.data;

                    service.contracts.Adoption = TruffleContract(AdoptionArtifact);
                    service.contracts.Adoption.setProvider(service.web3Provider);

                    service.contracts.Adoption.deployed().then(function(instance) {
                        var adoptionInstance = instance;

                        if (service.callback) {
                            service.callback(adoptionInstance);
                        }
                    }).catch(function(err) {
                        console.log(err.message);
                    });
                });
        },

        ready: function(callback) {
            service.callback = callback;
        }
    };

    return service;
}];