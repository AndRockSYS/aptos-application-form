'use client';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useMemo } from 'react';
import Image from 'next/image';

import { ApplicationForm, BusinessType } from 'typings';

import './approvement-form.css';

interface Props {
    applicant: string | undefined;
    isApproved?: boolean;
    form: ApplicationForm | undefined;
    reviewApplication?: (applicant: string, isApproved: boolean) => Promise<void>;
}

export default function ApprovementForm({ applicant, form, isApproved, reviewApplication }: Props) {
    const { account } = useWallet();

    if (!form)
        form = {
            firstName: 'Null',
            lastName: 'Null',
            signature: '',
            email: 'Null',
            phone: 'Null',
            company: {
                logo: '',
                name: 'Null',
                registrationNumber: 'Null',
                country: 'Null',
                type: 0,
            },
            address: {
                street: 'Null',
                city: 'Null',
                state: 'Null',
                postalCode: 'Null',
            },
        };

    const closeForm = () => {
        const form = document.querySelector('div.transparent-background') as HTMLElement;
        form.style.display = 'none';
    };

    const buttons = useMemo(() => {
        if (isApproved) return <></>;

        if (
            reviewApplication &&
            applicant &&
            account?.address?.includes(process.env.NEXT_PUBLIC_MODULE_ADDRESS as string)
        )
            return (
                <div>
                    <button id='green-button' onClick={() => reviewApplication(applicant, true)}>
                        Approve
                    </button>
                    <button id='red-button' onClick={() => reviewApplication(applicant, false)}>
                        Decline
                    </button>
                </div>
            );
    }, [isApproved, applicant, reviewApplication]);

    return (
        <div className='transparent-background'>
            <section className='approvement-form'>
                <button id='green-button' onClick={closeForm}>
                    Close
                </button>
                <article className='company'>
                    {useMemo(
                        () => (
                            <Image
                                className='logo'
                                src={`data:image/png;base64,${form.company.logo}`}
                                alt='logo'
                                width={50}
                                height={50}
                            ></Image>
                        ),
                        [form]
                    )}
                    <h2>Company</h2>
                    <h3>Name: {form.company.name}</h3>
                    <h3>Registration Number: {form.company.registrationNumber}</h3>
                    <h3>Country: {form.company.country}</h3>
                    <h3>
                        Business Type:{' '}
                        {form.company.type == BusinessType.Services ? 'Services' : 'Trade'}
                    </h3>
                </article>
                <article className='address'>
                    <h2>Business Address</h2>
                    <h3>Street Address: {form.address.street}</h3>
                    <h3>
                        Street Address Line 2:{' '}
                        {form.address.street2 ? form.address.street2 : 'None'}
                    </h3>
                    <h3>City: {form.address.city}</h3>
                    <h3>State / Province: {form.address.state}</h3>
                    <h3>Postal / Zip Code: {form.address.postalCode}</h3>
                </article>
                <article className='contact'>
                    <h2>Contact Information</h2>
                    <h3>Email: {form.email}</h3>
                    <h3>Phone Number: {form.phone}</h3>
                </article>
                <article>
                    <h2>Authorised Personnel</h2>
                    <h3>First Name: {form.firstName}</h3>
                    <h3>Last Name: {form.lastName}</h3>
                    {useMemo(
                        () => (
                            <Image
                                className='signature'
                                src={form.signature}
                                alt='signature'
                                width={250}
                                height={150}
                            ></Image>
                        ),
                        [form]
                    )}
                </article>
                {buttons}
            </section>
        </div>
    );
}
