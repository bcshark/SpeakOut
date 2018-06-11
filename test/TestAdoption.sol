pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
	Adoption adoption = Adoption(DeployedAddresses.Adoption());

	function testUserCanNewPoster() public {
		string memory returnedName = adoption.newPoster("Tester");

		string memory expected = "Tester";

		Assert.equal(returnedName, expected, "Poster's name should be recorded.");
	}

	function testUserCanGetPoster() public {
		string memory expected = adoption.newPoster("Tester");

		string memory stored = adoption.getPosterName(this);

		Assert.equal(stored, expected, "Poster's name should be readable.");
	}

	function testUserCanNewTopic() public {
		adoption.newPoster("Tester");

		uint expected = 0;
		uint newTopicId = adoption.newTopic("title", "content", 1528731791, 1528731791 + 3600 * 24);

		Assert.equal(newTopicId, expected, "New topic should be recorded.");

		uint expectedCount = 1;
		uint topicCount = adoption.getTopicCount();

		Assert.equal(topicCount, expectedCount, "Number of topics should be correct.");
	}

	/*
	function testGetAdopterAddressByPetId() public {
		// Expected owner is this contract
		address expected = this;

		address adopter = adoption.adopters(8);

		Assert.equal(adopter, expected, "Owner of pet ID 8 should be recorded.");
	}

	function testGetAdopterAddressByPetIdInArray() public {
		// Expected owner is this contract
		address expected = this;

		// Store adopters in memory rather than contract's storage
		address[16] memory adopters = adoption.getAdopters();

		Assert.equal(adopters[8], expected, "Owner of pet ID 8 should be recorded.");
	}
	*/
}
