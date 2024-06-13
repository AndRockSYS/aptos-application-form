'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

import { PetraWalletName } from 'petra-plugin-wallet-adapter';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

import './home.css';

export default function Home() {
    const { account, connect } = useWallet();

    const navButton = useMemo(() => {
        if (!account)
            return (
                <button id='green-button' onClick={() => connect(PetraWalletName)}>
                    Connect Wallet
                </button>
            );

        const isOwner = account.address.includes(process.env.NEXT_PUBLIC_MODULE_ADDRESS as string);

        return (
            <div>
                <Link id='green-button' href={isOwner ? '/owner-pad' : '/my-application'}>
                    {isOwner ? 'Owner Pad' : 'My Application'}
                </Link>
                <Link id='green-button' href={'/company-form'}>
                    Company Form
                </Link>
            </div>
        );
    }, [account]);

    return (
        <main className='home'>
            <nav>
                <Image src={'/logo.png'} alt='logo' width={1464} height={180}></Image>
                {navButton}
            </nav>
            <div>
                <Image src={'/company-picture.png'} alt='company' width={448} height={508}></Image>
                <h1>TBP WORLD SINGLE MARKET NEUTRAL TRADING PORTAL</h1>
                <h1>TBP TRADE ON-D-GO™</h1>
            </div>
        </main>
    );
}
