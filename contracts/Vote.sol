pragma solidity >=0.4.22 <0.9.0;

contract Vote{

    uint public voteCount = 0; // public is used to read this variable from the blockchain. Featuer of solidity
    //taskCount is written into storage

    struct Votes { 
        uint id;// a basic struct to define user defined datatype 
        uint eventId;
        uint vote;
    } 

    //creating a state variable tasks.
    //mapping is a datatype 
    //it is like a hash, dict 

    mapping(uint => Votes) public tasks; //mapping -> key value pair 
    //if we access task we are essentially accesing the Task structure.

    constructor() public{
        createVote(1 ,1);

    }

    function createVote( uint _eventId , uint _vote) public {
        voteCount++;
        tasks[voteCount] = Votes(voteCount , _eventId , _vote );

    }


}