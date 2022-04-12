import DStorage from '../abis/DStorage.json'
import React, { Component } from 'react';
import Navbar from './Navbar/Navbar'
import Web3 from 'web3';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import About from "./About";
import Shop from "./ShopPage/Shop";
import Button from 'react-bootstrap/Button'
import feature from '../pngegg.png';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { animationOne, animationTwo, animationThree, transition } from './animations';
import { motion } from 'framer-motion';


const theme = createMuiTheme({
    typography: {
      fontFamily: [
        'Hero Light', 
        'sans-serif',
      ].join(','),
      color: "#fff",
    },
    palette: {
      primary: {
        // Purple and green play nicely together.
        main:'#fff',
      },
      secondary: {
        // This is green.A700 as hex.
        main: '#00008B',
      },
      textPrimary: {
        // This is green.A700 as hex.
        main: '#00FF00',
      },
    },
  });

class Home extends Component {
    render() {
        return (
        <motion.div initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }} exit='out' variants={animationThree} transition={transition}>
            <ThemeProvider theme={theme}>       
            <div className="homepage">
                <div className="container h-100">
                    <br></br>
                    <p>&nbsp;</p>
                    <div className="row h-100">
                        <div className="col-lg-6 my-auto">
                            <div className="header-content mx-auto">
                            <Typography variant="h4" style={{ textAlign: 'left' }} color="primary" >Verify receipts with blockchain</Typography>
                            <hr className="divider light my-4" />
                            <Typography variant="h6" style={{ textAlign: 'left' }} color="primary" >Harness the potential of blockchain and make
                            authenticating receipts and tax filing easier. Please download the MetaMask
                            browser extension and create a wallet to proceed.</Typography>
                            <p>&nbsp;</p>
                            <Button variant="outline-info" size="lg" href="/shop">Get Started</Button>{' '}
                            <Button variant="outline-warning" size="lg" href="https://metamask.io/download.html" rel="noopener noreferrer"
                            target="_blank">Download MetaMask</Button>
                            <p></p>
                            </div>
                        </div>

                        <div className="col-lg-5 my-auto">
                            <div className="device-container">
                                <div className="device-mockup iphone6_plus portrait white">
                                    <div className="device">
                                        <div className="screen">
                                            <br></br>
                                        <img src={feature} alt="Flowers in Chania" width="430" height="380"></img>
                                    </div>      
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            </ThemeProvider>
            </motion.div>
        )
    }
}


export default Home;