'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

import { PetraWalletName } from 'petra-plugin-wallet-adapter';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

import './home.css';

export default function Home() {
    const { account, connect } = useWallet();

    const walletButton = useMemo(
        () =>
            account
                ? account.address.slice(0, 4) + '...' + account.address.slice(62, 66)
                : 'Connect Passport',
        [account]
    );

    const navButtons = useMemo(() => {
        const isOwner = account?.address.includes(process.env.NEXT_PUBLIC_MODULE_ADDRESS as string);

        return (
            <>
                <Link id='green-button' href={isOwner ? '/owner-pad' : '/my-application'}>
                    {isOwner ? 'Owner Pad' : 'My Application'}
                </Link>
                <Link id='green-button' href={'/company-form'}>
                    For Company
                </Link>
                <Link id='green-button' href={'/member-form'}>
                    For Member
                </Link>
                <button
                    id='green-button'
                    onClick={() => {
                        if (!account) {
                            if ('aptos' in window) connect(PetraWalletName);
                            else window.open('https://petra.app/', `_blank`);
                        }
                    }}
                >
                    {walletButton}
                </button>
            </>
        );
    }, [account]);

    return (
        <main className='home'>
            <nav>
                <div className='logo'>
                    <Image src={'/logo.png'} alt='logo' width={1464} height={180}></Image>
                    <h1>Next Generation Global Trade Ecosystem</h1>
                </div>
                {navButtons}
            </nav>
            <div>
                <Image src={'/company-picture.png'} alt='company' width={448} height={508}></Image>
                <h1>TBP WORLD SINGLE MARKET NEUTRAL TRADING PORTAL</h1>
                <h1>TBP TRADE ON-D-GO™</h1>
            </div>
        </main>
    );
}
