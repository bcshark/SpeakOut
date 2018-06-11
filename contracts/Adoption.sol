pragma solidity ^0.4.17;

contract Adoption {
	struct Poster {
		address addr;
		string name;
	}

	struct Post {
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

    function getTopicCount() public view returns (uint topicCount) {
		topicCount = numTopics;
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

	/*
	function adopt(uint petId) public returns (uint) {
		require(petId >= 0 && petId <= 15);

		adopters[petId] = msg.sender;

		return petId;
	}

	function getAdopters() public view returns (address[16]) {
		return adopters;
	}
	*/
}
