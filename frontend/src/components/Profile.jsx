import React from 'react';
import '../styles/Profile.css';
import Navbar from './Navbar';
import jiraiya from '../images/jiraiya.png';

import NftCard from './NftCard';



const Profile = () => {
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
            <strong className='information pt'>You have Total: 0 NFTs</strong>
            <strong className='information pt'>The Total Amount of NFTs: 0 eth</strong>
          </div>
          <div className="profile-nft-collection">
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
  )
}

export default Profile