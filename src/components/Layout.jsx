import React from 'react';
import Header from './Header';
import Footer from './Footer';

function Layout() {
  return (
    <div className='container is-fluid' id='football-container'>
      <Header></Header>
      <Footer></Footer>
    </div>
  );
}

export default Layout;
