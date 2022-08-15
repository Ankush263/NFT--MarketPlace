import React from 'react';
import '../styles/NFTTitle.css';
import Navbar from './Navbar';
import nft1 from '../images/nft1.png';



const NFTTitle = () => {
  return (
    <div className="nfttitle">
      <div className="card">
        <Navbar />
        <div className="info">
          <div className="info-pic">
            <img className='info-nft' src={nft1} />
          </div>
          <div className="info-desc">
            <strong className='info-desc-text pt'>
              Id: 01
            </strong>
            <strong className='info-desc-text pt'>
              Anime Name: Naruto Shipuden
            </strong>
            <strong className='info-desc-text pt'>
              Character Name: Suske
            </strong>
            <strong className='info-desc-text pt'>
              Owner: 0*1234566789006952
            </strong>
            <strong className='info-desc-text pt'>
              Seller: 0*293823208402048
            </strong>
            <strong className='info-desc-text pt'>
              NFT Price: 0.80
            </strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NFTTitle