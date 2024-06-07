import Image from 'next/image';

import './home.css';

export default function Home() {
    const getInput = (name: string, label: string): JSX.Element => (
        <div>
            <label htmlFor={name}>{label}</label>
            <input type='text' name={name} />
        </div>
    );

    return (
        <section className='application'>
            <form action='submit'>
                <div className='company'>
                    <div>
                        {getInput('company', 'Company Name')}
                        {getInput('registration-number', 'Company Registration Number')}
                    </div>
                    {getInput('country', 'Country of Registration')}
                </div>
            </form>
        </section>
    );
}
