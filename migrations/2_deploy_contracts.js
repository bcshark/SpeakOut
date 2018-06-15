var ConvertLib = artifacts.require("ConvertLib.sol");
var MetaCoin = artifacts.require("MetaCoin");
var Adoption = artifacts.require("Adoption");

module.exports = function(deployer) {
    deployer.deploy(ConvertLib);
    deployer.link(ConvertLib, MetaCoin);
    deployer.deploy(MetaCoin);
    deployer.deploy(Adoption);
};