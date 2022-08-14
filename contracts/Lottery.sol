pragma solidity =0.8.4;

contract Lottery {
    enum LotteryState {
        ACTIVE,
        PENDING,
        INACTIVE
    }
    LotteryState public state = LotteryState.INACTIVE;
    uint256 minimumFee = 0 ether;
    uint256 difficulty = 100;

    uint256[] private numbers;
    mapping(uint256 => address payable[]) public bettings;
    mapping(address => string) public participantNames;

    event AnnounceWinners(string winners);
    event LotteryStateChanged(LotteryState state);

    function create(uint256 _minimumFee, uint256 _difficulty) public {
        require(state == LotteryState.INACTIVE, "Lottery still running");
        minimumFee = _minimumFee;
        difficulty = _difficulty;
        state = LotteryState.ACTIVE;
        emit LotteryStateChanged(state);
    }

    function enter(string memory _name, uint256 _number) public payable {
        require(state == LotteryState.ACTIVE, "Lottery not started");
        require(_number >= 0 && _number <= difficulty, "Number not in range");
        require(msg.value < minimumFee, "Fee too low");

        numbers.push(_number);
        participantNames[msg.sender] = _name;
        bettings[_number].push(payable(msg.sender));
    }

    function getWinner() public payable {
        require(state == LotteryState.ACTIVE, "Lottery not active");
        state = LotteryState.PENDING;
        emit LotteryStateChanged(state);

        string memory winners = "";
        uint256 winningNumber = 4; // get rand
        address payable[] memory winningAddresses = bettings[winningNumber];
        uint256 prizeForOne = address(this).balance / winningAddresses.length;

        for (uint256 i = 0; i < winningAddresses.length; i++) {
            winners = string(
                abi.encodePacked(
                    participantNames[winningAddresses[i]],
                    ",",
                    winners
                )
            );
            winningAddresses[i].transfer(prizeForOne);
        }

        emit AnnounceWinners(winners);
    }

    function reset() private {
        for (uint256 i = 0; i < numbers.length; i++) {
            delete bettings[i];
        }
        delete numbers;

        state = LotteryState.INACTIVE;
        emit LotteryStateChanged(state);
    }

    function prizePool() public view returns (uint256) {
        return address(this).balance;
    }
}
