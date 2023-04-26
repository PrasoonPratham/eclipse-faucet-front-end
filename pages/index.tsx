import React, { useEffect, useState } from 'react';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import ReCAPTCHA from 'react-google-recaptcha';
import { Transition } from '@headlessui/react';
import { CheckIcon, ArrowPathIcon, ArrowDownIcon } from '@heroicons/react/20/solid';
import Banner  from './components/Banner';
import ConnectWalletButton from './components/ConnectWalletButton';
import { AddNetworkButton } from './components/AddNetworkButton';




function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const timeline = [
  {
    id: 1,
    content: 'Complete Catcha.',
    message: 'Complete Captcha',
  },
  {
    id: 2,
    content: 'Connect wallet.',
    message: 'Next Step',
  },
  {
    id: 3,
    content: 'Connect Nautilus EVM.',
    message: 'Next Step',
  },
  {
    id: 4,
    content: 'Airdrop 10 testnet tokens.',
    message: 'Next Step',
  },
  {
    id: 5,
    content: 'Done!',
  },
]



function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Faucet() {
  const [visibleSections, setVisibleSections] = useState(1)
  const [isCaptchaSolved, setIsCaptchaSolved] = useState(false)

  const { account } = useWeb3React()
  const [isAirdropRequested, setIsAirdropRequested] = useState(false)

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

      console.log('Sending request to:', url)
      console.log('Request headers:', headers)
      console.log('Request body:', body)

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
      })

      console.log('Response:', response)

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

  const onCaptchaChange = (value: string | null) => {
    if (value) {
      setIsCaptchaSolved(true)
    } else {
      setIsCaptchaSolved(false)
    }
  }

  // Update the handleButtonClick function to check if the wallet is connected before proceeding to the next section
  const handleButtonClick = async (eventIdx: number) => {
    if (
      (eventIdx === 0 ||
        (eventIdx === 1 && isWalletConnected) ||
        (eventIdx === 2 && isNautilusConnected) ||
        eventIdx > 2) &&
      !isConnecting
    ) {
      if (eventIdx === 2 && isNautilusConnected && isCaptchaSolved && account) {
        const airdropSuccess = await requestAirdrop(account, 10)
        setIsAirdropRequested(airdropSuccess)
        if (airdropSuccess) {
          setVisibleSections(5)
        }
      } else {
        setVisibleSections(eventIdx + 2)
      }
    }
  }

  const resetTimeline = () => {
    setVisibleSections(1)
    setIsWalletConnected(false) // Add this line to reset the wallet connection state
  }

  // Add the handleWalletConnected callback function
  const handleWalletConnected = () => {
    setIsWalletConnected(true)
  }

  const [isWalletConnected, setIsWalletConnected] = useState(false)
  useEffect(() => {
    if (isWalletConnected) {
      setVisibleSections(3)
    }
  }, [isWalletConnected])

  const [isConnecting, setIsConnecting] = useState(false)
  const [isNautilusConnected, setIsNautilusConnected] = useState(false)

  return (
    <div>
      <Banner
        text={'Eclipse x Injective Hackathon is live!'}
        linkToTarget="https://www.youtube.com/watch?v=zQIZ0EsJ2s4&ab_channel=Injective"
      />
      <div className="bg-black h-screen p-5">
        <div className="border-b border-gray-200 pb-5 md:mx-32 lg:mx-8 xl:mx-72 my-10">
          <h3 className="text-2xl text-gray-200 font-semibold leading-6 text-white-900">Eclipse EVM Faucet</h3>
          <p className="mt-2 max-w-4xl text-sm text-gray-200">
            Get testnet tokens to your wallet for any of the Eclipse EVM chains!
          </p>
        </div>

        <div className="text-white p-12 rounded-lg shadow-lg bg-slate-500/25 md:mx-32 lg:mx-8 xl:mx-72">
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              {timeline.map((event, eventIdx) => (
                <Transition
                  key={event.id}
                  show={eventIdx < visibleSections}
                  enter="transition-opacity duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <li>
                    <div className="relative pb-8">
                      {eventIdx !== timeline.length - 1 ? (
                        <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-600" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={classNames(
                              'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-gray-900',
                              eventIdx === 1 && !isWalletConnected
                                ? 'bg-green-500'
                                : eventIdx < visibleSections
                                ? 'bg-green-500'
                                : 'bg-gray-500'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0 flex-1 space-y-1.5">
                          <div>
                            <p className="text-sm">{event.content} </p>
                          </div>
                        </div>
                      </div>

                      {eventIdx === 0 && !isCaptchaSolved && (
                        <div className="w-full flex justify-center mt-2">
                          <div className="relative ">
                            <div className="md:hidden">
                              <ReCAPTCHA
                                sitekey="6LfnN6MlAAAAAGQ_leBCpZkzcX8MFFQO_5U-Iqqp"
                                onChange={onCaptchaChange}
                                className="scale-50"
                              />
                            </div>

                            {/* Desktop and Tablet ReCAPTCHA */}
                            <div className="hidden md:block">
                              <ReCAPTCHA
                                sitekey="6LfnN6MlAAAAAGQ_leBCpZkzcX8MFFQO_5U-Iqqp"
                                onChange={onCaptchaChange}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {eventIdx === 1 && (
                        <div className="flex justify-center mt-2">
                          <Web3ReactProvider getLibrary={getLibrary}>
                            <ConnectWalletButton
                              isConnected={isWalletConnected}
                              isConnecting={isConnecting}
                              onConnecting={setIsConnecting}
                              onConnected={handleWalletConnected}
                            >
                              {isWalletConnected ? 'Connect Wallet' : 'Wallet not found'}
                            </ConnectWalletButton>
                          </Web3ReactProvider>
                        </div>
                      )}

                      {eventIdx === 2 && (
                        <div className="flex justify-center mt-2">
                          <AddNetworkButton setIsNautilusConnected={setIsNautilusConnected}>
                            {'Switch Network'}
                          </AddNetworkButton>
                        </div>
                      )}

                      {eventIdx === visibleSections - 1 && eventIdx !== timeline.length - 1 && eventIdx !== 1 && (
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleButtonClick(eventIdx)}
                            disabled={(!isCaptchaSolved && eventIdx === 0) || (eventIdx === 3 && !isNautilusConnected)}
                            className={`inline-flex items-center my-3 px-3 py-1.5 border border-transparent text-sm font-medium rounded shadow-sm text-white ${
                              isAirdropRequested && eventIdx === 3
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-blue-500 hover:bg-blue-600'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4 mb-2`}
                          >
                            {isAirdropRequested && eventIdx === 3 ? (
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            ) : (
                              <ArrowDownIcon className="h-5 w-5" aria-hidden="true" />
                            )}
                            <span className="ml-2">{event.message}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                </Transition>
              ))}
            </ul>
            {visibleSections === timeline.length && (
              <div className="flex justify-center -my-6">
                <button
                  onClick={resetTimeline}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4 mb-2"
                >
                  <ArrowPathIcon className="h-5 w-5 mr-3" aria-hidden="true" />
                  Start Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
