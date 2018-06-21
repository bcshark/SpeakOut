pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";
import "../contracts/MetaCoin.sol";
import "../contracts/ConvertLib.sol";

contract TestAdoption {
	Adoption adoption = Adoption(DeployedAddresses.Adoption());

	mapping(uint => uint) topicsCreatedAt;
	mapping(uint => uint) postsCreatedAt;

	function testContractInitialBalanceUsingDeployedContract() {
		uint expected = 1000000000;

		Assert.equal(adoption.getMetaCoinPoolCoins(), expected, "Owner should have 1000000000 MetaCoin initially");
	}

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

	function testUserCanGetPosterBalance() public {
		uint expected = adoption.getNewUserRewardSetting();
		uint stored = adoption.getBalance();

		Assert.equal(stored, expected, "Poster's balance should be setup.");
	}

	function testLatestBalanceAfterTransferToNewUser() {
		uint expected = 1000000000 - adoption.getNewUserRewardSetting();

		Assert.equal(adoption.getMetaCoinPoolCoins(), expected, "Owner should have 100 MetaCoin deduction");
	}

	function testUserNonExistentPosterNameShouldBeEmpty() public {
		string memory expected = "";
		string memory stored = adoption.getPosterName(0x0000000000000000000000000000000000000000);

		Assert.equal(stored, expected, "Non existent poster's name should be empty.");
	}

	function testUserCanNewTopic() public {
		uint expected = 0;
		(uint newTopicId, uint createdAt) = adoption.newTopic("title", "content", 1, 3600 * 24);

		topicsCreatedAt[0] = createdAt;

		Assert.equal(newTopicId, expected, "New topic should be recorded.");
	}

	function testUserLatestBalanceAfterNewTopic() {
		uint expected = adoption.getNewUserRewardSetting() + adoption.getNewTopicRewardSetting();

		Assert.equal(adoption.getBalance(), expected, "Author should have 10 MetaCoin reward");
	}

	function testUserCanNewTopicLongContent() public {
		uint expected = 1;
		(uint newTopicId, uint createdAt) = adoption.newTopic("title", "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890", 1, 3600 * 24);

		topicsCreatedAt[1] = createdAt;

		Assert.equal(newTopicId, expected, "New topic should be recorded.");
	}

	function testUserCanGetTopicCount() public {
		uint expectedCount = 2;
		uint topicCount = adoption.getTopicCount();

		Assert.equal(topicCount, expectedCount, "Number of topics should be correct.");
	}

	function testUserCanGetTopicDetailByTopicId() public {
		uint topicId = 0;
		(uint id, string memory title, string memory content, uint category, uint createdAt, uint updatedAt, uint expiredAt, string memory authorName) = adoption.getTopicDetail(topicId);

		Assert.equal(id, topicId, "Topic's id should be same as input.");
		Assert.equal(title, "title", "Topic's title should be same as input.");
		Assert.equal(content, "content", "Topic's content should be same as input.");
		Assert.isTrue(category == 1, "Topic's cateogry should be same as input.");
		Assert.isTrue(createdAt == topicsCreatedAt[0], "Topic's createdAt should be same as input.");
		Assert.isTrue(updatedAt == topicsCreatedAt[0], "Topic's updatedAt should be same as input.");
		Assert.isTrue(expiredAt == topicsCreatedAt[0] + 3600 * 24 * 1000, "Topic's expiredAt should be same as input.");
		Assert.equal(authorName, "Tester", "Topic's author name should be same as input.");
	}

	function testUserCanNewPostOnTopic() public {
		uint topicId = 0;
		uint expected = 0;

		(uint newPostId, uint createdAt) = adoption.newPost(topicId, "post content", 5, 5);

		postsCreatedAt[0] = createdAt;

		Assert.equal(newPostId, expected, "New post should be recorded.");
	}

	function testUserCanSendTipsToAuthor() public {
		
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
		(uint id, string memory content, uint createdAt, uint8 mark, uint8 tips, string memory authorName) = adoption.getPostDetail(topicId, postId);

		Assert.equal(id, topicId, "Post's id should be same as input.");
		Assert.equal(content, "post content", "Post's content should be same as input.");
		Assert.isTrue(createdAt == postsCreatedAt[0], "Post's createdAt should be same as input.");
		Assert.isTrue(mark == 5, "Post's mark should be same as input.");
		Assert.isTrue(tips == 5, "Post's tips should be same as input.");
		Assert.equal(authorName, "Tester", "Post's author name should be same as input.");
	}
}
