pragma solidity ^0.4.17;

contract Adoption {
	struct Poster {
		address addr;
		string name;
	}

	struct Post {
		uint postId;
		Poster author;
		string content;
		uint8 mark;
		uint64 createdAt;
	}

	struct Topic {
		uint topicId;
		string title;
		string content;
		Poster author;
		uint64 createdAt;
		uint64 updatedAt;
		uint64 expiredAt;
		uint64 numPosts;
		mapping(uint => Post) posts;
	}

	uint numTopics;

	mapping(uint => Topic) public topics;
	mapping(address => Poster) public posters;

	function isPosterExists(address addr) public returns (bool isExists) {
		isExists = false;
	}

	function newPoster(string name) public returns (string posterName) {
		posterName = name;
		posters[msg.sender] = Poster({
			addr: msg.sender,
			name: posterName
		});
	}

	function getPosterName(address addr) public view returns (string posterName) {
		posterName = posters[addr].name;
	}

	function newTopic(string title, string content, uint64 updatedAt, uint64 expiredAt) public returns (uint topicId) {
		Poster storage author = posters[msg.sender];

		topicId = numTopics++;
		topics[topicId] = Topic(
			topicId,
			title,
			content,
			author,
			updatedAt,
			updatedAt,
			expiredAt,
			0
		);
	}

	function getTopicDetail(uint topicId) public view returns (string title, string content, uint64 createdAt, uint64 updatedAt, uint64 expiredAt, string authorName) {
		Topic storage topic = topics[topicId];

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

	function newPost(uint topicId, string content, uint8 mark, uint64 createdAt) public returns (uint postId) {
		Poster storage author = posters[msg.sender];
		Topic storage topic = topics[topicId];

		postId = topic.numPosts++;
		topic.posts[postId] = Post(
			postId,
			author,
			content,
			mark,
			createdAt
		);
	}

	function getPostDetail(uint topicId, uint postId) public view returns (string content, uint64 createdAt, uint8 mark, string authorName) {
		Topic storage topic = topics[topicId];
		Post storage post = topic.posts[postId];

		content = post.content;
		mark = post.mark;
		createdAt = post.createdAt;
		authorName = post.author.name;
	}

    function getPostCountByTopic(uint topicId) public view returns (uint postCount) {
		Topic storage topic = topics[topicId];

		postCount = topic.numPosts;
	}
}
