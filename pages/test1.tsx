import { useState, useCallback, useEffect, useMemo, ReactNode } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { NextPage } from 'next'
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { SolflareWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import dynamic from 'next/dynamic'
import { clusterApiUrl } from '@solana/web3.js'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css')
