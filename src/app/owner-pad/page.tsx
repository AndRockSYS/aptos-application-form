'use client';

import { PetraWalletName } from 'petra-plugin-wallet-adapter';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useMemo, useState } from 'react';

import Firebase from '@/service/Firebase';

import ApprovementForm from '@/components/ApprovementForm';

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
    const [currForm, setCurrForm] = useState<ApplicationForm | undefined>();

    const openForm = async (applicant: string, isApproved: boolean) => {
        const firebase = new Firebase();

        const privateKey = await firebase.getApplicant(applicant);

        const application = (isApproved ? approved : applications).find((item) => {
            if (item.applicant == applicant) return item;
        });

        if (!application) return;

        const decodedApplication = decodeData(application.hashData, privateKey);

        if (!decodedApplication) return;

        setIsApproved(isApproved);
        setApplicant(applicant);
        setCurrForm(decodedApplication);

        const form = document.querySelector('div.transparent-background') as HTMLElement;
        form.style.display = 'block';
    };

    const getList = (array: AptosApplication[], isApproved: boolean) => {
        if (
            !account ||
            !account?.address?.includes(process.env.NEXT_PUBLIC_MODULE_ADDRESS as string)
        )
            return;

        return array.map((application) => (
            <div
                id='white-button'
                key={application.applicant}
                className='application'
                onClick={() => {
                    openForm(application.applicant, isApproved);
                }}
            >
                <h2>
                    {application.applicant.slice(0, 10) +
                        '...' +
                        application.applicant.slice(56, 66)}
                </h2>
            </div>
        ));
    };
    return (
        <section className='owner-pad'>
            <h1>Approved Applications</h1>
            {useMemo(() => getList(approved, true), [account, approved])}
            <h1>Applications</h1>
            {useMemo(() => getList(applications, false), [account, applications])}
            <button
                id='green-button'
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
                {useMemo(() => (account ? 'Update List' : 'Connect Wallet'), [account])}
            </button>

            <ApprovementForm
                applicant={applicant}
                isApproved={isApproved}
                form={currForm}
                reviewApplication={reviewApplication}
            />
        </section>
    );
}
