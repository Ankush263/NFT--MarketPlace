import React, { useState } from 'react';
import '../styles/Profile.css';
import Navbar from './Navbar';
import jiraiya from '../images/jiraiya.png';
import MarketplaceJSON from '../Marketplace.json';
import NftCard from './NftCard';
import { ethers } from 'ethers';
import axios from 'axios';
import { useParams } from 'react-router-dom';



const Profile = () => {

  const [data, updateData] = useState([])
  const [dataFetched, updateFetched] = useState(false)
  const [address, updateAddress] = useState("0x")
  const [totalPrice, updateTotalPrice] = useState("0")


  const getNFTData = async (tokenId) => {

    let sumPrice = 0

    const provider = await new ethers.providers.Web3Provider(window.ethereum)

    const signer = await provider.getSigner()

    const addr = await signer.getAddress()

    const contract = await new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)

    let transaction = await contract.getMyNFTs()

    const items = await Promise.all(transaction.map(async i => {

      const tokenURI = await contract.tokenURI(i.tokenId)

      let meta = await axios.get(tokenURI)

      meta = meta.data

      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.image,
        animeName: meta.animeName,
        characterName: meta.characterName,
        description: meta.description,
      }

      sumPrice += Number(price)

      return item

    }))

    updateData(items)

    updateFetched(true)

    updateAddress(addr)

    updateTotalPrice(sumPrice.toPrecision(3))

  }

  const params = useParams()

  const tokenId = params.tokenId

  if(!dataFetched) {
    getNFTData(tokenId)
  }

  return (
    <div className="profile">
      <div className="card">
        <Navbar />
        <div className="profile-text">
          <strong className='pt'>Hey Otaku's, this is your all NFTs:</strong>
          <img className='profile-img' src={jiraiya} />
        </div>
        <div className="profile-nft">
          <div className="profile-information">
            <strong className='information pt'>You have Total: {data.length} NFTs</strong>
            <strong className='information pt'>The Total Amount of NFTs: {totalPrice} eth</strong>
          </div>
          <div className="profile-nft-collection">
            {data.map((value, index) => {
              return <NftCard data={value} key={index} />
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile