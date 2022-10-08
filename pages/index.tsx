import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'

const FAUCET_URL = process.env.NEXT_PUBLIC_ECLIPSE_FAUCET_URL
const Home: NextPage = () => {
  const [sending, setSending] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [amount, setAmount] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  console.log('FAUCET_URL', FAUCET_URL)
  const onSend = async () => {
    if (!FAUCET_URL || !address || !amount) return

    setSending(true)
    const res = await fetch(FAUCET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonRpc: '2.0',
        id: '2',
        method: 'requestAirdrop',
        params: [address, amount],
      }),
    })
    const response = await res.json()
    console.log('response', response)
    setSending(false)
    if (response.error) {
      setError(response.error.message)
    } else {
      setSuccess(true)
    }
  }

  return (
    <div>
      <Head>
        <title>Eclipse Faucet</title>
      </Head>
      <div>
        <div className="title">
          <div className="subhead">Eclipse</div>
          <div className="header">Faucet</div>
        </div>

        <div className="form">
          <div className="form-label">Destination Account Public Key</div>
          <input
            value={address ?? ''}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="public key"
            type="text"
          />

          <div className="form-label">Amount (lamports)</div>
          <input value={amount ?? ''} onChange={(e) => setAmount(e.target.value)} placeholder="amount" type="number" />

          <button className="send" type="submit" onClick={onSend}>
            Send
          </button>
        </div>
        {success && <p>Success!</p>}
        {error && <p>{error}</p>}
      </div>
    </div>
  )
}

export default Home
