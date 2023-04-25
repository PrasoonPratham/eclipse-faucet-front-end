import React, { useEffect, useState } from 'react';

interface AddNetworkButtonProps {
  children: React.ReactNode;
  setIsNautilusConnected: (connected: boolean) => void;
}

export const AddNetworkButton: React.FC<AddNetworkButtonProps> = ({ children, setIsNautilusConnected  }) => {
  const [isNetworkAdded, setIsNetworkAdded] = useState(false);
  const [connectedChain, setConnectedChain] = useState('');

  const addNetwork = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${(91002).toString(16)}`,
              chainName: 'Nautilus Triton Testnet',
              rpcUrls: ['https://api.evm.zebec.eclipsenetwork.xyz/solana'],
              nativeCurrency: {
                name: 'tZBC',
                decimals: 18,
                symbol: 'tZBC',
              },
              blockExplorerUrls: ['https://triton.nautscan.com/'],
            },
          ],
        });
        setIsNetworkAdded(true);
      } catch (error) {
        console.error('Error adding network:', error);
      }
    } else {
      alert('Ethereum provider not found');
    }
  };

useEffect(() => {
  if (window.ethereum) {
    // Add this block to initialize the connectedChain state
    (async () => {
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      const isConnected = currentChainId === `0x${(91002).toString(16)}`;
      setIsNetworkAdded(isConnected);
      setConnectedChain(isConnected ? 'Nautilus Triton Testnet' : '');
      setIsNautilusConnected(isConnected);
    })();

    // Listen for chainChanged event
    window.ethereum.on('chainChanged', () => {
      const isConnected = window.ethereum.chainId === `0x${(91002).toString(16)}`;
      setIsNetworkAdded(isConnected);
      setConnectedChain(isConnected ? 'Nautilus Triton Testnet' : '');
      setIsNautilusConnected(isConnected);
    });

    // Clean up the listener when the component is unmounted
    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }
}, [setIsNautilusConnected]);


  const buttonText = connectedChain ? `${connectedChain}` : children;

  return (
    <button
      onClick={addNetwork}
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
        isNetworkAdded ? 'bg-green-500' : 'bg-blue-500'
      } hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
    >
      {buttonText}
    </button>
  );
};


export default AddNetworkButton;
