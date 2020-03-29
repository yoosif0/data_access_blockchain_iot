const DataAccess = artifacts.require("DataAccess");

module.exports = function(deployer) {
  deployer.deploy(DataAccess);
};
