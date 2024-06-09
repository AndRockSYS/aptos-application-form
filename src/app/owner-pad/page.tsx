'use client';

import { PetraWalletName } from 'petra-plugin-wallet-adapter';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useMemo } from 'react';

import useAptos from '@/hooks/useAptos';
import Application from '@/components/Application';

export default function OwnerPad() {
    const { account, connect } = useWallet();
    const { applications, updateApplication } = useAptos();

    const buttonMessage = useMemo(() => (account ? 'Retrieve List' : 'Connect Wallet'), [account]);

    const list = useMemo(
        () => applications.map((application) => <Application application={application} />),
        [applications, account]
    );

    return (
        <section className='owner-pad'>
            {list}
            <button
                type='button'
                onClick={() => {
                    if (!account) {
                        if ('aptos' in window) connect(PetraWalletName);
                        else window.open('https://petra.app/', `_blank`);
                    } else {
                        updateApplication();
                    }
                }}
            >
                {buttonMessage}
            </button>
        </section>
    );
}
