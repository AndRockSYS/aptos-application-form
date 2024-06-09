import { AptosApplication } from 'typings';

interface Props {
    application: AptosApplication;
}

export default function Application({ application }: Props) {
    return (
        <div className='application'>
            <h1>{application.applicant}</h1>
            <button>Open</button>
        </div>
    );
}
