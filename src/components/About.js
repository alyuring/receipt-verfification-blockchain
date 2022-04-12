import React, { Fragment,  Component } from 'react'
import DStorage from '../abis/DStorage.json'
import Web3 from 'web3';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import Typography from '@material-ui/core/Typography';
import ReactDOM from 'react-dom'
import Grid from '@material-ui/core/Grid';
import Select from 'react-select';
import ReceiptTwoToneIcon from '@material-ui/icons/ReceiptTwoTone';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';


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

class About extends Component {
    
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
      constructor(props) {
        super(props)
        this.state = {
            num1: '',
            num2:'',
            num3:'',
            num4: '',
            total:'',
            query: '',
            hide: {},
            value: null,
            setValue: null,
            setHide: {},
            data: [],
            searchString: [],
            account: '',
            dstorage: null,
            files: [],
            loading: false,
            type: null,
            name: null
        }
      }
   

    handlenum1 = (event) => {
        this.setState({
            num1:event.target.value
        })
    }

    handlenum2 = (event) => {
        this.setState({
            num2:event.target.value
        })
    }

    handlenum3 = (event) => {
        this.setState({
            num3:event.target.value
        })
    }

    handlenum4 = (event) => {
        this.setState({
            num4:event.target.value
        })
    }

    exe = (e) => {
        e.preventDefault();
        this.setState({ 
            total: Number(this.state.num1) + Number(this.state.num2)
            + Number(this.state.num3) + Number(this.state.num4)
        })
        
    } 

    returnstatement = (e) => {
        e.preventDefault();
        return("Total Tax Relief Claimable:")
    }

    render(){
        return(
            <div>
                <ThemeProvider theme={theme}>       
                <Grid container spacing={2} alignitems="center" justify="center" item lg={12} style={{ minHeight: '10vh' }}>
                    <Grid item xs={10}>
                        <br /><br />
                        <div className="text-center">
                        <Typography variant="h3" color="primary" gutterBottom>
                                Tax Relief E-Filing with Blockchain
                        </Typography>
                        </div>
                        <p>&nbsp;</p>
                        <Typography variant="h5" color="secondary" gutterBottom>
                                Medical Examination
                                </Typography>
                                <Divider />
                                <br></br>
                        <form onSubmit={this.exe}> 
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Enter Amount (Restricted to RM 5000)</label>
                                    <input type="number" 
                                    className="form-control"
                                    step="any" 
                                    value={this.state.num1}
                                    onChange={this.handlenum1} 
                                    min="0" 
                                    max="5000"
                                    placeholder=" Max RM5000" />
                                    
                                </div>
                                <div className="form-group col-md-6">
                                <label><br></br></label>
                                <Dropdown>
                                        <Dropdown.Toggle variant="info" id="dropdown-basic">
                                        Browse through your files!</Dropdown.Toggle>
                                            <Dropdown.Menu>
                                            {this.state.files.filter(files => 
                                                files.fileDescription === this.state.account || files.uploader === 
                                                this.state.account).map((filey,key1)=> (
                                                <Dropdown.Item value={1} key={filey.fileId} 
                                                href={"https://ipfs.infura.io/ipfs/" + filey.fileHash} target="_blank"> 
                                                {filey.fileName} </Dropdown.Item>
                                            ))}
                                            </Dropdown.Menu>
                                    </Dropdown>
                                </div>

                                <div className="form-group col-md-10" style={{width: "800px"}}>
                                    <label >Select Receipt File</label>
                                    <Select 
                                    isClearable={true}
                                    captureMenuScroll={false} 
                                    options={this.state.files.filter(files => 
                                        files.fileDescription === this.state.account || files.uploader === 
                                        this.state.account).map((filey,key1)=> (
                                        {label: (filey.fileName + ', ' +filey.fileHash )}
                                        ))}
                                          />  
                                </div> 
                            </div><br></br>

                            <Typography variant="h5" color="secondary" gutterBottom>
                                Education Fees (Self)
                                </Typography>
                                <Divider />
                                <br></br>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Enter Amount (Restricted to RM 7000)</label>
                                    <input type="number" 
                                    className="form-control" 
                                    step="any" 
                                    value={this.state.num2}
                                    onChange={this.handlenum2} 
                                    min="0" 
                                    max="7000"
                                    placeholder="Max RM7000" />
                                </div>
                                <div className="form-group col-md-6">
                                <label><br></br></label>
                                <Dropdown>
                                        <Dropdown.Toggle variant="info" id="dropdown-basic">
                                        Browse through your files!</Dropdown.Toggle>
                                            <Dropdown.Menu>
                                            {this.state.files.filter(files => 
                                                files.fileDescription === this.state.account || files.uploader === 
                                                this.state.account).map((filey,key1)=> (
                                                <Dropdown.Item value={1} key={filey.fileId} 
                                                href={"https://ipfs.infura.io/ipfs/" + filey.fileHash} target="_blank"> 
                                                {filey.fileName} </Dropdown.Item>
                                            ))}
                                            </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className="form-group col-md-10" style={{width: "800px"}}>
                                    <label >Select Receipt File</label>
                                    <Select 
                                    isClearable={true}
                                    captureMenuScroll={false} 
                                    options={this.state.files.filter(files => 
                                        files.fileDescription === this.state.account || files.uploader === 
                                        this.state.account).map((filey,key1)=> (
                                        {label: (filey.fileName + ', ' +filey.fileHash )}
                                        ))}
                                          />  
                                </div>
                                
                            </div><br></br>

                            <Typography variant="h5" color="secondary" gutterBottom>
                                Child Care Fees
                                </Typography>
                                <Divider />
                                <br></br>                        
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Enter Amount (Restricted to RM 1000)</label>
                                    <input type="number" 
                                    className="form-control" 
                                    min="0" 
                                    max="1000" 
                                    step="any" 
                                    value={this.state.num3}
                                    onChange={this.handlenum3}  
                                    placeholder="Max RM1000" />
                                </div>
                                <div className="form-group col-md-6">
                                <label><br></br></label>
                                <Dropdown>
                                        <Dropdown.Toggle variant="info" id="dropdown-basic">
                                        Browse through your files!</Dropdown.Toggle>
                                            <Dropdown.Menu>
                                            {this.state.files.filter(files => 
                                                files.fileDescription === this.state.account || files.uploader === 
                                                this.state.account).map((filey,key1)=> (
                                                <Dropdown.Item value={1} key={filey.fileId} 
                                                href={"https://ipfs.infura.io/ipfs/" + filey.fileHash} target="_blank"> 
                                                {filey.fileName} </Dropdown.Item>
                                            ))}
                                            </Dropdown.Menu>
                                    </Dropdown>
                                </div>

                                <div className="form-group col-md-10">
                                    <label><br></br></label>
                                    <label >Select Receipt File</label>
                                    <Select 
                                    isClearable={true}
                                    captureMenuScroll={false} 
                                    options={this.state.files.filter(files => 
                                        files.fileDescription === this.state.account || files.uploader === 
                                        this.state.account).map((filey,key1)=> (
                                        {label: (filey.fileName + ', ' +filey.fileHash )}
                                        ))}
                                          />  
                                </div>
                                </div><br></br>

                                <Typography variant="h5" color="secondary" gutterBottom>
                                Lifestyle
                                </Typography>
                                <Typography variant="h6" color="secondary" gutterBottom>
                                Includes laptop, sports equipment, books purchase
                                </Typography>
                                <Divider />
                                <br></br> 

                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Enter Amount (Restricted to RM 2500)</label>
                                    <input type="number" 
                                    className="form-control"  
                                    min="0" 
                                    max="2500"
                                    step="any" 
                                    value={this.state.num4}
                                    onChange={this.handlenum4}  
                                    placeholder="Max RM2500" />
                                </div>
                                <div className="form-group col-md-6">
                                <label><br></br></label>
                                <Dropdown>
                                        <Dropdown.Toggle variant="info" id="dropdown-basic">
                                        Browse through your files!</Dropdown.Toggle>
                                            <Dropdown.Menu>
                                            {this.state.files.filter(files => 
                                                files.fileDescription === this.state.account || files.uploader === 
                                                this.state.account).map((filey,key1)=> (
                                                <Dropdown.Item value={1} key={filey.fileId} 
                                                href={"https://ipfs.infura.io/ipfs/" + filey.fileHash} target="_blank"> 
                                                {filey.fileName} </Dropdown.Item>
                                            ))}
                                            </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className="form-group col-md-10">
                                        <label><br></br>
                                        </label>
                                        <label><br></br></label>
                                    <label >Select Receipt File</label>
                                    <Select 
                                    isClearable={true}
                                    captureMenuScroll={false} 
                                    options={this.state.files.filter(files => 
                                        files.fileDescription === this.state.account || files.uploader === 
                                        this.state.account).map((filey,key1)=> (
                                        {label: (filey.fileName + ', ' +filey.fileHash )}
                                        ))}
                                          /> 
                                </div>
                            </div>
                            <br></br>
                            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <Button
                type="submit"
        variant="contained"
        color="default"
        size="large"
        style={{backgroundColor:"#89CFF0"}}
        startIcon={<ReceiptTwoToneIcon />}
      >Calculate Tax Relief
      </Button>
                                <p>&nbsp;</p>
                                Total Tax Relief Claimable: RM {this.state.total}
                            </div>
                            <br></br>
                        </form>
                
                </Grid>
                </Grid>
                </ThemeProvider>       

            </div>
        )  
    }
}

  
export default About
