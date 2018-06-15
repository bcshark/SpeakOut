pragma solidity ^0.4.17;

import "./ConvertLib.sol";

contract MetaCoin {
	uint constant DEFAULT_INITIAL_BALANCE = 1000000000;

	mapping (address => uint) balances;

	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	constructor(address owner) public {
		balances[owner] = DEFAULT_INITIAL_BALANCE;
	}

	function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		emit Transfer(msg.sender, receiver, amount);
		return true;
	}

	function getBalanceInEth(address addr) public view returns(uint){
		return ConvertLib.convert(getBalance(addr),2);
	}

	function getBalance(address addr) public view returns(uint) {
		return balances[addr];
	}
}