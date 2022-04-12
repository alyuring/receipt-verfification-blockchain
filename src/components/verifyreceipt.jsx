import DStorage from '../abis/DStorage.json'
import React, { useState, Fragment, Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Grid from '@material-ui/core/Grid';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { animationOne, animationTwo, animationThree, transition } from './animations';
import { motion } from 'framer-motion';


 // note, contract address must match the address provided by Truffle after migrations 
 const web3 = new Web3(Web3.givenProvider);
 const networkId =  web3.eth.net.getId()
 const networkData = DStorage.networks[networkId]
 const contractAddr = '0xd5438BD3044a72418e70566Ff4e338C85FA65597';
 
 const dstorage = new web3.eth.Contract(DStorage.abi, contractAddr)

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
      main: '#000',
    },
    textPrimary: {
      // This is green.A700 as hex.
      main: '#006400',
    },
  },
});

 function Verifyreceipt() {
   
   const [number, setNumber] = useState("");
   const [getNumber, setGetNumber] = useState("");
 
   const handleSet = async (e) => {
     e.preventDefault();
     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
     const account = accounts[0];
     const gas = await dstorage.methods.set(number).estimateGas();
     const result = await dstorage.methods.set(number).send({ from: account, gas });
     console.log(result);
   }
 
   const handleGet = async (e) => {
     e.preventDefault();
     const result = await dstorage.methods.verify(number).call();
     const receiptsigner = await dstorage.methods.getsigner(number).call();
     const customer = await dstorage.methods.getreceiver(number).call();
     if (result > 0){
     var theDate = new Date(result * 1000);
     var dateString = theDate.toGMTString();
     setGetNumber(
      <Typography variant="h6"  style={{ color:"#5DBB63", textAlign: 'left' }}> 
     Receipt signature {number} is valid, signed by account {receiptsigner}, sent to user {customer}. Date published to the system, {dateString}.</Typography>);
     console.log(dateString);
    }
     else
     {
       setGetNumber(
        <Typography variant="h6"  style={{ color:"red", textAlign: 'left' }}>
        Receipt signature {number} is not found in the blockchain.
        Please ensure that you have entered signature with the correct uppercase and lowercase characters.</Typography>);
     }

   }
 
   return (
    <motion.div initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }} exit='out' variants={animationTwo} transition={transition}>
    <ThemeProvider theme={theme}>       
      <div className="text-center">
        <p>&nbsp;</p>
        <Typography variant="h2" color="primary" gutterBottom>
            Verify Receipt
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom>
            Check if receipt is in the system by entering the receipt's signature/hash (case-sensitive) 
        </Typography>
        <p>&nbsp;</p>
        <Grid container alignitems="center" justify="center" item xs={12} style={{ minHeight: '10vh' }}>
          <Grid item xs={8}>
                  <div className="App">
                    <header className="App-header">
                      <br></br>
                      <form>
                        <Typography variant="h5" style={{ textAlign: 'left' }} color="secondary" > Enter Receipt Signature/Hash</Typography>
                        <br></br>
                        <TextField  type="text" name="name" value={number} onChange={ e => setNumber(e.target.value) } id="filled-basic" 
                        label="Receipt Hash" variant="filled" fullWidth required/>
                        <br></br>
                        </form>
                        <p>&nbsp;</p>
                      <Button type="button"  onClick={handleGet} variant="outlined">Get Result</Button>
                      <p>&nbsp;</p>
                      { getNumber }
                    </header>
                  </div>
                </Grid>
        </Grid>
      </div>
    </ThemeProvider>
    </motion.div>
    );
 }


export default Verifyreceipt;