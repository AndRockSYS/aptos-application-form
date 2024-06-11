'use client';

import { useEffect, useMemo, useState } from 'react';

import { ApplicationForm, BusinessType } from 'typings';

import './approvement-form.css';

interface Props {
    applicant: string;
    isApproved: boolean;
    form: ApplicationForm;
    reviewApplication: (applicant: string, isApproved: boolean) => Promise<void>;
}

export default function ApprovementForm({ applicant, form, isApproved, reviewApplication }: Props) {
    const closeForm = () => {
        const form = document.querySelector('div.transparent-background') as HTMLElement;
        form.style.display = 'none';
    };

    const buttons = useMemo(
        () =>
            isApproved ? (
                <></>
            ) : (
                <div>
                    <button id='green-button' onClick={() => reviewApplication(applicant, true)}>
                        Approve
                    </button>
                    <button id='red-button' onClick={() => reviewApplication(applicant, false)}>
                        Decline
                    </button>
                </div>
            ),
        [isApproved]
    );

    useEffect(() => {
        if (form.signature) {
            const canvas = document.querySelector(
                'section.approvement-form canvas'
            ) as HTMLCanvasElement;
            const context = canvas.getContext('2d');

            const image = new Image(200);
            image.src = form.signature;
            context?.drawImage(image, 0, 0);
        }
    }, [form]);

    return (
        <div className='transparent-background'>
            <section className='approvement-form'>
                <button id='green-button' onClick={closeForm}>
                    Close
                </button>
                <article className='company'>
                    <h2>Company</h2>
                    <h3>Name: {form.company.name}</h3>
                    <h3>Registration Number: {form.company.registrationNumber}</h3>
                    <h3>Country: {form.company.country}</h3>
                    <h3>Business Type: </h3>
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
                    <canvas></canvas>
                </article>
                {buttons}
            </section>
        </div>
    );
}
