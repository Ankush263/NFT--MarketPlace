import React from 'react';
import '../styles/Marketplace.css';
import Navbar from './Navbar';
import banner_img from '../images/banner1.jpg';
import nezuko from '../images/demon.png';

import NftCard from './NftCard';

const Marketplace = () => {
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
                <NftCard />
                <NftCard />
                <NftCard />
                <NftCard />
                <NftCard />
                <NftCard />
                <NftCard />
                <NftCard />
                <NftCard />
                <NftCard />
                <NftCard />
                <NftCard />
                <NftCard />
                <NftCard />
                <NftCard />
                
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

export default Marketplace