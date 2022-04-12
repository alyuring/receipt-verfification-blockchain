import React, { Component } from 'react';
import Identicon from 'identicon.js';
import box from '../Navbar/logo.svg'
import './NavBar.css';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink
} from './NavbarElements';


class Navbar extends Component {

  render() {
    return (
      <>
      <Nav>
      <NavLink to='/home'>
          <img src={box} width="30" height="30" className="align-top" alt="" />   
      </NavLink>
      <Bars />
      <NavMenu>
      <NavLink to='/shop' >
        Upload
        </NavLink>
      <NavLink to='/about' >
        E-Filing
        </NavLink>

        <NavLink to='/verifyreceipt' >
          Verify
        </NavLink>
         
            <NavLink to='/verifyplace' >
            {this.props.account.substring(0,6)}...{this.props.account.substring(38,42)}
            </NavLink>
            

            <a target="_blank" rel="noopener noreferrer" href={"https://ropsten.etherscan.io/address/" + this.props.account} >
            { this.props.account
              ? <img
                  alt=""
                  className='ml-2'
                  width='30'
                  height='30'
                  src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                 />
              : <span></span>
            } 
          </a>
        </NavMenu>
      </Nav>
      </>
    );
  }
}

export default Navbar;
