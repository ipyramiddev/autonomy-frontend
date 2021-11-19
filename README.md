# Autonomy Network Frontend Defi Dapp Engineer Assessment Result

## Problem description

- https://github.com/Autonomy-Network/frontend-challenge

## My solution

### Create Project with creat react app

```
npx create-react-app my-app
cd my-app
npm start
```

### Used Theme

- Material-UI

### Get metamask wallet address && switch network to Ropsten testnet

- Connect to metamask

```js
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
```

- Switch to Ropsten Network

```js
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
```

### Send transaction

- Create smart contract object using `web3.js` npm module, contract abis and `window.ethereum` object.
- Send transaction by calling `newReq` method of `Autonomy` contract deployed on Ropsten.

```js
if (window.ethereum) {
  var web3 = new Web3(window.ethereum);
  var ethSenderContract = new web3.eth.Contract(
    ethSenderABI,
    ethSenderContractAddress
  );
  var newReqContract = new web3.eth.Contract(newReqABI, newReqContractAddress);
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
```

## How to run

- `npm install`
- `npm start`

Check out `http://localhost:3000` on your browser.
