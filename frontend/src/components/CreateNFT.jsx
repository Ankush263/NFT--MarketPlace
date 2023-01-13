import React, { useState } from 'react';
import '../styles/CreateNFT.css';
import Navbar from '../components/Navbar';
import gon from '../images/gon.png';
import chijuru from '../images/chijuru.png';
import { Button } from '@mui/material';
import { uploadFileToIPFS, uploadJSONToIPFS } from '../pinata';
import MarketplaceJSON from '../Marketplace.json';
import { ethers } from 'ethers';



const CreateNFT = () => {

  const [uploadedImg, setUploadedImage] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [fileURL, setFileURL] = useState(null)
  const [fromDesc, setFromDesc] = useState({ animeName: '', characterName: '', description: '', price: 0 })
  const [message, updateMessage] = useState('')


  // Upload Images to IPFS------------------------------------------------

  const onChangeFile = async (e) => {

    let file = e.target.files[0]    // NFT Image that you selected 

    try {
      const response = await uploadFileToIPFS(file)
      if(response.success === true) {
        setFileURL(response.pinataURL)    // response.pinataURL is the Image URL that you uploaded in Pinata
        setUploadedImage(response.pinataURL)
      }
    } catch (error) {
      console.log("Upload Image to IPFS Error: ", error)
    }

  }


  // Upload Metadata to IPFS--------------------------------------------

  const uploadMetadataToIPFS = async () => {
    const { animeName, characterName, description, price } = fromDesc
    if(!animeName || !characterName || !description || !price || !fileURL) {
      return
    }

    const nftJSON = {
      animeName, characterName, description, price, image: fileURL
    }

    try {
      const response = await uploadJSONToIPFS(nftJSON)
      if(response.success === true) {
        return response.pinataURL   // response.pinataURL is the Metadata URL that you uploaded in Pinata
      }
    } catch (error) {
      console.log("Upload Metadata to IPFS Error: ", error)
    }
  }


  // upload NFT to the BlockChain-------------------------------

  const submit = async (e) => {
    setDisabled(true)
    e.preventDefault()

    try {
      const metadataURL = await uploadMetadataToIPFS()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()

      updateMessage("Please wait.. uploading (upto 5 mins)")

      let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)

      const price = ethers.utils.parseUnits(fromDesc.price, 'ether')
      let listingPrice = await contract.getListingPrice()
      listingPrice = listingPrice.toString()

      let transactions = await contract.createNFT(metadataURL, price, { value: listingPrice })
      await transactions.wait()

      alert("Successfully listed your NFT!!!")
      
      setDisabled(false)
      updateMessage('')
      setUploadedImage('')
      setFromDesc({ animeName: '', characterName: '', description: '', price: 0 })
      window.location.replace("/")
    } catch (error) {
      alert("Upload Error: "+error)
      console.log("Upload Error: ", error)
    }

  }


  return (
    <div className="createnft">
      <div className="card">
        <Navbar />
        <div className="nfts">
          <img className='createnft-img' src={gon} />
          <div className="box create">
            <label htmlFor="upload" className='create-pt'>
              Upload NFT
              <input onChange={onChangeFile} type="file" />
            </label>
            <label htmlFor="name" className='create-pt'>
              Anime Name:
              <input type="text" className='input' onChange={e => setFromDesc({ ...fromDesc, animeName: e.target.value})} value={fromDesc.animeName} />
            </label>
            <label htmlFor="character" className='create-pt'>
              Character Name:
              <input type="text" className='input' onChange={e => setFromDesc({ ...fromDesc, characterName: e.target.value})} value={fromDesc.characterName} />
            </label>
            <label htmlFor="description" className='create-pt'>
              Description:
              <textarea type="text" onChange={e => setFromDesc({ ...fromDesc, description: e.target.value})} value={fromDesc.description} className='input' cols="40" rows="5"></textarea>
            </label>
            <label htmlFor="price" className='create-pt'>
              Price:
              <input type="number" onChange={e => setFromDesc({ ...fromDesc, price: e.target.value})} value={fromDesc.price} className='input' />
            </label>
              <Button 
                onClick={submit}
                disabled={disabled && true}
                className='list-nft-btn' 
                variant="contained" 
                style={{
                  borderRadius: 15,
                  fontSize: "18px",
                  background: "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(201,3,3,1) 100%)",
                }}>
                List your NFT
              </Button>
              <strong>{message}</strong>
          </div>
          <div className="box nft">
            <div className="upload-txt">
              {uploadedImg ? <img className='upload-img' src={`${uploadedImg}`} /> :
              <strong>Image will be shown here</strong>}
            </div>
          </div>
          <img className='createnft-img c' src={chijuru} />
        </div>
      </div>
    </div>
  )
}

export default CreateNFT