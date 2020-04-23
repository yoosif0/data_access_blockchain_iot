pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract DataAccess{
    address private owner = msg.sender;
    string private dataHash;
    string private usersHash;

    function amIOwner() public view returns(bool) {
        return msg.sender == owner;
    }

    function storeDataHash ( string memory a )  public isOwner(){
        dataHash = a;
    }

    function storeUsersHash ( string memory a )  public isOwner(){
        usersHash = a;
    }

    function getDataHash () public view  returns(string memory) {
        return dataHash;
    }

    function getUsersHash () public view  returns(string memory) {
        return usersHash;
    }

    modifier isOwner() {
        require(msg.sender == owner, 'You are not the owner of this contract');
        _;
    }
 }