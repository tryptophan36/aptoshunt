// lib/aptos.js

import { AptosClient, AptosAccount, TxnBuilderTypes, BCS } from 'aptos';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
const NODE_URL = 'https://fullnode.testnet.aptoslabs.com'; // Replace with your actual node URL
const client = new AptosClient(NODE_URL);
const moduleAddress = "0xcbddf398841353776903dbab2fdaefc54f181d07e114ae818b1a67af28d1b018";
// lib/aptos.js

export const dropToken = async ( totalAmount, claimsAllowed, latitude, longitude) => {
    const { account, signAndSubmitTransaction } = useWallet();
    const payload = {
      data:{
        function: '0xe1601771384dfb2ac6d2788eb96b449eef1ff97a20677c2b644eeab77e73c4bf::treasure_token::drop_token', // Update with actual module address
      functionArguments: [
        totalAmount, 
        claimsAllowed, 
        latitude, 
        longitude
      ],
      }
    };
  
    const response = await signAndSubmitTransaction(transaction);
    // wait for transaction
    const txnResponse=await aptos.waitForTransaction({transactionHash:response.hash});
    console.log(txnResponse,"------>")
    // return txnResponse;
  };

  export const claimToken = async (account, latitude, longitude) => {
    const transaction = {
      type: 'entry_function_payload',
      function: '0xe1601771384dfb2ac6d2788eb96b449eef1ff97a20677c2b644eeab77e73c4bf::treasure_token::claim_token',
      type_arguments: [],
      arguments: [latitude, longitude],
    };
  
    const response = await signAndSubmitTransaction(transaction);
    const txnResponse=await aptos.waitForTransaction({transactionHash:response.hash});
    console.log(txnResponse,"------>")
    
  };

// lib/aptos.js

export const viewDropInfo = async (accountAddress, latitude, longitude) => {
    const payload = {
      type: 'entry_function_payload',
      function: '0xe1601771384dfb2ac6d2788eb96b449eef1ff97a20677c2b644eeab77e73c4bf::treasure_token::view_drop_info',
      type_arguments: [],
      arguments: [latitude, longitude],
    };
  
    const response = await aptosClient.view(accountAddress, payload);
    return response;
  };

  // Example of how to use an existing account's private key
  export const getExistingAccount = (privateKeyHex) => {
    // Convert the hex string private key into a Uint8Array
    const privateKeyBytes = new Uint8Array(Buffer.from(privateKeyHex, 'hex'));
  
    // Initialize an Aptos account with the private key
    const account = new AptosAccount(privateKeyBytes);
  
    return account;
  };
export const aptosClient = client;
