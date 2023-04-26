import React, { useState } from 'react'

interface FaucetFormProps {
  account: string | null | undefined
  success: boolean
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>
  error: string | null
  setError: React.Dispatch<React.SetStateAction<string | null>>
  onAirdropButtonClick: () => void
}

 const requestAirdrop = async (address: string, amount: number): Promise<boolean> => {
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

    const data = await response.json()
    if (data.success) {
      console.log('Airdrop successful', data)
      return true
    } else {
      console.error('Airdrop failed', data)
      return false
    }
  } catch (error) {
    console.error('Error requesting airdrop', error)
    return false
  }
}

const FaucetForm: React.FC<FaucetFormProps> = ({
  account,
  success,
  setSuccess,
  error,
  setError,
  onAirdropButtonClick,
}) => {
  console.log(account)

  return (
    <div className="form">
      <div className="address-display">
        <p>Connected wallet address:</p>
        <p>{account || 'No connected wallet'}</p>
      </div>

      <button
        className="send inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4 mb-2"
        type="submit"
        onClick={onAirdropButtonClick}
        disabled={!account}
      >
        {'Send'}
      </button>
      {success && <p>Sent!</p>}
      {error && <p>{error}</p>}
    </div>
  )
}

export default FaucetForm
