import DStorage from '../../abis/DStorage.json'
import React, { useState, useRef, Component } from 'react';
import Main from './Main'
import Web3 from 'web3';
import '../App.css';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { animationOne, animationTwo, animationThree, transition } from '../animations';
import { motion } from 'framer-motion';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values


class Shop extends Component{

  async UNSAFE_componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = new Web3(window.ethereum)
    // Load account
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = DStorage.networks[networkId]
    if(networkData) {
      // Assign contract
      const dstorage = new web3.eth.Contract(DStorage.abi, networkData.address)
      this.setState({ dstorage })
      // Get files amount
      const filesCount = await dstorage.methods.fileCount().call()
      this.setState({ filesCount })
      // Load files&sort by the newest
      for (var i = filesCount; i >= filesCount; i--) {
        const file = await dstorage.methods.files(i).call()
        this.setState({
          files: [...this.state.files, file]
        })
      }
      
    } else {
      window.alert('DStorage contract not deployed to detected network.')
    }
  }

  // Get file from user
  captureFile = (event) => {
    event.preventDefault();

    const file = event.target.files[0]
    const reader = new window.FileReader()
    const reader1 = new window.FileReader()
    const url = reader1.readAsDataURL(file);
    reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result),
        type: file.type,
        name: file.name,
        filez: URL.createObjectURL(file)
      })
      console.log('buffer', this.state.buffer)
    }
    
  }

 


  uploadFile = description => {
    try{
    console.log("Submitting file to IPFS...")
    // Add file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('IPFS result', result.size)
      if(error) {
        console.error(error)
        return window.alert('Error: User denied transaction signature')
      }

      this.setState({ loading: true })
      // Assign value for the file without extension
      if(this.state.type === ''){
        this.setState({type: 'none'})
      }
      this.state.dstorage.methods.uploadFile(result[0].hash, result[0].size, this.state.type, this.state.name, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({
         loading: false,
         type: null,
         name: null
       })
       window.location.reload();       
       this.setState({snackbaropen:true, snackbarmsg:'File successfully uploaded!' })
       }).on('error', (e) =>{
        this.setState({
          filez: null
        })
        window.alert('Error: User denied transaction signature')
        this.setState({loading: false})
      })
    })
  }
  catch{
    window.alert('Error: Please upload a file')
    }
  }

  

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      dstorage: null,
      files: [],
      loading: false,
      type: null,
      name: null,
      snackbaropen: false,
      snackbarmsg: ''
    }
    this.uploadFile = this.uploadFile.bind(this)
    this.captureFile = this.captureFile.bind(this)
  }

  snackbarClose = (event) =>{
    this.setState({snackbaropen:false});
    }
  

  render() {
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }} exit='out' variants={animationTwo} transition={transition}>
      <div className='shop'>
        { this.state.loading
          ? <div id="loader" className="text-center mt-5">
              <p>Processing Transaction...</p>
              <LinearProgress />
            </div>
          : <Main
              files={this.state.files}
              captureFile={this.captureFile}
              uploadFile={this.uploadFile}
              
              filez={this.state.filez}
            />
        }
         <Snackbar open = {this.state.snackbaropen}
          autoHideDuration={3000}
          onClose={this.snackbarClose}
          message= {<span id="message-id">{this.state.snackbarmsg}</span>}
          action={[<CloseIcon key="close" arial-label="Close" onClick={this.snackbarClose}></CloseIcon>]}/>
      </div>
      </motion.div>


      
     
    );
  }
}


export default Shop;