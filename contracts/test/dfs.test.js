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

        let playerOne = 10;

        let instance = await DfsContract.deployed();

        returnValue = await instance.submitTeamMember(playerOne);

        teamMember = await instance.teamMembers.call(accounts[0],0);

        assert.equal(
            playerOne,
            teamMember.toNumber(),
            "Player was not added"
        );

    });

    it("should create rosters", async() => {
        let instance = await DfsContract.deployed();

        returnValue = await instance.submitTeamMember(15);
        returnValue = await instance.submitTeamMember(20, {
            from: accounts[1]
        });
        returnValue = await instance.submitTeamMember(25, {
            from: accounts[1]
        });

        teamMember1 = await instance.teamMembers.call(accounts[0],1);
        teamMember2 = await instance.teamMembers.call(accounts[1],1);

        assert.equal(
            teamMember1.toNumber(),
            15,
            "Player was not added"
        );

        assert.equal(
            teamMember2.toNumber(),
            25,
            "Player was not added"
        );
    });

    it("should set score for player", async() => {
        let playerId = 15;
        let newScore = 2;

        let instance = await DfsContract.deployed();

        returnValue = await instance.addScore(playerId,newScore);

        scoreForPlayer = await instance.scores.call(playerId);

        assert.equal(
            scoreForPlayer.toNumber(),
            newScore,
            "Score is not correct"
        );
    });

    it("should calculate scores", async() => {
        let playerId = 15;
        let newScore = 2;

        let instance = await DfsContract.deployed();

        returnValue = await instance.addScore(playerId,newScore);

        returnValue = await instance.payoutWinner();

        playerOneScore = await instance.teamScores.call(accounts[0]);

        assert.equal(
            playerOneScore.toNumber(),
            2,
            "Score is not calculated correctly"
        );
    });
    
});