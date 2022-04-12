import DStorage from '../abis/DStorage.json'
import React, { Fragment, Component } from 'react';
import { convertBytes } from './helpers';
import moment from 'moment'
import Web3 from 'web3';
import './App.css';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Grid from '@material-ui/core/Grid';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';



class verifyplace extends Component {

    async UNSAFE_componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
      }
    
      async loadWeb3() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      }
    
      async loadBlockchainData() {
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
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
          for (var i = 1; i <= filesCount; i++) {
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
      captureFile = event => {
        event.preventDefault()
    
        const file = event.target.files[0]
        const reader = new window.FileReader()
    
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
          this.setState({
            buffer: Buffer(reader.result),
            type: file.type,
            name: file.name
          })
          console.log('buffer', this.state.buffer)
        }
      }
    
      uploadFile = description => {
        console.log("Submitting file to IPFS...")
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
            main: '#00FF00',
          },
        },
      });
      return (  
        <ThemeProvider theme={theme}>
        <div>
        <Grid container alignitems="center" justify="center" item xs={12} >
          <Grid item xs={8}>
          <p>&nbsp;</p>
          <br></br>
          <Snackbar open = {this.state.snackbaropen}
          autoHideDuration={3000}
          onClose={this.snackbarClose}
          message= {<span id="message-id">{this.state.snackbarmsg}</span>}
          action={[<CloseIcon key="close" arial-label="Close" onClick={this.snackbarClose}></CloseIcon>]}/>
          <Typography variant="h5" color="primary">
            <Avatar style={{display:"inline-flex", whiteSpace:"nowrap"}} src="/broken-image.jpg" /> 
              Account Number : {this.state.account}
          </Typography>
          </Grid>
        </Grid>
      
        <div className="container-fluid mt-5 text-center">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1024px' }}>
              <div className="content">
                <MDBTable className="shadow-box-example z-depth-5" hover>
                  <MDBTableHead className='py-3'>
                    <tr>
                      <th scope="col" style={{ width: '200px'}}>Receipt Name</th>
                      <th scope="col" style={{ width: '200px'}}>Recepient Account</th>
                      <th scope="col" style={{ width: '120px'}}>File Type</th>
                      <th scope="col" style={{ width: '90px'}}>File Size</th>
                      <th scope="col" style={{ width: '90px'}}>Date Uploaded</th>
                      <th scope="col" style={{ width: '120px'}}>Uploader/Signer</th>
                      <th scope="col" style={{ width: '200px'}}>Signature/View</th>
                    </tr>
                  </MDBTableHead>

        
            <MDBTableBody color="primary-color" style={{'fontSize': '12px' }} >
              {this.state.files.filter(files => files.fileDescription == this.state.account || files.uploader == this.state.account).map((filey,key1)=> (
              <tr key={key1}>
                <td>{filey.fileName}</td>
                
                <td>{filey.fileDescription.substring(0,6)}...{filey.fileDescription.substring(filey.fileDescription.length - 3)}</td>
              
                <td>{filey.fileType}</td> 
                <td>{convertBytes(filey.fileSize)}</td> 
                <td>{moment.unix(filey.uploadTime).format('h:mm:ss A M/D/Y')}</td>
                <td>{filey.uploader.substring(0,6)}...{filey.uploader.substring(filey.uploader.length - 3)} </td>
                <td>
                  <a
                    href={"https://ipfs.infura.io/ipfs/" + filey.fileHash}
                    rel="noopener noreferrer"
                    target="_blank">
                    {filey.fileHash.substring(0,6)}...{filey.fileHash.substring(filey.fileHash.length - 3)}</a>
                    <Tooltip arrow title="Copy File Hash">
                  <FileCopyIcon 
                  style={{fontSize: "16px", color: "midnightblue"}}
                  onClick={() => {navigator.clipboard.writeText(filey.fileHash); this.setState({snackbaropen:true, snackbarmsg:'File Hash Copied' })}}/>
                        </Tooltip>

      </td>
              </tr>
              ))} 
              </MDBTableBody>  
          
    </MDBTable>
      </div>
      </main>
      </div>
      </div>
      </div>
      </ThemeProvider>

      );
    }
    
  }

export default verifyplace