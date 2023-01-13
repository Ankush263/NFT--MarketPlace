import React, { useState } from 'react';
import '../styles/NFTTitle.css';
import Navbar from './Navbar';
import nft1 from '../images/nft1.png';
import ethereum from '../images/ethereum.png';
import { Button } from '@mui/material';
import { ethers } from 'ethers';
import MarketplaceJSON from '../Marketplace.json';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ListNFTButtons from './ListNFTButtons';



const NFTTitle = () => {

  const [data, updateData] = useState({})
  const [dataFetched, updateDataFetched] = useState(false)
  const [currAddress, updateCurrAddress] = useState("0x")
  const [message, updateMessage] = useState("")
  const [disabled, setDisabled] = useState(false)
  const [price, setPrice] = useState(0)

  // Using this function you can show your added nfts into the home screen------------------------------------

  const getNFTData = async (tokenId) => {

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const addr = await signer.getAddress()
    const contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    const NFT = await contract.getListedTokenForId(tokenId)
    setPrice(Number(NFT.price) / 10 ** 18)
    // console.log(NFT.price.toString())
    const tokenURI = await contract.tokenURI(tokenId)
    const listedToken = await contract.getListedTokenForId(tokenId)
    let meta = await axios.get(tokenURI)
    meta = meta.data

    let item = {
      // price: meta.price,
      price: Number(NFT.price) / 10 ** 18,
      tokenId: tokenId,
      seller: listedToken.seller,
      owner: listedToken.owner,
      image: meta.image,
      animeName: meta.animeName,
      characterName: meta.characterName,
      description: meta.description,
    }

    updateDataFetched(true)
    updateData(item)
    updateCurrAddress(addr)
  }


  // Buying NFTs--------------------------------------------------

  const buyNFT = async (tokenId) => {

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
      const salePrice = ethers.utils.parseUnits(price.toString(), 'ether')

      updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
      setDisabled(true)
      console.log(price)

      let transaction = await contract.buyNFT(tokenId, { value: salePrice })
      await transaction.wait()
      console.log(salePrice)

      alert('You successfully bought the NFT!😍')
      updateMessage("")
      window.location.replace("/")

    } catch (error) {
      updateMessage("")
      setDisabled(false)
      alert("Upload Error: " + error)
      console.log("BuyNFT Error: ", error)

    }

  }

  const params = useParams()

  const tokenId = params.tokenId

  if(!dataFetched) {
    getNFTData(tokenId)
  }

  return (
    <div className="nfttitle">
      <div className="card">
        <Navbar />
        <div className="info">
          <div className="info-pic">
            <img className='info-nft' src={data.image} />
          </div>
          <div className="info-desc">
            <strong className='info-desc-text pt'>
              Id: {data.tokenId}
            </strong>
            <strong className='info-desc-text pt'>
              Anime Name: {data.animeName}
            </strong>
            <strong className='info-desc-text pt'>
              Character Name: {data.characterName}
            </strong>
            <strong className='info-desc-text pt'>
              Description: {data.description}
            </strong>
            <strong className='info-desc-text pt'>
              Owner: {data.owner}
            </strong>
            <strong className='info-desc-text pt'>
              Seller: 
              {
                data.seller == "0x0000000000000000000000000000000000000000" ? 
                <span> Not Listed yet</span> : 
                data.seller
              }
            </strong>
            <strong className='info-desc-text pt'>
              NFT Price: {data.price}
              <img className='small-logo' src={ethereum} />
            </strong>
            {
              currAddress == data.owner ?

              <div className="buy-nft-btn">
                <ListNFTButtons nftId={data.tokenId} />
              </div>

               : currAddress == data.seller ?

              <strong className='info-desc-text'>
                Already Listed
              </strong>

              :

              data.seller == "0x0000000000000000000000000000000000000000" ?
              <strong className='info-desc-text'>
                Not Listed yet
              </strong>
              :
              <Button 
                onClick={() => buyNFT(tokenId)}
                disabled={disabled}
                className='list-nft-btn' 
                variant="contained" 
                style={{
                  borderRadius: 15,
                  fontSize: "18px",
                  background: "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(201,3,3,1) 100%)",
              }}>
                Buy This NFT
              </Button>
            }
            <div className='info-desc-text'>{message}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NFTTitle