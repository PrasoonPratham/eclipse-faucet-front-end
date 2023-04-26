import React, { useState, useCallback, useEffect } from 'react'
import { ethers } from 'ethers'

type FaucetFormProps = {
  account?: string | null
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

const FaucetForm: React.FC<FaucetFormProps> = ({ account }) => {
  const [address, setAddress] = useState<string>('')
  const [amount, setAmount] = useState<number>(10)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)

  useEffect(() => {
    if (account) {
      setAddress(account)
    }
  }, [account])

  const onSend = useCallback(async () => {
    if (!ethers.utils.isAddress(address) || amount <= 0) {
      setError('Invalid address or amount')
      return
    }

    setSending(true)
    setError(null)
    setSuccess(null)

    const result = await requestAirdrop(address, amount)

    setSending(false)
    if (!result) {
      setError('Airdrop failed')
    } else {
      setSuccess(true)
    }
  }, [address, amount])

  return (
    <div className="form">
      <label htmlFor="input-address" className="form-label">
        Wallet Address
      </label>
      <input
        id="input-address"
        value={address || ''}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="address"
        type="text"
      />

      <button className="send" type="submit" onClick={onSend} disabled={sending}>
        {sending ? 'Sending...' : 'Send'}
      </button>
      {success && <p>Sent!</p>}
      {error && <p>{error}</p>}
    </div>
  )
}

export default FaucetForm
