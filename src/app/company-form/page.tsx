'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import SignatureCanvas from 'react-signature-canvas';
import ReactSignatureCanvas from 'react-signature-canvas';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { PetraWalletName } from 'petra-plugin-wallet-adapter';

import useInputs from '@/hooks/useInputs';
import useData from '@/hooks/useData';

import './form.css';

export default function Home() {
    const { account, connect } = useWallet();

    const { handleInputError, handleSignatureError } = useInputs();
    const { isFulfilled, sendForm } = useData();

    const [sigCanvas, setSigCanvas] = useState<ReactSignatureCanvas | null>(null);
    const [buttonMessage, setButtonMessage] = useState('Sign Up');

    useEffect(() => {
        setButtonMessage(account ? 'Sign and Send Application' : 'Sign Up');
    }, [account]);

    const getInput = (
        className: string,
        name: string,
        label: string,
        type?: string
    ): JSX.Element => (
        <div id='input'>
            <label htmlFor={name}>{label}</label>
            <input
                onBlur={() => handleInputError(`div.${className}`)}
                type={type ? type : 'text'}
                name={name}
            />
        </div>
    );

    const r = <span id='red'>*</span>;

    const requiredField = (
        <div className='error'>
            <Image src={'/warning.png'} alt='warning' width={32} height={32}></Image>
            <h3>This field is required</h3>
        </div>
    );

    return (
        <section className='application'>
            <script
                async
                src='https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'
            ></script>

            <form action='submit'>
                <section className='company-info'>
                    <Image src={'/logo.png'} alt='logo' width={1464} height={180}></Image>
                    <h1>Next Generation Global Trade Ecosystem</h1>

                    <h1>
                        TBP WORLD NEUTRAL SINGLE MARKET SOVEREIGN TRADING COMPANY SIGN ON BLOCKCHAIN
                        SMART CONTRACT FORM
                    </h1>
                    <h3>
                        UPON SIGNING-ON, A UNIQUE TBP BLOCKCHAIN WALLET WOULD BE ASSIGNED BECOMING
                        YOUR COMPANY PASSPORT TO OPERATE WITHIN THE TBP WORLD NEUTRAL SINGLE MARKET
                        TRADE CORRIDOR, ALL YOUR COMPANY TRANSACTIONS WOULD BE RECORDED IN YOUR
                        WALLET
                    </h3>
                </section>

                <div className='company'>
                    <h2>Company Info {r}</h2>
                    {getInput('company', 'company', 'Company Name')}
                    {getInput('company', 'registration-number', 'Company Registration Number')}
                    {getInput('company', 'country', 'Country of Registration')}
                    <div id='input'>
                        <label htmlFor='business-type'>Type of Business</label>
                        <select name='business-type'>
                            <option value='Trade'>Trade</option>
                            <option value='Services'>Services</option>
                        </select>
                    </div>
                    <div id='input'>
                        <label htmlFor='company-logo'>Company Logo (Max 5kB)</label>
                        <input
                            type='file'
                            name='company-logo'
                            accept='image/png, image/jpg, image/jpeg'
                            onBlur={() => handleInputError(`div.company`)}
                        />
                    </div>
                    {requiredField}
                </div>
                <div className='address'>
                    <h2>Business Address {r}</h2>
                    {getInput('address', 'street-address', 'Street Address')}
                    {getInput('address', 'street-address-2', 'Street Address Line 2')}
                    {getInput('address', 'city', 'City')}
                    {getInput('address', 'state', 'State / Province')}
                    {getInput('address', 'postal-code', 'Postal / Zip Code')}
                    {requiredField}
                </div>
                <div className='contact'>
                    <h2>Contact Information {r}</h2>
                    {getInput('contact', 'email', 'Email', 'email')}
                    {getInput('contact', 'phone-number', 'Phone Number', 'tel')}
                    {requiredField}
                </div>
                <article>
                    <h2>Agreed Terms</h2>
                    <p>
                        This Sovereign Trading Company agrees to the following: - Operate or trade
                        ad hoc within the corridors and the hubs of the TBP world neutral single
                        market to access TBP trade neutrality provision, which includes free trading
                        that is independent of any country/region/bloc trading policies and
                        barriers. It is also neutral to any sovereign state&apos;s recognition or
                        trade disputes. Must meet the host country&apos;s immigration requirement
                        for the admission of its personnel into the countries hosting the TBP
                        corridors and its hubs by the host country&apos;s immigration agency. Shall
                        not be involved in the trading, storage and supply chain of humans in the
                        form of trafficking or slavery. Shall not be involved in the trading,
                        storage and supply chain of endangered/banned animal and plant species.
                        Shall not be involved in the trading, processing, manufacturing, storage and
                        supply chain of ammunition. Shall not be involved in the trading,
                        processing, manufacturing, storage and supply chain of narcotic drugs and
                        psychotropic substances. Shall not be involved in the trading, processing,
                        manufacturing, storage and supply chain of goods that violate intellectual
                        property that has been registered with any sovereign state through the World
                        Intellectual Property Organisation. (WIPO) Shall not be involved in the
                        trading, processing, manufacturing, storage and supply chain of counterfeit
                        goods.
                        <br /> <br />
                        All the company data submitted shall be uploaded onto the TBP Encrypted
                        Blockchain Network and accessed by relevant vested stakeholders, including
                        Government Agencies of Sovereign States hosting a TBP Neutral Corridor,
                        Anti-money Laundering Agencies, Trade Finance Corporations, and potential
                        Business Partners.
                        <br /> <br />
                        The company registration and details shall be searched and verified by the
                        registered Sovereign State. This will incur an administrative charge.
                    </p>
                </article>
                <div className='person'>
                    <h2>Authorised Personnel on behalf of the Company {r}</h2>
                    {getInput('person', 'first-name', 'First Name')}
                    {getInput('person', 'last-name', 'Last Name')}
                    {requiredField}
                </div>
                <div className='signature'>
                    <h2>Authorised Signature on behalf of the company {r}</h2>
                    <SignatureCanvas
                        onBegin={() => handleSignatureError(sigCanvas, false)}
                        ref={(ref) => setSigCanvas(ref)}
                    />
                    <button type='button' onClick={() => handleSignatureError(sigCanvas, true)}>
                        Clear
                    </button>
                    {requiredField}
                </div>
                <button
                    id='green-button'
                    type='button'
                    onClick={() => {
                        if (!account) {
                            if ('aptos' in window) connect(PetraWalletName);
                            else {
                                alert('You need to install Petra Wallet to continue');
                                window.open('https://petra.app/', `_blank`);
                            }
                            return;
                        } else if (isFulfilled() && sigCanvas) sendForm(sigCanvas.toDataURL());
                    }}
                >
                    {buttonMessage}
                </button>
            </form>
        </section>
    );
}
