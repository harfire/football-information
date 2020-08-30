import React from 'react';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';

function Layout() {
  return (
    <div className='container is-fluid' id='football-container'>
      <Header></Header>
      <Content></Content>
      <Footer></Footer>
    </div>
  );
}

export default Layout;
