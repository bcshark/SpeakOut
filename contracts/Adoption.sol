pragma solidity ^0.4.17;

import "./MetaCoin.sol";

contract Adoption {
	uint constant DEFAULT_NEW_USER_REWARD = 100;
	uint constant DEFAULT_NEW_TOPIC_REWARD = 10;
	uint constant DEFAULT_NEW_COMMENT_REWARD = 1;

	struct Poster {
		address addr;
		string name;
		uint createdAt;
	}

	struct Post {
		uint postId;
		Poster author;
		string content;
		uint8 mark;
		uint8 tips;
		uint createdAt;
	}

	struct Topic {
		uint topicId;
		string title;
		string content;
		Poster author;
		uint createdAt;
		uint updatedAt;
		uint expiredAt;
		uint numPosts;
		mapping(uint => Post) posts;
	}

	uint numTopics;

	mapping(uint => Topic) public topics;
	mapping(address => Poster) public posters;

	MetaCoin metaCoin = new MetaCoin(this);

	function getNewUserRewardSetting() public pure returns (uint reward) {
		reward = DEFAULT_NEW_USER_REWARD;
	}

	function getNewTopicRewardSetting() public pure returns (uint reward) {
		reward = DEFAULT_NEW_TOPIC_REWARD;
	}

	function getNewCommentRewardSetting() public pure returns (uint reward) {
		reward = DEFAULT_NEW_COMMENT_REWARD;
	}

	function getMetaCoinPoolCoins() public view returns (uint coins) {
		coins = metaCoin.getBalance(this);
	}

	function newPoster(string name) public returns (string posterName) {
		posterName = name;
		posters[msg.sender] = Poster({
			addr: msg.sender,
			name: posterName,
			createdAt: now
		});

		require(metaCoin.sendCoin(msg.sender, DEFAULT_NEW_USER_REWARD));
	}

	function getBalance() public view returns (uint balance) {
		balance = metaCoin.getBalance(msg.sender);
	}

	function getPosterName(address addr) public view returns (string posterName) {
		posterName = posters[addr].name;
	}

	function newTopic(string title, string content, uint expiredAt) public returns (uint topicId, uint createdAt) {
		Poster storage author = posters[msg.sender];

		topicId = numTopics++;
		createdAt = now * 1000;
		topics[topicId] = Topic(
			topicId,
			title,
			content,
			author,
			createdAt,
			createdAt,
			createdAt + expiredAt * 1000,
			0
		);

		require(metaCoin.sendCoin(msg.sender, DEFAULT_NEW_TOPIC_REWARD));
	}

	function getTopicDetail(uint topicId) public view returns (uint id, string title, string content, uint createdAt, uint updatedAt, uint expiredAt, string authorName) {
		Topic storage topic = topics[topicId];

		id = topicId;
		title = topic.title;
		content = topic.content;
		createdAt = topic.createdAt;
		updatedAt = topic.updatedAt;
		expiredAt = topic.expiredAt;
		authorName = topic.author.name;
	}

    function getTopicCount() public view returns (uint topicCount) {
		topicCount = numTopics;
	}

	function newPost(uint topicId, string content, uint8 mark, uint8 tips) public returns (uint postId, uint createdAt) {
		Poster storage author = posters[msg.sender];
		Topic storage topic = topics[topicId];

		postId = topic.numPosts++;
		createdAt = now * 1000;
		topic.posts[postId] = Post(
			postId,
			author,
			content,
			mark,
			tips,
			createdAt
		);

		if (tips > 0) {
			require(metaCoin.sendCoin(topic.author.addr, tips));
		}

		require(metaCoin.sendCoin(msg.sender, DEFAULT_NEW_COMMENT_REWARD));
	}

	function getPostDetail(uint topicId, uint postId) public view returns (uint id, string content, uint createdAt, uint8 mark, uint8 tips, string authorName) {
		Topic storage topic = topics[topicId];
		Post storage post = topic.posts[postId];

		id = postId;
		content = post.content;
		mark = post.mark;
		tips = post.tips;
		createdAt = post.createdAt;
		authorName = post.author.name;
	}

    function getPostCountByTopic(uint topicId) public view returns (uint postCount) {
		Topic storage topic = topics[topicId];

		postCount = topic.numPosts;
	}
}
