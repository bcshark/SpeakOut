pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
	Adoption adoption = Adoption(DeployedAddresses.Adoption());

	function testUserCanNewPoster() public {
		string memory expected = "Tester";
		string memory returnedName = adoption.newPoster("Tester");

		Assert.equal(returnedName, expected, "Poster's name should be recorded.");
	}

	function testUserCanGetPoster() public {
		string memory expected = "Tester";
		string memory stored = adoption.getPosterName(this);

		Assert.equal(stored, expected, "Poster's name should be readable.");
	}

	function testUserNonExistentPosterNameShouldBeEmpty() public {
		string memory expected = "";
		string memory stored = adoption.getPosterName(0x0000000000000000000000000000000000000000);

		Assert.equal(stored, expected, "Non existent poster's name should be empty.");
	}

	function testUserCanNewTopic() public {
		uint expected = 0;
		uint newTopicId = adoption.newTopic("title", "content", 1528731791, 1528731791 + 3600 * 24);

		Assert.equal(newTopicId, expected, "New topic should be recorded.");
	}

	function testUserCanNewTopicLongContent() public {
		uint expected = 1;
		uint newTopicId = adoption.newTopic("title", "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890", 1528731791, 1528731791 + 3600 * 24);

		Assert.equal(newTopicId, expected, "New topic should be recorded.");
	}

	function testUserCanGetTopicCount() public {
		uint expectedCount = 2;
		uint topicCount = adoption.getTopicCount();

		Assert.equal(topicCount, expectedCount, "Number of topics should be correct.");
	}

	function testUserCanGetTopicDetailByTopicId() public {
		uint topicId = 0;
		(string memory title, string memory content, uint64 createdAt, uint64 updatedAt, uint64 expiredAt, string memory authorName) = adoption.getTopicDetail(topicId);

		Assert.equal(title, "title", "Topic's title should be same as input.");
		Assert.equal(content, "content", "Topic's content should be same as input.");
		Assert.isTrue(createdAt == 1528731791, "Topic's createdAt should be same as input.");
		Assert.isTrue(updatedAt == 1528731791, "Topic's updatedAt should be same as input.");
		Assert.isTrue(expiredAt == 1528731791 + 3600 * 24, "Topic's expiredAt should be same as input.");
		Assert.equal(authorName, "Tester", "Topic's author name should be same as input.");
	}

	function testUserCanNewPostOnTopic() public {
		uint topicId = 0;
		uint expected = 0;

		uint newPostId = adoption.newPost(topicId, "post content", 5, 1528731791);

		Assert.equal(newPostId, expected, "New post should be recorded.");
	}

	function testUserCanGetPostCountByTopic() public {
		uint topicId = 0;
		uint expectedCount = 1;
		uint postCount = adoption.getPostCountByTopic(topicId);

		Assert.equal(postCount, expectedCount, "Number of posts should be correct.");
	}

	function testUserCanGetPostDetailByTopicIdAndPostId() public {
		uint topicId = 0;
		uint postId = 0;
		(string memory content, uint64 createdAt, uint8 mark, string memory authorName) = adoption.getPostDetail(topicId, postId);

		Assert.equal(content, "post content", "Post's content should be same as input.");
		Assert.isTrue(createdAt == 1528731791, "Post's createdAt should be same as input.");
		Assert.isTrue(mark == 5, "Post's mark should be same as input.");
		Assert.equal(authorName, "Tester", "Post's author name should be same as input.");
	}
}
