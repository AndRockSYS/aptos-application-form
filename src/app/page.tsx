import Image from 'next/image';

import './home.css';

export default function Home() {
    const getInput = (name: string, label: string, type?: string): JSX.Element => (
        <div id='input'>
            <label htmlFor={name}>{label}</label>
            <input type={type ? type : 'text'} name={name} />
        </div>
    );

    const r = <span id='red'>*</span>;

    return (
        <section className='application'>
            <form action='submit'>
                <Image src={'/logo.png'} alt='logo' width={160} height={40}></Image>
                <h1>TBP WORLD NEUTRAL SINGLE MARKET SOVEREIGN TRADING COMPANY</h1>
                <h1>APPLICATION FORM</h1>
                <div className='company'>
                    <h2>Company Info {r}</h2>
                    {getInput('company', 'Company Name')}
                    {getInput('registration-number', 'Company Registration Number')}
                    {getInput('country', 'Country of Registration')}
                    <div id='input'>
                        <label htmlFor='business-type'>Type of Business</label>
                        <select name='business-type'>
                            <option value='Trade'>Trade</option>
                            <option value='Services'>Services</option>
                        </select>
                    </div>
                </div>
                <div className='address'>
                    <h2>Business Address {r}</h2>
                    {getInput('street-address', 'Street Address')}
                    {getInput('street-address-2', 'Street Address Line 2')}
                    {getInput('city', 'City')}
                    {getInput('state', 'State / Province')}
                    {getInput('postal-code', 'Postal / Zip Code')}
                </div>
                <div className='contact'>
                    <h2>Contact Information {r}</h2>
                    {getInput('email', 'Email', 'email')}
                    {getInput('phone-number', 'Phone Number', 'tel')}
                </div>
                <article>
                    <h2>Agreed Terms</h2>
                    <p>
                        This Sovereign Trading Company agrees to the following: - Operate or trade
                        ad hoc within the corridors and the hubs of the TBP world neutral single
                        market to access TBP trade neutrality provision, which includes free trading
                        that is independent of any country/region/bloc trading policies and
                        barriers. It is also neutral to any sovereign state's recognition or trade
                        disputes. Must meet the host country's immigration requirement for the
                        admission of its personnel into the countries hosting the TBP corridors and
                        its hubs by the host country's immigration agency. Shall not be involved in
                        the trading, storage and supply chain of humans in the form of trafficking
                        or slavery. Shall not be involved in the trading, storage and supply chain
                        of endangered/banned animal and plant species. Shall not be involved in the
                        trading, processing, manufacturing, storage and supply chain of ammunition.
                        Shall not be involved in the trading, processing, manufacturing, storage and
                        supply chain of narcotic drugs and psychotropic substances. Shall not be
                        involved in the trading, processing, manufacturing, storage and supply chain
                        of goods that violate intellectual property that has been registered with
                        any sovereign state through the World Intellectual Property Organisation.
                        (WIPO) Shall not be involved in the trading, processing, manufacturing,
                        storage and supply chain of counterfeit goods.
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
                    {getInput('first-name', 'First Name')}
                    {getInput('last-name', 'Last Name')}
                </div>
                <div className='signature'>
                    <h2>Authorised Signature on behalf of the company {r}</h2>
                    <canvas></canvas>
                </div>
                <button>Continue</button>
            </form>
        </section>
    );
}
