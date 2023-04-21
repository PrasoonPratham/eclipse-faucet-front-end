import { CheckIcon } from '@heroicons/react/20/solid'
import { Transition } from '@headlessui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import { IBM_Plex_Mono } from '@next/font/google'

import React, { useState } from 'react'
import { Web3ReactProvider, useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { ConnectWalletButton } from './components/ConnectWalletButton'

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const IBM_Mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-IBM-Mono'
})

const timeline = [
  {
    id: 1,
    content: 'Complete Catcha.',
    target: 'Verify your identity',
    href: '#',
    message: 'Complete Captcha',
  },
  {
    id: 2,
    content: 'Connect wallet.',
    target: ' Connect to Metamask, backpack or any other Ethereum wallet',
    href: '#',
    message: 'Next Step',
  },
  {
    id: 3,
    content: 'Connect Nautilus EVM.',
    target: 'Add the nautilus chain to your wallet',
    href: '#',
    message: 'Next Step',
  },
  {
    id: 4,
    content: 'Airdrop testnet tokens.',
    target: 'Receive testnet tokens to your wallet',
    href: '#',
    message: 'Next Step',
  },
  {
    id: 5,
    content: 'Done!',
    target: 'Your wallet has been funded with testnet tokens',
    href: '#',
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [visibleSections, setVisibleSections] = useState(1)
  const [isCaptchaSolved, setIsCaptchaSolved] = useState(false)

  const onCaptchaChange = (value: string | null) => {
    if (value) {
      setIsCaptchaSolved(true)
    } else {
      setIsCaptchaSolved(false)
    }
  }

  // Update the handleButtonClick function to check if the wallet is connected before proceeding to the next section
  const handleButtonClick = (eventIdx: number) => {
    // Update this condition to allow moving to the next step for Nautilus EVM section
    if (eventIdx === 0 || (eventIdx === 1 && isWalletConnected) || eventIdx > 1) {
      setVisibleSections(eventIdx + 2)
    }
  }

  const resetTimeline = () => {
    setVisibleSections(1)
  }

  // Add the handleWalletConnected callback function
  const handleWalletConnected = () => {
    setIsWalletConnected(true)
  }

  const [isWalletConnected, setIsWalletConnected] = useState(false)

  return (
    <div className={'bg-black h-screen p-5 ' + `${IBM_Mono.variable}`}>
      <div className="border-b border-gray-200 pb-5 md:mx-32 lg:mx-8 xl:mx-72 py-10 mb-10">
        <h2 className="text-3xl font-semibold leading-6 text-white font">Eclipse EVM Faucet</h2>
        <p className="pt-2 max-w-4xl text-md text-gray-200">
          Get testnet tokens to your wallet for any of the Eclipse EVM chains!
        </p>
      </div>

      <div className="text-white p-12 rounded-lg shadow-lg bg-slate-500/25 md:mx-32 lg:mx-8 xl:mx-72 Inter">
        <div className="flow-root">
          <ul role="list" className="-mb-8 ">
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
                            eventIdx < visibleSections ? 'bg-green-500' : 'bg-gray-500'
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0 flex-1 space-y-1.5">
                        <div>
                          <p className="text-sm">
                            {event.content}{' '}
                            <a href={event.href} className="font-medium underline">
                              {event.target}
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>

                    {eventIdx === 0 && (
                      <div className="flex justify-center mt-2">
                        <ReCAPTCHA sitekey="6LfnN6MlAAAAAGQ_leBCpZkzcX8MFFQO_5U-Iqqp" onChange={onCaptchaChange} />
                      </div>
                    )}
                    {eventIdx === 1 && (
                      <div className="flex justify-center mt-2">
                        <Web3ReactProvider getLibrary={getLibrary}>
                          <div>
                            <ConnectWalletButton onConnected={handleWalletConnected}>
                              Connect Wallet
                            </ConnectWalletButton>
                          </div>
                        </Web3ReactProvider>
                      </div>
                    )}

                    {eventIdx === 2 && (
                      <div className="flex justify-center mt-2">
                        {/* <AddNetworkButton>{"Add/Switch Network"}</AddNetworkButton> */}
                      </div>
                    )}

                    {eventIdx === visibleSections - 1 && eventIdx !== timeline.length - 1 && (
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleButtonClick(eventIdx)}
                          disabled={!isCaptchaSolved && eventIdx === 0}
                          className="inline-flex items-center my-3 px-3 py-1.5 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4 mb-2"
                        >
                          {event.message}
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
                Start Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
