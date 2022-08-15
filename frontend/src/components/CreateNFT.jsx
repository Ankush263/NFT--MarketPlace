import React from 'react';
import '../styles/CreateNFT.css';
import Navbar from '../components/Navbar';
import gon from '../images/gon.png'
import chijuru from '../images/chijuru.png';

const CreateNFT = () => {
  return (
    <div className="createnft">
      <div className="card">
        <Navbar />
        <div className="nfts">
          <img className='createnft-img' src={gon} />
          <div className="box create">
            <h1>create</h1>
          </div>
          <div className="box nft">
            <h1>NFT</h1>
          </div>
          <img className='createnft-img c' src={chijuru} />
        </div>
      </div>
    </div>
  )
}

export default CreateNFT