import React, { useState } from 'react'

const RequestAirdrop = ({ account }: { account: string | undefined }) => {
  const [buttonStatus, setButtonStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  async function requestAirdrop(address: string, amount: number): Promise<boolean> {
    try {
      const url = 'https://faucet.evm.zebec.eclipsenetwork.xyz/request_neon'
      const headers = {
        'Content-Type': 'application/json',
      }
      const body = JSON.stringify({
        wallet: address,
        amount: amount,
      })

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
      })

      if (!response.ok) {
        console.error('Error requesting airdrop', response)
        return false
      }

      const text = await response.text()
      if (!text) {
        console.error('Empty response')
        return false
      }

      const data = JSON.parse(text)
      if (data.success) {
        console.log('Airdrop successful', data)
        setButtonStatus('success')
        return true
      } else {
        console.error('Airdrop failed', data)
        setButtonStatus('error')
        return false
      }
    } catch (error) {
      console.error('Error requesting airdrop', error)
      setButtonStatus('error')
      return false
    }
  }

  const handleClick = async () => {
    if (buttonStatus === 'idle') {
      try {
        // Request the user's accounts
        const accounts = await(window as any).ethereum.request({ method: 'eth_requestAccounts' }) as string[]

        // Get the first account from the accounts array
        const account = accounts[0]

        if (account) {
          console.log('Account address:', account)

          // Request the airdrop
          setButtonStatus('sending')
          await requestAirdrop(account, 1).finally(() => {
            setButtonStatus('idle')
          })
          console.log('Airdrop requested for account:', account)
        } else {
          console.log('No account found.')
        }
      } catch (err: any) {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log('Please connect to MetaMask.')
        } else {
          console.error(err)
        }
        setButtonStatus('idle')
      }
    }
  }

  return (
    <button
      className={`send inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
        buttonStatus === 'idle'
          ? 'bg-blue-500 hover:bg-blue-600'
          : buttonStatus === 'sending'
          ? 'bg-yellow-500'
          : buttonStatus === 'success'
          ? 'bg-green-500'
          : 'bg-red-500'
      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4 mb-2`}
      type="submit"
      onClick={handleClick}
      //   disabled={buttonStatus !== 'idle' || !account}
    >
      {buttonStatus === 'idle'
        ? 'Send tokens'
        : buttonStatus === 'sending'
        ? 'Sending...'
        : buttonStatus === 'success'
        ? 'Sent!'
        : 'Error'}
    </button>
  )
}

export default RequestAirdrop
