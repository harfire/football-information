import React from 'react';

export default function Footer() {
  return (
    <div className='columns is-multiline footer-container'>
      <div className='column is-full'>
        <p className='has-text-centered is-size-6'>
          Using free version API from{' '}
          <a href='https://rapidapi.com/GiulianoCrescimbeni/api/football98' target='_blank' rel='noopener noreferrer'>
            rapidapi.com
          </a>
          <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <span>&#169; Haris Rahman</span>
        </p>
      </div>
    </div>
  );
}
