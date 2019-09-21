const Migrations = artifacts.require("DfsContract");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
