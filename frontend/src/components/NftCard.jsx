import React from 'react';
import '../styles/NftCard.css';
import nft1 from '../images/nft1.png';
import ethereum from '../images/ethereum.png';
import { Link } from 'react-router-dom';


const NftCard = (props) => {
  return (
    <Link className='nftcard-link' to='/nfttitle'>
      <div className="nftcard">
        <div className="nftcard-box">
        <div className="nft-img-holder">

          <img className='nftcard-img' src={nft1} />

        </div>
        <div className="nft-data-holder">
          <div className="nft-data nft-data-name">
            Name: Monkey
          </div>
          <div className="nft-data nft-data-id">
            Id:
          </div>
          <div className="nft-data nft-data-price">
            Price: 0.80
            <img className='small-logo' src={ethereum} />
          </div>
        </div>
        </div>
      </div>
    </Link>
  )
}

export default NftCard