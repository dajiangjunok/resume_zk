'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'

export function Header() {
  const [mounted, setMounted] = useState(false)
  const account = useAccount()
  const isConnected = mounted ? account.isConnected : false

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4">
          <h1 className="text-lg md:text-2xl font-bold gradient-text">
            Resume ZK
          </h1>
          <div className="hidden lg:block text-sm text-muted-foreground">
            Zero-Knowledge Resume Platform
          </div>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          {isConnected && (
            <div className="hidden lg:block text-sm text-muted-foreground">
              Connected to Monad Testnet
            </div>
          )}
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading'
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus || authenticationStatus === 'authenticated')

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          type="button"
                          className="gradient-bg text-white px-3 md:px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm md:text-base"
                        >
                          <span className="hidden sm:inline">Connect Wallet</span>
                          <span className="sm:hidden">Connect</span>
                        </button>
                      )
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                          Wrong network
                        </button>
                      )
                    }

                    return (
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="hidden sm:flex items-center space-x-2 bg-secondary text-secondary-foreground px-2 md:px-3 py-2 rounded-lg hover:opacity-90 transition-opacity"
                        >
                          {chain.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 16,
                                height: 16,
                                borderRadius: 999,
                                overflow: 'hidden',
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? 'Chain icon'}
                                  src={chain.iconUrl}
                                  style={{ width: 16, height: 16 }}
                                />
                              )}
                            </div>
                          )}
                          <span className="text-xs hidden md:inline">{chain.name}</span>
                        </button>

                        <button
                          onClick={openAccountModal}
                          type="button"
                          className="gradient-bg text-white px-3 md:px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
                        >
                          <span className="hidden sm:inline">{account.displayName}</span>
                          <span className="sm:hidden">{account.displayName?.slice(0, 6)}...</span>
                          <span className="hidden md:inline">
                            {account.displayBalance
                              ? ` (${account.displayBalance})`
                              : ''}
                          </span>
                        </button>
                      </div>
                    )
                  })()}
                </div>
              )
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </header>
  )
}