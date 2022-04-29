//when we put a smat contract in the blockchain we are essentially changing the state of the blockchain
//can be concidered as adding a new table in a database.
//inorder to achieve this we need to have a migeration file.

const Migrations = artifacts.require("Vote");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};