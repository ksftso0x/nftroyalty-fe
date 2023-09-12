// Web3 Onboard
import { init } from '@web3-onboard/react';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import ledgerModule from '@web3-onboard/ledger';
import dcentModule from '@web3-onboard/dcent';

import config from '../config/config.json';

const initWeb3Onboard = () => {
  const injected = injectedModule();
  const walletConnect = walletConnectModule({
    version: 2, // **New Param** Defaults to version: 1 - this behavior will be deprecated after the WalletConnect v1 sunset
    handleUri: uri => console.log(uri),
    projectId: 'add66295c14ae927f01057f95e9e9bcd', // ***New Param* Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
    requiredChains: [1, 14, 19, 56, 3068] // chains required to be supported by WC wallet
  });
  const ledger = ledgerModule({
    projectId: 'add66295c14ae927f01057f95e9e9bcd'
  });
  const dcent = dcentModule();

  // initialize Onboard
  init({
    connect: {
      autoConnectAllPreviousWallet: true
    },
    wallets: [injected, walletConnect, ledger, dcent],
    chains: [
      {
        id: config.CHAIN_ID,
        token: config.CHAIN_TOKEN_NAME,
        label: config.CHAIN_LABEL,
        rpcUrl: config.CHAIN_URI,
        // Adding the icon breaks the widget for some dumb reason
        //icon: flareIcon,
      }
    ],
    theme: 'system',
    notify: {
      desktop: {
        enabled: true,
        transactionHandler: transaction => {
          console.log({ transaction })
          if (transaction.eventCode === 'txPool') {
            return {
              type: 'success',
              message: 'Your transaction from #1 DApp is in the mempool',
            }
          }
        },
        position: 'bottomRight'
      },
      mobile: {
        enabled: true,
        transactionHandler: transaction => {
          console.log({ transaction })
          if (transaction.eventCode === 'txPool') {
            return {
              type: 'success',
              message: 'Your transaction from #1 DApp is in the mempool',
            }
          }
        },
        position: 'bottomRight'
      }
    },
    accountCenter: {
      desktop: {
        position: 'bottomRight',
        enabled: true,
        minimal: true
      },
      mobile: {
        position: 'bottomRight',
        enabled: true,
        minimal: true
      }
    },
  });
};

export default initWeb3Onboard;