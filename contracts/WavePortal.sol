
pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract WavePortal {
    
    uint256 totalWaves;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }


    Wave[] waves;

    constructor() payable {
        console.log("Hello Ethereum!.");
    }

    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender, _message);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        emit NewWave(msg.sender, block.timestamp, _message);

        uint256 prizeamount = 0.0001 ether;

        require(prizeamount <= address(this).balance, "Low Balance! Recharge");

        (bool success, ) = (msg.sender).call{value: prizeamount}("");

        require(success, "Falied to withdraw money from contract.");
   
    }

    function getAllWaves() public view returns(Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns(uint256) {
        console.log("Total waves: %d", totalWaves);
        return totalWaves;
    }
}