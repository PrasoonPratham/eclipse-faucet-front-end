import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'

const FAUCET_URL = process.env.NEXT_PUBLIC_ECLIPSE_FAUCET_URL
const Home: NextPage = () => {
  const [sending, setSending] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [amount, setAmount] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [signature, setSignature] = useState<string | null>(null)

  const onSend = async () => {
    if (!FAUCET_URL || !address || !amount) return

    setSending(true)
    setError(null)
    const res = await fetch(FAUCET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: '2',
        method: 'requestAirdrop',
        params: [address, Number(amount)],
      }),
    })
    const response = await res.json()
    setSending(false)
    if (response.error) {
      setError(response.error.message)
    } else {
      setSignature(response.result)
    }
  }

  return (
    <div>
      <Head>
        <title>Eclipse Faucet</title>
        <meta name="twitter:card" content="summary_large_image" />
        {/* TODO: update below once there is a final URL */}
        <meta name="twitter:image" content="https://fantastic-jalebi-d0f24b.netlify.app/eclipse_twitter_card.jpg" />
        <meta name="twitter:title" content="Eclipse Faucet" />
        <meta
          name="twitter:description"
          content="The Eclipse testnet faucet is a client tool that allows anyone to easily request a nominal amount of Eclipse assets for testing purposes."
        />

        <meta property="og:title" content="Eclipse Faucet" />
        <meta
          property="og:description"
          content="The Eclipse testnet faucet is a client tool that allows anyone to easily request a nominal amount of Eclipse assets for testing purposes."
        />
        {/* TODO: update below once there is a final URL */}
        <meta property="og:image" content="https://fantastic-jalebi-d0f24b.netlify.app/eclipse_twitter_card.jpg" />
      </Head>
      <div className="container">
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
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
        {signature && <p>Sent!</p>}
        {error && <p>{error}</p>}
      </div>
    </div>
  )
}

export default Home
