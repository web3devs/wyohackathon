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
  
    it("should pay dues successfully", async () => {
        
        let duesAmount = 10;

        let instance = await DfsContract.deployed();

        returnValue = await instance.payDues({
            from: accounts[0],
            value: duesAmount
        });

        paidAmount = await instance.paid.call(accounts[0]);
        assert.equal(
            paidAmount.toNumber(),
            duesAmount,
            "Dues were not paid successfully"
          );

    });
    
});