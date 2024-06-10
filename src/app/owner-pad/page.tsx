'use client';

import { PetraWalletName } from 'petra-plugin-wallet-adapter';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useMemo, useState } from 'react';

import ApprovementForm from '@/components/ApprovementForm';

import KeyStore from '@/class/KeyStore';

import useData from '@/hooks/useData';
import useAptos from '@/hooks/useAptos';

import { ApplicationForm, AptosApplication } from 'typings';

import './owner-pad.css';

export default function OwnerPad() {
    const { account, connect } = useWallet();
    const { applications, approved, updateApplication, updateApproved, reviewApplication } =
        useAptos();
    const { decodeData } = useData();

    const [isApproved, setIsApproved] = useState(false);
    const [applicant, setApplicant] = useState('');
    const [currForm, setCurrForm] = useState<ApplicationForm>({
        firstName: '',
        lastName: '',
        signature: '',
        email: '',
        phone: '',
        company: {
            name: '',
            registrationNumber: '',
            country: '',
            type: 0,
        },
        address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
        },
    });

    const openForm = async (applicant: string) => {
        const keyStore = new KeyStore();

        const privateKey = await keyStore.getKey(applicant);

        const application = (isApproved ? approved : applications).find((item) => {
            if (item.applicant == applicant) return item;
        });

        if (!application) return;

        const decodedApplication = decodeData(application.hashData, privateKey);

        if (!decodedApplication) return;

        setApplicant(applicant);
        setCurrForm(decodedApplication);

        const form = document.querySelector('div.transparent-background') as HTMLElement;
        form.style.display = 'block';
    };

    const getList = (array: AptosApplication[], isApproved: boolean) =>
        array.map((application) => (
            <div
                key={application.applicant}
                className='application'
                onClick={() => {
                    setIsApproved(isApproved);
                    openForm(application.applicant);
                }}
            >
                <h2>
                    {application.applicant.slice(0, 10) +
                        '...' +
                        application.applicant.slice(56, 66)}
                </h2>
            </div>
        ));

    return (
        <section className='owner-pad'>
            <h1>Approved Applications</h1>
            {useMemo(() => getList(approved, true), [account, approved])}
            <h1>Applications</h1>
            {useMemo(() => getList(applications, false), [account, applications])}
            <button
                id='green-button'
                type='button'
                onClick={() => {
                    if (!account) {
                        'aptos' in window
                            ? connect(PetraWalletName)
                            : window.open('https://petra.app/', `_blank`);
                    } else {
                        updateApplication();
                        updateApproved();
                    }
                }}
            >
                {useMemo(() => (account ? 'Retrieve List' : 'Connect Wallet'), [account])}
            </button>
            {useMemo(
                () => (
                    <ApprovementForm
                        applicant={applicant}
                        isApproved={isApproved}
                        form={currForm}
                        reviewApplication={reviewApplication}
                    />
                ),
                [applicant, currForm, isApproved]
            )}
        </section>
    );
}
