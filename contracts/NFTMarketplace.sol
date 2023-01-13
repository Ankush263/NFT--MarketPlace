//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage {

  using Counters for Counters.Counter;
  Counters.Counter private _nftIds;
  Counters.Counter private _nftsSold;

  uint256 listingPrice = 0.01 ether;
  address payable owner;

  mapping(uint256 => NFT) private idOfNFT;

  struct NFT {
    uint256 tokenId;
    address payable owner;
    address payable seller;
    uint256 price;
    bool sold;
  }

  event NFTCreated (
    uint256 indexed tokenId,
    address owner,
    address seller,
    uint256 price,
    bool sold
  );

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can call yhis function");
    _;
  }

  constructor() ERC721("MyAnimeNFT", "MANFT") {
    owner = payable(msg.sender);
  }

  function updateListingPrice(uint256 _price) public onlyOwner {
    listingPrice = _price;
  }

  function getListedTokenForId(uint256 _nftId) public view returns(NFT memory) {
    return idOfNFT[_nftId];
  }

  function getListingPrice() public view returns(uint256) {
    return listingPrice;
  }

  function createNFT(string memory _nftURI, uint256 _price) payable public returns(uint256) {
    _nftIds.increment();
    uint256 newNFTId = _nftIds.current();

    _mint(msg.sender, newNFTId);
    _setTokenURI(newNFTId, _nftURI);
    createListedNFT(newNFTId, _price);
    return newNFTId;
  }

  function createListedNFT(uint256 _nftId, uint256 _price) private {
    require(_price > 0, "Price should be at least 1 wei");
    require(msg.value == listingPrice,"Insufficient fund");

    idOfNFT[_nftId] = NFT(
      _nftId,
      payable(address(this)),
      payable(msg.sender),
      _price,
      false
    );
    _transfer(msg.sender, address(this), _nftId);

    emit NFTCreated(
      _nftId,
      address(this),
      msg.sender,
      _price,
      false
    );
  }

  function listForSale(uint256 _nftId, uint256 _price) payable public {
    require(idOfNFT[_nftId].owner == msg.sender, "You are not the owner of this NFT");
    require(msg.value == listingPrice, "Insufficient fund");

    idOfNFT[_nftId].sold = false;
    idOfNFT[_nftId].owner = payable(address(this));
    idOfNFT[_nftId].seller = payable(msg.sender);
    idOfNFT[_nftId].price = _price;
    _nftsSold.decrement();

    _transfer(msg.sender, address(this), _nftId);
  }

  function buyNFT(uint256 _nftId) payable public {
    uint256 price = idOfNFT[_nftId].price;
    require(msg.value == price, "Please submit the asking price");

    idOfNFT[_nftId].owner = payable(msg.sender);
    idOfNFT[_nftId].seller = payable(address(0));  /* 0x00...000 */
    idOfNFT[_nftId].sold = true;
    _nftsSold.increment();
    _transfer(address(this), msg.sender, _nftId);
    payable(owner).transfer(listingPrice);
    payable(idOfNFT[_nftId].seller).transfer(msg.value);
  }

  function fetchAllUnsoldNFTs() public view returns(NFT[] memory) {
    uint256 nftCount = _nftIds.current();
    uint256 unsoldNFTCount = _nftIds.current() - _nftsSold.current();
    uint256 currentIndex = 0;

    NFT[] memory nfts = new NFT[](unsoldNFTCount);
    for(uint256 i = 0; i < nftCount; i++) {
      if(idOfNFT[i + 1].owner == address(this)) {
        uint256 currentId = i + 1;
        NFT storage currentNFT = idOfNFT[currentId];
        nfts[currentIndex] = currentNFT;
        currentIndex += 1;
      }
    }
    return nfts;
  }

  function fetchAllNFTs() public view returns(NFT[] memory) {
    uint256 totalNFTCount = _nftIds.current();
    uint256 currentIndex = 0;

    NFT[] memory nfts = new NFT[](totalNFTCount);
    for(uint i = 0; i < totalNFTCount; i++) {
      uint256 currentId = i + 1;
      NFT storage currentNFT = idOfNFT[currentId];
      nfts[currentIndex] = currentNFT;
      currentIndex += 1;
    }
    return nfts;
  }

  function fetchMyNFTs() public view returns(NFT[] memory) {
    uint256 totalItemCount = _nftIds.current();
    uint256 itemCount = 0;
    uint256 currentIndex = 0;

    for(uint256 i = 0; i < totalItemCount; i++) {
      if(idOfNFT[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    NFT[] memory nfts = new NFT[](itemCount);
    for(uint256 i = 0; i < totalItemCount; i++) {
      if(idOfNFT[i + 1].owner == msg.sender) {
        uint256 currentId = i + 1;
        NFT storage currentItem = idOfNFT[currentId];
        nfts[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return nfts;
  }

  function fetchListedNFTs() public view returns(NFT[] memory) {
    uint256 totalItemCount = _nftIds.current();
    uint256 itemCount = 0;
    uint256 currentIndex = 0;

    for(uint256 i = 0; i < totalItemCount; i++) {
      if(idOfNFT[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    NFT[] memory nfts = new NFT[](itemCount);
    for(uint256 i = 0; i < totalItemCount; i++) {
      if(idOfNFT[i + 1].seller == msg.sender) {
        uint256 currentId = i + 1;
        NFT storage currentNFT = idOfNFT[currentId];
        nfts[currentIndex] = currentNFT;
        currentIndex += 1;
      }
    }
    return nfts;
  }

}