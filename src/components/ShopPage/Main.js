import React, { useState, Component } from 'react';
import { convertBytes } from '../helpers';
import moment from 'moment';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import '../App.css'
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FileUpload from '../ShopPage/file-upload/file-upload.component';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

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
      main: '#11cb5f',
    },
  },
});

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
        borderWidth: "2px",
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
  },
})(TextField);

const buttonFont = createMuiTheme({
  typography: {
    fontFamily: [
      'Open Sans',
      'sans-serif',
    ].join(','),
  },
  palette: {
    primary: {
      // Purple and green play nicely together.
      main:'#fff',
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#11cb5f',
    },
  },
});


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
        open: false,
        snackbaropen: false,
        snackbarmsg: ''
    };
  }
 snackbarClose = (event) =>{
  this.setState({snackbaropen:false});
  }



  render() {
    return (        
    <ThemeProvider theme={theme}>
       <div className="text-center">
          <p>&nbsp;</p>
          <Typography variant="h2" color="primary" gutterBottom>
            Upload Receipt
          </Typography>
          <Grid container spacing={2} alignitems="center" justify="center" item xs={12} style={{ minHeight: '10vh' }}>
          <Grid item xs={8}>
            <form onSubmit={(event) => {
              event.preventDefault()
              const description = this.fileDescription.value
              this.props.uploadFile(description)
             }} >
              <br></br>
              <Typography variant="h6" align="left" color="primary" gutterBottom>
            Enter Recepient MetaMask Account
          </Typography>
                <CssTextField
                inputRef={(input) => { this.fileDescription = input }} id="outlined-secondary" label="MetaMask Account (0x...)"
                variant="outlined"  fullWidth required  />
                <FileUpload accept=".jpg,.png,.jpeg,.pdf,.txt" multiple onInput={this.props.captureFile}/>
                <Button
                type="submit"
        variant="contained"
        style = {{backgroundImage: "linear-gradient(to right, #93dafa, #6dd5ed)"}}
        size="large"
        startIcon={<CloudUploadIcon />}
      >
        Upload
      </Button>
            </form>
            </Grid>
          </Grid>
        </div> 
        
        <p>&nbsp;</p>
        
        <Grid container  spacing={2} alignitems="center" justify="center" item xs={12}>
         <Grid item xs={9}>
          <ThemeProvider theme={buttonFont}>
            <Accordion defaultExpanded justify="center" alignitems="center" style={{background: "linear-gradient(to bottom, #93dafa 0%, #ffffff 100%)", 
            boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", borderColor:"white"  }} 
            square={false} >
              <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header">
                <Typography>Recently Uploaded Receipt Details</Typography>
              </AccordionSummary>
              <Snackbar open = {this.state.snackbaropen}
          autoHideDuration={3000}
          onClose={this.snackbarClose}
          message= {<span id="message-id">{this.state.snackbarmsg}</span>}
          action={[<CloseIcon key="close" arial-label="Close" onClick={this.snackbarClose}></CloseIcon>]}/>
              <AccordionDetails>
                { this.props.files.map((file, key) => {
                  var multihash = [file.fileHash];
                  window.multihash1 = multihash;
                  return(
                  <Typography variant='subtitle1'  style={{justifyContent: "space-between"}} key={key} align='left'>
                    
                        Receipt Name:              {file.fileName}  <br></br>
                        Recepient MetaMask Account: {file.fileDescription}<br></br>
                        Receipt Format:  {file.fileType}<br></br>
                        Receipt File Size:  {convertBytes(file.fileSize)}<br></br>
                        Upload Time:  {moment.unix(file.uploadTime).format('h:mm:ss A M/D/Y')}
                        <br></br>
                        Uploader MetaMask Account: {file.uploader}<br></br>
                        Receipt Hash: {multihash} 
                        &nbsp;
                        <Tooltip arrow title="Copy File Hash">
                          <FileCopyIcon 
                          style={{fontSize: "16px", color: "midnightblue"}}
                          onClick={() => {navigator.clipboard.writeText(file.fileHash); this.setState({snackbaropen:true, snackbarmsg:'File Hash Copied ✔️'})}} 
                          >
                          </FileCopyIcon>
                        </Tooltip>
                        
                          <br></br>
                        View Receipt:  <a href={"https://ipfs.infura.io/ipfs/" + multihash}
                            rel="noopener noreferrer"
                            target="_blank">
                            {file.fileName}
                    </a> 
                  </Typography>
                  )
                })}
              </AccordionDetails>
            </Accordion>
          </ThemeProvider>
        </Grid>
        </Grid>
        
      </ThemeProvider>
     
    );
  }
}


export default Main;