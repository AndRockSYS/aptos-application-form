'use client';

import { useEffect, useMemo, useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { PetraWalletName } from 'petra-plugin-wallet-adapter';

import Firebase from '@/service/Firebase';

import ApprovementForm from '@/components/ApprovementForm';

import useAptos from '@/hooks/useAptos';
import useData from '@/hooks/useData';

import { ApplicationForm, AptosApplication } from 'typings';

import './my-application.css';

export default function ApplicationStatus() {
    const { account, connect } = useWallet();
    const { applications, approved } = useAptos();
    const { decodeData } = useData();

    const [form, setForm] = useState<ApplicationForm | undefined>();
    const [isApproved, setIsApproved] = useState(false);

    useEffect(() => {
        if (!account?.address) return;

        const firebase = new Firebase();

        firebase.getApplicant(account.address).then((privateKey) => {
            if (!privateKey) return;

            const inApproved = approved.find((item) => {
                if (item.applicant == account.address) return item;
            });

            setIsApproved(inApproved != undefined);

            const application = inApproved
                ? inApproved
                : applications.find((item) => {
                      if (item.applicant == account.address) return item;
                  });

            console.log(application);

            if (!application) return;

            const decodedApplication = decodeData(
                (application as AptosApplication).hashData,
                privateKey
            );

            if (!decodedApplication) return;

            setForm(decodedApplication);
        });
    }, [account, approved, applications]);

    const updateList = () => {
        if (!account) connect(PetraWalletName);
    };

    const openForm = async () => {
        const form = document.querySelector('div.transparent-background') as HTMLElement;
        form.style.display = 'block';
    };

    return (
        <section className='my-application'>
            <h1>My Application</h1>
            {useMemo(
                () =>
                    form ? (
                        <>
                            <button id='white-button' onClick={openForm}>
                                Open Application
                            </button>
                            {isApproved ? (
                                <h2>Your application was approved</h2>
                            ) : (
                                <h2>The application is under consideration</h2>
                            )}
                        </>
                    ) : (
                        <h2>
                            You currently don't have any applications or your application was
                            declined
                        </h2>
                    ),
                [account, form, isApproved]
            )}
            <button id='green-button' onClick={updateList}>
                Update List
            </button>
            <ApprovementForm applicant={account?.address} form={form} />
        </section>
    );
}
