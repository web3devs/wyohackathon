const DfsContract = artifacts.require("DfsContract");

contract("DfsContract", accounts => {
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

    it("should add members to team", async () => {

        let playerOne = 12;
        let playerTwo = 18;

        let instance = await DfsContract.deployed();

        returnValue = await instance.submitTeamMember(playerOne);

        teamMember = await instance.teamMembers.call(accounts[0],0);

        assert.equal(
            playerOne,
            teamMember.toNumber(),
            "Player was not added"
        );

    });
    
});