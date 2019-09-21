const DfsContract = artifacts.require("DfsContract");

contract("MetaCoin", accounts => {
    it("should deploy contract", () =>
    DfsContract.deployed()
        .then(balance => {
          assert.equal(
            1,
            1,
            "Contract wasn't deployed"
          );
        }));
  
    
  });