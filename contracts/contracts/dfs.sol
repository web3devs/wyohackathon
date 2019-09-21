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

/**
 * @dev Interface of the ERC20 standard as defined in the EIP. Does not include
 * the optional functions; to access them see {ERC20Detailed}.
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract DfsContract is owned {
    mapping(address => uint) public paid;
    mapping(address => IERC20) public token;
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

    function payDuesWithToken(IERC20 _token, uint amount) public {
        // approval first required
        _token.transferFrom(msg.sender, address(this), amount);
        paid[msg.sender] = amount;
        token[msg.sender] = _token;
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

}