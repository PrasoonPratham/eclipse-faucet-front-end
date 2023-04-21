// AddNetworkButton.tsx

import React from 'react';
import { useWeb3React } from '@web3-react/core';

const toHex = (num: Number) => {
  const val = Number(num);
  return '0x' + val.toString(16);
};

const zebecChainId = 91002;

const networkParams = {
  [toHex(zebecChainId)]: {
    chainId: toHex(zebecChainId),
    rpcUrl: 'https://api.evm.zebec.eclipsenetwork.xyz/solana',
    chainName: 'Nautilus Triton Testnet',
    nativeCurrency: { name: 'tZBC', decimals: 18, symbol: 'tZBC' },
    blockExplorerUrls: ['https://triton.nautscan.com/'],
  },
};

interface Props {
  children: React.ReactNode;
}

export const AddNetworkButton: React.FC<Props> = ({ children }) => {
  const { library } = useWeb3React();

  const onClick = async () => {
    try {
      if (library && library.provider) {
        const provider = library.provider;

        if ('request' in provider) {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [networkParams[toHex(zebecChainId)]],
          });
        } else {
          console.error('Request method not supported by provider');
        }
      } else {
        console.error('Ethereum provider not found');
      }
    } catch (error) {
      console.error('Failed to add network:', error);
    }
  };

  return (
    <button onClick={onClick} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4 mb-2">
      {children}
    </button>
  );
};
