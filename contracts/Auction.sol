//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Auction {
  event Start();
  event Bid(address indexed spender, uint256 amount);
  event Withdraw(address indexed bidder, uint256 amount);
  event End(address heighestBidder, uint256 amount);

  ERC721 public nft;
  uint256 nftId;
  address payable seller;
  uint32 public endAt;
  bool public started;
  bool public ended;
  address public heighestBidder;
  uint256 public heighestBid;

  mapping(address => uint256) public bids;

  constructor(address _nft, uint256 _nftId, uint256 _startingBid) {
    nft = ERC721(_nft);
    nftId = _nftId;
    seller = payable(msg.sender);
    heighestBid = _startingBid;
  }

  function start(uint32 _endTime) external {
    require(msg.sender == seller, "You are not the seller");
    require(!started, "The Auction already started");

    started = true;
    endAt = uint32(block.timestamp + _endTime);
    nft.transferFrom(seller, address(this), nftId);

    emit Start();
  }

  function bid() external payable {
    require(started, "Auction is not started yet");
    require(block.timestamp < endAt, "Auction ended");
    require(msg.value > heighestBid, "value < heighest bid");

    if(heighestBidder != address(0)) {
      bids[heighestBidder] += heighestBid;
    }

    heighestBid = msg.value;
    heighestBidder = msg.sender;

    emit Bid(msg.sender, msg.value);
  }

  function withdraw() external {
    uint256 bal = bids[msg.sender];
    bids[msg.sender] = 0;
    payable(msg.sender).transfer(bal);

    emit Withdraw(msg.sender, bal);
  }

  function end() external {
    require(started, "The Auction has started");
    require(!ended, "The Auction has ended");
    require(block.timestamp > endAt, "not ended");

    ended = true;
    if(heighestBidder != address(0)) {
      nft.transferFrom(address(this), heighestBidder, nftId);
      seller.transfer(heighestBid);
    } else {
      nft.transferFrom(address(this), seller, nftId);
    }

    emit End(heighestBidder, heighestBid);
  }

}