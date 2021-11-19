import "./App.css";
import React from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  IconButton,
} from "@material-ui/core";
import Metamask from "./components/Metamask";
import useStyles from "./style";
import newReqABI from "./abis/newReqABI.json";
import ethSenderABI from "./abis/ethSenderABI.json";
import Web3 from "web3";

const target = "0xfa0a8b60B2AF537DeC9832f72FD233e93E4C8463";
const referer = "0x0000000000000000000000000000000000000000";
const ethForCall = 0;
const verifyUser = false;
const insertFeeAmount = false;
const payWithAUTO = false;

const ethSenderContractAddress = "0xfa0a8b60B2AF537DeC9832f72FD233e93E4C8463";
const newReqContractAddress = "0x3C901dc595105934D61DB70C2170D3a6834Cb8B7";

function App() {
  const classes = useStyles();
  const [sender, setSender] = React.useState("");
  const [min, setMin] = React.useState(0);

  const handleChangeTime = (min) => {
    console.log("min: ", min);
    setMin(min);
  };

  const handleConnectNetwork = async () => {
    if (window.ethereum) {
      //check if Metamask is installed
      try {
        //connect to site
        const address = await window.ethereum.enable(); //connect Metamask
        const obj = {
          connectedStatus: true,
          status: "",
          address: address,
        };
        console.log(address);
        setSender(address[0]);
        return obj;
      } catch (error) {
        return {
          connectedStatus: false,
          status: "🦊 Connect to Metamask using the button on the top right.",
        };
      }
    } else {
      return {
        connectedStatus: false,
        status:
          "🦊 You must install Metamask into your browser: https://metamask.io/download.html",
      };
    }
  };

  const handleSwitchNetwork = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x3" }],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x03",
                  rpcUrl:
                    "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161" /* ... */,
                },
              ],
            });
          } catch (addError) {
            // handle "add" error
          }
        }
        // handle other "switch" errors
      }
    } else {
      return {
        connectedStatus: false,
        status:
          "🦊 You must install Metamask into your browser: https://metamask.io/download.html",
      };
    }
  };

  const handleSendNewReq = async () => {
    if (window.ethereum) {
      var web3 = new Web3(window.ethereum);
      var ethSenderContract = new web3.eth.Contract(
        ethSenderABI,
        ethSenderContractAddress
      );
      var newReqContract = new web3.eth.Contract(
        newReqABI,
        newReqContractAddress
      );
      var time = min * 60;
      console.log();
      var callData = ethSenderContract.methods
        .sendEthAtTime(time, sender)
        .encodeABI();

      // using the event emitter
      newReqContract.methods
        .newReq(
          target,
          referer,
          callData,
          ethForCall,
          verifyUser,
          insertFeeAmount,
          payWithAUTO
        )
        .send({ from: sender })
        .on("transactionHash", function (hash) {})
        .on("confirmation", function (confirmationNumber, receipt) {})
        .on("receipt", function (receipt) {
          console.log("receipt", receipt);
          window.alert("NewReq method successfully called");
        })
        .on("error", function (error, receipt) {
          // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
          window.alert("Error: ", error);
        });
    } else {
      window.alert("You have to install Metamask!!!");
    }
  };

  return (
    <div className="App">
      <h1>Automated Ether Sender</h1>
      <Box m={2}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              id="outlined-search"
              label="Enter receiver address"
              variant="outlined"
              value={sender}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="outlined-search"
              label="Enter time in minutes"
              variant="outlined"
              value={min}
              onChange={(event) => handleChangeTime(event.currentTarget.value)}
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>

      <Box>
        <IconButton
          onClick={handleConnectNetwork}
          className={classes.iconButton1}
        >
          <Metamask />
          &nbsp; Connect Metamask
        </IconButton>
        <IconButton
          onClick={handleSwitchNetwork}
          className={classes.iconButton1}
        >
          <Metamask />
          &nbsp; Switch to Ropsten
        </IconButton>
        <Button
          variant="outlined"
          className={classes.sendButton}
          onClick={handleSendNewReq}
        >
          SEND ETHER
        </Button>
      </Box>
      <Box m={2}>
        {sender !== "" ? (
          <Typography variant="body1" color="textPrimary">
            Your wallent address is: {sender}
          </Typography>
        ) : (
          <Typography>Metamask is not yet connected</Typography>
        )}
      </Box>
    </div>
  );
}

export default App;
