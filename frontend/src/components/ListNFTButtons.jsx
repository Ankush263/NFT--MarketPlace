import React, { useState } from 'react';
import "../styles/ListNFTButtons.css";
import { Button } from '@mui/material';
import MarketplaceJSON from '../Marketplace.json';
import { ethers } from 'ethers';
// const hre = require("hardhat")
// import hre from "hardhat"

function ListNFTButtons({ nftId }) {
  const [amount, setAmount] = useState(0)
  const [message, setMessage] = useState("")
  const [time, setTime] = useState(0)

  const resell = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)

      const Amount = ethers.utils.parseEther(amount)
      const listPrice = await contract.getListingPrice()

      const sell = await contract.listForSale(nftId, Amount, { value: listPrice })
      await sell.wait()
      setAmount(0)
      setMessage("Updating... pls wait....")
      alert("NFT listed Successfully")
      window.location.replace("/")

    } catch (error) {
      console.log(error)
    }
  }

  const auction = async () => {
    try {
      // const provider = new ethers.providers.Web3Provider(window.ethereum)
      // const signer = provider.getSigner()
      // const Id = new ethers.utils.parseEther(nftId)
      // const Amount = new ethers.utils.parseEther(amount)
      // const contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)

      // const Auction = new ethers.ContractFactory("Auction")
      // const auction = await Auction.deploy(MarketplaceJSON.address, Id, Amount)
      // await auction.deployed()

      // console.log("id: ", Id, "amount: ", Amount, MarketplaceJSON.address)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="">
      <div className='btn-box'>
        <Button className='btn' onClick={resell}>
          <span className='btn-text'>Resell</span>
        </Button>
        {/* <Button className='btn' onClick={auction}>
          <span className='btn-text'>Start Bidding</span>
        </Button> */}
      </div>
      {/* <input 
        type="number" 
        className='input' 
        placeholder='time in seconds(for bidding)'
        onChange={(e) => setTime(e.target.value)}
      /> */}
      <input 
        type="number" 
        className='input' 
        placeholder='Enter Amount' 
        onChange={(e) => setAmount(e.target.value)}
      />
      <span>{message}</span>
    </div>
  )
}

export default ListNFTButtons