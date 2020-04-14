pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract DataAccess{
    address private owner = msg.sender;
    string private dataHash;
    string private secretObjectHash;

    function amIOwner() public view returns(bool) {
        return msg.sender == owner;
    }

    function storeDataHash ( string memory a )  public isOwner(){
        dataHash = a;
    }

    function storeSecretObjectHash ( string memory a )  public isOwner(){
        secretObjectHash = a;
    }

    function getDataHash () public isOwner() view  returns(string memory) {
        return dataHash;
    }

    function getSecretObjectHash () public view  returns(string memory) {
        return secretObjectHash;
    }

    modifier isOwner() {
        require(msg.sender == owner, 'You are not the owner of this contract');
        _;
    }
 }