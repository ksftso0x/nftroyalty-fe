import React from 'react'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { init, useConnectWallet } from '@web3-onboard/react';
import abi from '../config/abiNFT.json';
import abiCGLD from '../config/abiCGLD.json';
import config from '../config/config.json';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import ledgerModule from '@web3-onboard/ledger';
import dcentModule from '@web3-onboard/dcent';
import { toast } from 'react-toastify';
import { faRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const injected = injectedModule()

const walletConnect = walletConnectModule({
    version: 2,
    projectId: config.PROJECT_ID,
    handleUri: uri => console.log(uri),
    qrcodeModalOptions: {
        mobileLinks: ['rainbow', 'metamask', 'argent', 'trust', 'imtoken', 'pillar']
    },
    connectFirstChainId: true
})

const dcent = dcentModule()

// initialize Onboard
init({
    wallets: [injected, walletConnect, dcent],
    chains: [
        {
            id: config.CHAIN_ID,
            token: config.CHAIN_TOKEN_NAME,
            label: config.CHAIN_LABEL,
            rpcUrl: config.CHAIN_URI,
            // Adding the icon breaks the widget for some dumb reason
            //icon: flareIcon,
        }
    ],
    theme: 'system',
    notify: {
        desktop: {
            enabled: true,
            transactionHandler: transaction => {
                console.log({ transaction })
                if (transaction.eventCode === 'txPool') {
                    return {
                        type: 'success',
                        message: 'Your transaction from #1 DApp is in the mempool',
                    }
                }
            },
            position: 'bottomRight'
        },
        mobile: {
            enabled: true,
            transactionHandler: transaction => {
                console.log({ transaction })
                if (transaction.eventCode === 'txPool') {
                    return {
                        type: 'success',
                        message: 'Your transaction from #1 DApp is in the mempool',
                    }
                }
            },
            position: 'bottomRight'
        }
    },
    accountCenter: {
        desktop: {
            position: 'bottomRight',
            enabled: true,
            minimal: true
        },
        mobile: {
            position: 'bottomRight',
            enabled: true,
            minimal: true
        }
    },

})


export default function Mint() {

    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
    const [contractNFT, setContractNFT] = useState(null)
    const [contractCGLD, setContractCGLD] = useState(null)

    // Stuff needed before showing the mint screen
    const [mintStarted, setMintStarted] = useState(false)
    const [isPresale, setIsPresale] = useState(false)
    const [isInWhitelist, setIsInWhitelist] = useState(false)
    const [mintedAmount, setMintedAmount] = useState(0)
    const [maxSupply, setMaxSupply] = useState(0)

    // Stuff needed for the mint screen
    const [rewards, setRewards] = useState(0)
    const [mintPriceSGB, setMintPriceSGB] = useState(4444000000000000000000n)
    const [mintPriceCGLD, setMintPriceCGLD] = useState(444000000000000000000n)
    const [mintQuantity, setMintQuantity] = useState(1)
    const [amountMinted, setAmountMinted] = useState(0)
    const [isMinting, setIsMinting] = useState(false)
    const [isClaiming, setIsClaiming] = useState(false)
    const [remaingTimeToClaim, setRemainingTimeToClaim] = useState(0)




    // create an ethers provider
    let ethersProvider

    if (wallet) {
        // if using ethers v6 this is:
        // ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any')
        ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
        
    }

    // misc 

    const formatEtherNicely = (eth) => {
        if (eth == 0)
            return "0.0"
        if (eth < ethers.utils.formatEther(1))
            return "< 0.1"
        return Number(ethers.utils.formatEther(eth)).toFixed(1)
    }

    const formatSeconds = (seconds) => {
        if (seconds < 0)
            return "0:00"
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const secondsLeft = seconds % 60
        const minutesLeft = minutes % 60
        return `${hours}:${minutesLeft < 10 ? "0" + minutesLeft : minutesLeft}:${secondsLeft < 10 ? "0" + secondsLeft : secondsLeft}`
    }


    const displayError = (error) => {
        console.log(error)
        if (error.data)
            toast.error(error.data.message)
        else
            toast.error(error.message)
    }




    const isPossibleToReadContract = () => {
        try {

            if (!wallet) {
                console.log(connecting)
                console.log(wallet)
                throw new Error('No wallet connected.')
            }

            if (wallet.chains[0]['id'] !== config.CHAIN_ID) {
                throw new Error('Invalid chain.')
            }
            if (contractNFT == null) {
                throw new Error('Contract NFT not initialized.')
            }
            if (contractCGLD == null) {
                throw new Error('Contract CGLD not initialized.')
            }
        }
        catch (error) {
            console.log(error)
            return false
        }
        return true
    }

    // get contracts 
    const getContractNFT = async () => {
        try {
            if (!wallet) {
                console.log('Wallet not connected.')
                return
            }
            if (wallet.chains[0]['id'] !== config.CHAIN_ID) {
                throw new Error('Invalid chain.')
            }

            console.log('wallet', wallet.accounts[0]['address'])
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(config.NFTCONTRACT_ADDR, abi, signer)
            if (!contract) {
                throw new Error('Failed to initialize contract.')
            }
            setContractNFT(contract)
        } catch (error) {
            console.log(error)
        }
    }

    const getContractCGLD = async () => {
        try {
            if (!wallet) {
                console.log('Wallet not connected.')
                return
            }
            if (wallet.chains[0]['id'] !== config.CHAIN_ID) {
                throw new Error('Invalid chain.')
            }

            console.log('wallet', wallet.accounts[0]['address'])
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(config.CGLDCONTRACT_ADDR, abiCGLD, signer)
            if (!contract) {
                throw new Error('Failed to initialize contract.')
            }
            setContractCGLD(contract)
        } catch (error) {
            console.log(error)
        }
    }

    // Get Info before displaying mint screen

    const getMintStarted = async () => {
        try {
            if (!isPossibleToReadContract()) {
                throw new Error('Something went wrong while reading the contract.')
            }
            const mintStarted = await contractNFT.isStarted()
            setMintStarted(mintStarted)
            console.log(mintStarted)
        }
        catch (error) {
            console.log(error)
        }
    }

    const getIsPresale = async () => {
        try {
            if (!isPossibleToReadContract()) {
                throw new Error('Something went wrong while reading the contract.')
            }
            const presale = await contractNFT.isPresaleLive()
            setIsPresale(presale)
            console.log(presale)
        }
        catch (error) {
            console.log(error)
        }
    }


    const getIsInWhitelist = async () => {
        try {
            if (!isPossibleToReadContract()) {
                throw new Error('Something went wrong while reading the contract.')
            }
            const whitelist = await contractNFT.isWhitelisted(wallet.accounts[0]['address'])
            setIsInWhitelist(whitelist)
            console.log(whitelist)
        }
        catch (error) {
            console.log(error)
        }
    }


    const getMintedAmount = async () => {
        try {
            if (!isPossibleToReadContract()) {
                throw new Error('Something went wrong while reading the contract.')
            }
            const quantityMinted = await contractNFT.totalSupply()
            setMintedAmount(Number(quantityMinted))
        }
        catch (error) {
            console.log(error)
        }
    }

    const getQuantity = async () => {
        try {
            if (!isPossibleToReadContract()) {
                throw new Error('Something went wrong while reading the contract.')
            }
            const quantity = await contractNFT.cntSupply()
            setMaxSupply(Number(quantity))
        }
        catch (error) {
            console.log(error)
        }
    }

    // Get info for mint screen

    const getRewards = async () => {
        try {
            if (!isPossibleToReadContract()) {
                throw new Error('Something went wrong while reading the contract.')
            }
            const rewards = await contractNFT.getClaimableAmountSGB(wallet.accounts[0]['address'])
            setRewards(rewards)
        }
        catch (error) {
            console.log(error)
        }
    }

    const getMintPriceSGB = async () => {
        try {
            if (!isPossibleToReadContract()) {
                throw new Error('Something went wrong while reading the contract.')
            }
            await getIsPresale()
            const price = await contractNFT.MINT_PRICE_SGB()
            const finalPrice = (isPresale ? BigInt(price._hex * 0.9) : BigInt(price._hex))
            console.log(finalPrice)
            setMintPriceSGB(finalPrice)
        }
        catch (error) {
            console.log(error)
        }
    }

    const getMintPriceCGLD = async () => {
        try {
            if (!isPossibleToReadContract()) {
                throw new Error('Something went wrong while reading the contract.')
            }
            await getIsPresale()
            const price = await contractNFT.MINT_PRICE_SGB()
            const finalPrice = (isPresale ? BigInt(price._hex * 0.9) : BigInt(price._hex))
            console.log(finalPrice)
            setMintPriceCGLD(finalPrice)
        }
        catch (error) {
            console.log(error)
        }
    }

    const getRemainingTimeSGB = async () => {
        try {
            if (!isPossibleToReadContract()) {
                throw new Error('Something went wrong while reading the contract.')
            }
            const time = await contractNFT.getRemainingTimeSGB(wallet.accounts[0]['address'])
            console.log(Number(time))
            setRemainingTimeToClaim(Number(time))
        }
        catch (error) {
            console.log(error)
        }
    }


    // functions to run

    const claimRewards = async () => {
        try {
            if (!isPossibleToReadContract()) {
                throw new Error('Something went wrong while reading the contract.')
            }
            const tx = await contractNFT.claimRewardsSGB(wallet.accounts[0]['address'])
            setIsClaiming(true)
            toast.info('Claiming rewards...')
            await tx.wait()
            setIsClaiming(false)
            toast.success('Rewards claimed!')
            console.log(tx)
            getContractInfo()

        }
        catch (error) {
            setIsClaiming(false)
            displayError(error)
        }
    }

    const mint = async () => {
        try {
            if (!isPossibleToReadContract()) {
                throw new Error('Something went wrong while reading the contract.')
            }
            console.log(wallet)
            const tx = await contractNFT.mintNFTSGB(mintQuantity, { value: BigInt(Number(mintPriceSGB) * mintQuantity), gasLimit: 8000000 })
            toast.info('Minting NFT...')
            setIsMinting(true)
            await tx.wait()
            toast.success('NFT Minted!')
            setIsMinting(false)
            console.log(tx)
            getContractInfo()
        }
        catch (error) {
            setIsMinting(false)
            displayError(error)
        }
    }





    useEffect(() => {
        if (wallet) {
            getContractNFT()
            getContractCGLD()
        }
    }
        , [wallet])

    useEffect(() => {
        if(wallet)
        {
            console.log('wallet', wallet)   
            getContractInfo()
        }
    }
        , [wallet, contractCGLD, contractNFT])

    const getContractInfo = async () => {
        await getRemainingTimeSGB()
        await getMintStarted()
        await getIsInWhitelist()
        await getIsPresale()
        await getMintedAmount()
        await getQuantity()
        await getRewards()
        await updateMintPrice()
    }

    const updateMintPrice = async () => {
        await getMintPriceSGB()
        await getMintPriceCGLD()
    }

 

    useEffect(() => {
        updateMintPrice()
        console.log("isPresale", isPresale)
    }, [isPresale])







    return (
        <div id='mint' className='screen-wide-container'>
            <div className={(isMinting || isClaiming) ? "wait" : "disabled"}>
                <FontAwesomeIcon icon={faRotate} className="fa-spin" size="5x" />
            </div>
            <div className={(isMinting || isClaiming) ? "gray" : ""}>
                {!wallet && (
                    <div className='connect'>
                        <h1>
                            Songbird Apes
                        </h1>
                        <h3>
                            Simply connect your wallet to get started!
                        </h3>
                        <button className='button' disabled={connecting} onClick={() => (wallet ? disconnect(wallet) : connect())}>
                            {connecting ? 'Connecting' : wallet ? 'Disconnect' : 'Connect'}
                        </button>
                    </div>
                )}
                {wallet && wallet.chains[0]['id'] !== config.CHAIN_ID && (
                    <div className='connect'>
                        <h1>Wrong network</h1>
                        <p>Please switch to the <b>{config.CHAIN_LABEL}</b> network.</p>
                    </div>
                )}
                {wallet && wallet.chains[0]['id'] == config.CHAIN_ID && !mintStarted && (
                    <div className='content'>
                        <h1>Mint hasn't yet started!</h1>
                        <p>Please come back on <b>September 3rd, 2023</b></p>
                    </div>
                )}
                {wallet && wallet.chains[0]['id'] == config.CHAIN_ID && mintStarted && !isInWhitelist && isPresale && (
                    <div className='content'>
                        <h1>You aren't on the whitelist</h1>
                        <p>Please come back on <b>September 3rd, 2023</b></p>
                    </div>
                )}
                {wallet && wallet.chains[0]['id'] == config.CHAIN_ID && mintStarted && (!isPresale || (isPresale && isInWhitelist)) && (
                    <div className='content'>
                        {mintedAmount >= maxSupply && (
                            <div className='item'>
                                <h1>{formatEtherNicely(rewards)}</h1>
                                <h3>Your rewards</h3>
                            </div>
                        ) || (
                                <div className='side-by-side-mini'>
                                    <div className='item'>
                                        <h1>{mintedAmount}/{maxSupply}</h1>
                                        <h3>Minted</h3>
                                    </div>
                                    <div className='item'>
                                        <h1>{formatEtherNicely(rewards)}</h1>
                                        <h3>Your rewards</h3>
                                    </div>
                                </div>
                            )

                        }
                        <hr></hr>
                        {mintedAmount < maxSupply &&
                            <>
                                <h1>{formatEtherNicely(mintPriceSGB) * mintQuantity} SGB + {formatEtherNicely(mintPriceCGLD) * mintQuantity} CGLD</h1>
                                <h3>Cost to mint <b>{mintQuantity}</b> NFT</h3>
                                <hr></hr>
                                {!isPresale && <input className='input' type='number' placeholder='How many nfts would you like to mint?' defaultValue={1} min='1' max={10 - mintedAmount} onChange={(e) => setMintQuantity(e.target.value)} value={mintQuantity} />}
                            </>
                        }
                        <div className='side-by-side-mini'>
                            <button className='button' disabled={connecting} onClick={() => (wallet ? disconnect(wallet) : connect())}>
                                {connecting ? 'Connecting' : wallet ? 'Disconnect' : 'Connect'}
                            </button>
                            {mintedAmount < maxSupply && (<button className='button' disabled={isMinting} onClick={() => mint()} >Mint</button>)}
                            <button className='button' disabled={rewards == 0 || remaingTimeToClaim > 0} onClick={() => claimRewards()}>{remaingTimeToClaim == 0 ? "Claim" : `${formatSeconds(remaingTimeToClaim)}`}</button>
                        </div>



                    </div>
                )}

            </div>
        </div>
    )
}
