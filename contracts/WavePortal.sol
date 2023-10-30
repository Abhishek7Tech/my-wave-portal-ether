
pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract WavePortal {
    
    uint256 totalWaves;

    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }


    Wave[] waves;

    mapping (address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("Hello Ethereum!.");

        seed = (block.timestamp + block.prevrandao) % 100;
    }

    function wave(string memory _message) public {

        require(lastWavedAt[msg.sender] + 30 seconds < block.timestamp, "Wait for 30 seconds!");


        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s has waved!", msg.sender, _message);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        seed = (block.prevrandao + block.timestamp + seed) % 100;

        console.log("Random # generated: %d", seed);

        if (seed <= 50) {
            console.log("%s won!", msg.sender);
        
        uint256 prizeamount = 0.0001 ether;
        require(prizeamount <= address(this).balance, "Low Balance! Recharge");
        (bool success, ) = (msg.sender).call{value: prizeamount}("");
        require(success, "Falied to withdraw money from contract.");
        
        }    

        emit NewWave(msg.sender, block.timestamp, _message);
   
    }

    function getAllWaves() public view returns(Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns(uint256) {
        console.log("Total waves: %d", totalWaves);
        return totalWaves;
    }
}