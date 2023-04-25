import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'

interface Props {
  children: React.ReactNode
  onConnected?: () => void // Callback when wallet is connected
  onConnecting?: (connecting: boolean) => void // Callback when wallet is connecting
  isConnected: boolean
  isConnecting: boolean
}

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainnet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
  ],
})

const ConnectWalletButton: React.FC<Props> = ({
  children,
  onConnected,
  onConnecting,
  isConnected,
  isConnecting,
}) => {
  const { activate, error } = useWeb3React()

  const onClick = async () => {
    if (onConnecting) {
      onConnecting(true)
    }
    try {
      await activate(injectedConnector)
      if (onConnected) {
        onConnected()
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      if (onConnecting) {
        onConnecting(false)
      }
    }
  }

  const buttonClass = `inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 mt-4 mb-2 ${
    isConnected
      ? 'text-white bg-green-500 hover:bg-green-600 focus:ring-green-500'
      : 'text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
  }`

  return (
    <button onClick={onClick} disabled={!!error || isConnecting} className={buttonClass}>
      {isConnected ? 'Connected' : children}
    </button>
  )
}

export default ConnectWalletButton
