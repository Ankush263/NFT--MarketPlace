import React from 'react';
import '../styles/NftCard.css';
import ethereum from '../images/ethereum.png';
import { Link } from 'react-router-dom';



const NftCard = (props) => {

  const newTo = {
    pathname: "/nfttitle/"+props.data.tokenId
  }


  return (
    <Link className='nftcard-link' to={newTo}>
      <div className="nftcard">
        <div className="nftcard-box">
        <div className="nft-img-holder">

          <img className='nftcard-img' src={props.data.image} />

        </div>
        <div className="nft-data-holder">
          <div className="nft-data nft-data-name">
            Name: {props.data.characterName}
          </div>
          <div className="nft-data nft-data-id">
            Id: {props.data.tokenId}
          </div>
          <div className="nft-data nft-data-price">
            Price: {props.data.price}
            <img className='small-logo' src={ethereum} />
          </div>
        </div>
        </div>
      </div>
    </Link>
  )
}

export default NftCard