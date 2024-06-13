'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { PetraWalletName } from 'petra-plugin-wallet-adapter';

import Firebase from '@/service/Firebase';

import useInputs from '@/hooks/useInputs';
import useData from '@/hooks/useData';
import useAptos from '@/hooks/useAptos';

import './form.css';

export default function Home() {
    const { account, connect } = useWallet();
    const { isMemberInvited } = useAptos();

    const { handleInputError } = useInputs();
    const { isFulfilled, sendForm } = useData();

    const [buttonMessage, setButtonMessage] = useState('Connect Petra Wallet');

    useEffect(() => {
        setButtonMessage(account ? 'Sign and Send Application' : 'Connect Petra Wallet');
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

    const addNewMember = () => {
        if (!account?.address) return;

        const inputs = document.querySelectorAll(
            'section.application > form input, section.application > form select'
        ) as NodeListOf<HTMLInputElement>;

        const firebase = new Firebase();

        isMemberInvited(inputs[0].value, account.address).then(async (isInvited) => {
            if (!isInvited) {
                alert('You was not invited!');
                return;
            }

            await firebase
                .addMember(inputs[0].value, account.address, {
                    address: inputs[1].value,
                    address2: inputs[2].value,
                    city: inputs[3].value,
                    state: inputs[4].value,
                    name: inputs[5].value,
                    surname: inputs[6].value,
                    position: inputs[7].value,
                })
                .catch((error) => {
                    alert(`Error - ${error}`);
                    return;
                });

            alert('Data was saved!');
        });
    };

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
                    {getInput('company', 'company-address', 'Company Aptos Address')}
                    {requiredField}
                </div>
                <div className='address'>
                    <h2>Personal Address {r}</h2>
                    {getInput('address', 'street-address', 'Street Address')}
                    {getInput('address', 'street-address-2', 'Street Address Line 2')}
                    {getInput('address', 'city', 'City')}
                    {getInput('address', 'state', 'State / Province')}
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
                    {getInput('person', 'position', 'Your Position')}
                    {requiredField}
                </div>
                <button
                    id='green-button'
                    type='button'
                    onClick={() => {
                        if (!account) {
                            if ('aptos' in window) connect(PetraWalletName);
                            else window.open('https://petra.app/', `_blank`);
                            return;
                        } else if (isFulfilled()) addNewMember();
                    }}
                >
                    {buttonMessage}
                </button>
            </form>
        </section>
    );
}
