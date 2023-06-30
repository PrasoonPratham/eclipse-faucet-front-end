import React, { useState, useEffect } from 'react'
import { Web3ReactProvider, useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import ReCAPTCHA from 'react-google-recaptcha'
import ConnectWalletButton from './components/ConnectWalletButton'
import Link from 'next/link'
import Image from 'next/image'
import logo from './assets/logo.svg'
import { AddNetworkButton } from './components/AddNetworkButton'
import { ArrowUpRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import RequestAirdrop from './components/RequestTokens'

const stepsData = [
  {
    number: 1,
    label: 'Complete Captcha',
    color: 'bg-custom-green',
    textField: 'This is text for step 1.',
    title: 'lol',
  },
  { number: 2, label: 'Connect wallet', color: 'bg-custom-blue', textField: 'This is text for step 2.', title: 'lol2' },
  { number: 3, label: 'Choose chain', color: 'bg-custom-yellow', textField: 'This is text for step 3.', title: 'lol3' },
  { number: 4, label: 'Airdrop', color: 'bg-custom-orange', textField: 'This is text for step 4.', title: 'lol4' },
]

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

export default function Faucet() {
  const [currentStep, setCurrentStep] = useState(1)
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const { active } = useWeb3React<Web3Provider>()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isChainConnected, setisChainConnected] = useState(false)
  const [rpcUrl, setRpcUrl] = useState<string | null>(null)
  const [currentAccount, setCurrentAccount] = useState<string | undefined>(undefined)
  const isConnected = active

  useEffect(() => {
    if (captchaValue) {
      setCurrentStep(2)
    }
  }, [captchaValue])

  // useEffect(() => {
  //   if (isChainConnected) {
  //     setCurrentStep(4)
  //   }
  // }, [isChainConnected])

  const handleNext = () => {
    if (currentStep < stepsData.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value)
  }

  const currentStepData = stepsData.find((step) => step.number === currentStep)

  return (
    <>
      <nav className="flex items-center justify-between bg-black">
        <div className="flex items-center">
          <Link href="/">
            <Image src={logo} alt="Logo" className="h-12 w-12 sm:h-20 sm:w-20 sm:m-7 m-4" />
          </Link>
          <p className="text-slate-100 text-3xl sm:text-4xl font-extralight">Faucet</p>
        </div>
        <div className="flex items-center mr-5">
          <a href="https://eclipse.builders" target="_blank" className="items-center">
            <p className="text-white sm:text-2xl text-lg underline sm:mr-5 flex items-center font-extralight">
              eclipse.builders
              <ArrowUpRightIcon className="h-6 w-6 text-white" />
            </p>
          </a>
        </div>
      </nav>

      <div className="flex flex-col items-center h-full ">
        <div className="w-full flex flex-col md:flex-row h-60 sm:h-66">
          {stepsData.map((step, index) => (
            <div
              key={index}
              className={`h-full md:w-1/3 ${step.color} ${currentStep === step.number ? '' : 'hidden md:block'}`}
            >
              <div className="flex flex-col justify-center items-start h-full pl-6">
                <span className="text-white text-5xl sm:text-8xl">{step.number}</span>
                <p
                  className={`text-white text-left mt-6 sm:mt-10 text-lg sm:text-xl ${
                    currentStep === step.number ? 'border-b-2 sm:border-b-4 border-white' : ''
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {currentStepData && (
          <div className="w-4/5 mt-3">
            <h3 className="text-base font-semibold leading-6 text-gray-900">{currentStepData.title}</h3>
            <p className="mt-2 max-w-4xl text-sm text-gray-500">{currentStepData.textField}</p>
          </div>
        )}

        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center mt-5 sm:mt-0 sm:mx-auto sm:w-full ">
            <div className="bg-white px-3 py-3 sm:px-12 sm:py-6 sm:h-[500px] flex flex-col justify-center">
              {currentStep === 1 && (
                <ReCAPTCHA sitekey="6LfnN6MlAAAAAGQ_leBCpZkzcX8MFFQO_5U-Iqqp" onChange={handleCaptchaChange} />
              )}
              {currentStep === 2 && (
                <Web3ReactProvider getLibrary={getLibrary}>
                  <ConnectWalletButton
                    isConnected={isConnected}
                    isConnecting={isConnecting}
                    onConnecting={setIsConnecting}
                    onConnected={handleNext}
                  >
                    {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
                  </ConnectWalletButton>
                </Web3ReactProvider>
              )}

              {currentStep === 3 && (
                <div>
                  <AddNetworkButton setIsConnected={setisChainConnected} onRpcUrlChanged={setRpcUrl}>
                    {'Switch Network'}
                  </AddNetworkButton>
                </div>
              )}

              {currentStep === 4 && rpcUrl && (
                <div className="flex justify-center mt-2">
                  <RequestAirdrop account={currentAccount} rpcUrl={rpcUrl || ''} />
                </div>
              )}
            </div>
          </div>
        </div>

        <nav className="isolate inline-flex -space-x-px rounded-md shadow-md bg-gradient-to-r from-orange-300 to-orange-500 mb-8">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="flex items-center py-1 px-2 text-white font-semibold rounded-md bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-300 focus:ring-opacity-50"
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" aria-hidden="true" />
              Back
            </button>
          )}
          {currentStep < stepsData.length && (
            <button
              onClick={handleNext}
              className="flex items-center py-1 px-2 text-white font-semibold rounded-md bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-300 focus:ring-opacity-50"
            >
              Next
              <ChevronRightIcon className="h-4 w-4 ml-1" aria-hidden="true" />
            </button>
          )}
        </nav>
      </div>
    </>
  )
}
