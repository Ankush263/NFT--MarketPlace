import React, { useState } from 'react';
import '../styles/Marketplace.css';
import Navbar from './Navbar';
import banner_img from '../images/banner1.jpg';
import nezuko from '../images/demon.png';
import MarketplaceJSON from '../Marketplace.json'
import NftCard from './NftCard';
import axios from 'axios';
import { ethers } from 'ethers';

const Marketplace = () => {

  const sampleData = [
    {
      "characterName": "Demo1",
      "tokenId": "01",
      "image": "https://www.domusweb.it/content/dam/domusweb/en/news/2021/05/13/how-to-mint-your-own-nft-in-5-simple-steps/nft.jpg.foto.rbig.jpg",
      "price":"1000ETH",
    },
    {
      "characterName": "Demo2",
      "tokenId": "02",
      "image": "https://www.domusweb.it/content/dam/domusweb/en/news/2021/05/13/how-to-mint-your-own-nft-in-5-simple-steps/nft.jpg.foto.rbig.jpg",
      "price":"1000ETH",
    },
    {
      "characterName": "Demo3",
      "tokenId": "03",
      "image": "https://www.domusweb.it/content/dam/domusweb/en/news/2021/05/13/how-to-mint-your-own-nft-in-5-simple-steps/nft.jpg.foto.rbig.jpg",
      "price":"1000ETH",
    },
    {
      "characterName": "Demo4",
      "tokenId": "04",
      "image": "https://www.domusweb.it/content/dam/domusweb/en/news/2021/05/13/how-to-mint-your-own-nft-in-5-simple-steps/nft.jpg.foto.rbig.jpg",
      "price":"1000ETH",
    }
];

  const [data, updateData] = useState(sampleData)
  const [dataFetched, updateDataFetched] = useState(false)


  // Using this function you can show your added nfts into the home screen------------------------------------

  const getAllNFTs = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)

    let transaction = await contract.fetchAllNFTs()

    const items = await Promise.all(transaction.map(async i => {
      const tokenURI = await contract.tokenURI(i.tokenId)
      // let meta = await axios.get(tokenURI)
      let meta
      await fetch(tokenURI)
        .then(res => res.json())
        .then(data => {
          return meta = data
        })
      // meta = meta.data
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
      
      return item

    }))

    updateData(items)

    updateDataFetched(true)

  }

  if(!dataFetched) {
    getAllNFTs()
  }




  return (
    <>
      <div className='marketplace'>
        <div className="card">
          <Navbar className='nav' />
            <div className="elements">
              <div className="banners">
                <img className='marketplace-img' src={nezuko} />
                <img className='marketplace-banner' src={banner_img} />
              </div>
              <div className='nft-collection'>
                {data.map((value, index) => {
                  return <NftCard data={value} key={index}></NftCard>
                })}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

export default Marketplace