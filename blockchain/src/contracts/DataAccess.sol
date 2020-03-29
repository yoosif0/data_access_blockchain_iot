pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract DataAccess{
    address private owner = msg.sender;
    mapping(string => bool) public doesUserHaveAccess;
    mapping(string => string) public encryptedSecretKey;
    string[] private usersPubKeys;
    string private fileHash;
    string private secretObjectHash;

    function returnUsersPubKeys() public view returns(string[] memory)  {
        return usersPubKeys;
    }

    function grantAccessToUser ( string memory a ) public isOwner() {
        doesUserHaveAccess[a] = true;
    }

    function amIOwner() public view returns(bool) {
        return msg.sender == owner;
    }

    function revokeAccessFromUser ( string memory a )  public isOwner() {
        doesUserHaveAccess[a] = false;
    }

    function storeFileHash ( string memory a )  public isOwner(){
        fileHash = a;
    }

    function storeSecretObjectHash ( string memory a )  public isOwner(){
        secretObjectHash = a;
    }

    function getDataHash () public isOwner() view  returns(string memory) {
        return fileHash;
    }

    function getSecretObjectHash () public isOwner() view  returns(string memory) {
        return secretObjectHash;
    }

    function registerUser ( string memory a   )  public isOwner(){
        usersPubKeys.push(a);
        doesUserHaveAccess[a] = false;
    }

    modifier userExists(address _userId) {
        require (_userId != address(0x0), 'The user should exist');
        _;
    }

    modifier isOwner() {
        require(msg.sender == owner, 'You are not the owner of this contract');
        _;
    }

    modifier reject() {
        require(true == false, 'Not reasonable');
        _;
    }

 }