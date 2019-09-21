pragma solidity ^0.5.2;

contract owned {
    constructor() public { owner = msg.sender; }
    address owner;

    // This contract only defines a modifier but does not use
    // it: it will be used in derived contracts.
    // The function body is inserted where the special symbol
    // `_;` in the definition of a modifier appears.
    // This means that if the owner calls this function, the
    // function is executed and otherwise, an exception is
    // thrown.
    modifier onlyOwner {
        require(
            msg.sender == owner,
            "Only owner can call this function."
        );
        _;
    }
}

contract DfsContract is owned {
    mapping(address => uint) public paid;
    mapping(address => uint[]) public teamMembers;
    mapping(uint => uint) public scores;
    mapping(address => uint) public teamScores;

    address[] registeredTeams;

    constructor() public {
        // initial setup
    }

    function payDues() public payable {
        require(msg.value > 0, "Fee must be sent"); // Set 0 to whatever the fee needs to be

        paid[msg.sender] = msg.value;
        registeredTeams.push(msg.sender);
    }

    function submitTeamMember(uint teamMember) public {
        teamMembers[msg.sender].push(teamMember);
    }

    function addScore(uint player, uint score) public onlyOwner {
        scores[player] = score;
    }

    function calculateTeamScores() private {
        for (uint i = 0; i < registeredTeams.length; i++) {
            uint tempScore = 0;
            for(uint players = 0; players < teamMembers[registeredTeams[i]].length; players++) {
                tempScore = tempScore + scores[teamMembers[registeredTeams[i]][players]];
            }
            teamScores[registeredTeams[i]] = tempScore;
        }
    }

    function payoutWinner() public onlyOwner {
        // First, calculate latest scores
        calculateTeamScores();
    }

    // TODO: pass in salary
    // don't add player if salary is over limit

    // calculate payouts


}