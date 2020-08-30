import React from 'react';

export default function Loading() {
  return (
    <>
      <span className='has-text-weight-semibold'>Loading... </span>
      <span className='icon has-text-white'>
        <i className='fas fa-spinner fa-pulse'></i>
      </span>
    </>
  );
}
