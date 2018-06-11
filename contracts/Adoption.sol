pragma solidity ^0.4.17;

contract Adoption {
    struct Poster {
        address addr;
        bytes32 name;
    }

    struct Post {
        Poster author;
        bytes128 content;
        uint8 mark;
        uint64 createdAt;
    }

    struct Topic {
        uint topicId;
        bytes32 title;
        bytes256 content;
        Poster author;
        uint64 createdAt;
        uint64 updatedAt;
        uint64 expiredAt;
        Post[] posts;
    }

    uint numTopics;
    mapping(uint => Topic) public topics;

    function postTopic(bytes32 title, bytes256 content) public returns (uint topicId) {

    }

    function adopt(uint petId) public returns (uint) {
        require(petId >= 0 && petId <= 15);

        adopters[petId] = msg.sender;

        return petId;
    }

    function getAdopters() public view returns (address[16]) {
        return adopters;
    }
}
