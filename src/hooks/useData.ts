import { useState } from 'react';

import { ApplicationForm, BusinessType } from 'typings';

const useData = () => {
    const [form, setForm] = useState<ApplicationForm | undefined>();

    const collectData = (): boolean => {
        const inputs = document.querySelectorAll(
            'section.application > form input, section.application > form select'
        ) as NodeListOf<HTMLInputElement>;

        for (let i = 0; i < inputs.length; i++) {
            if (!inputs[i].value) {
                inputs[i].scrollIntoView();
                return false;
            }
        }

        setForm({
            company: {
                name: inputs[0].value,
                registrationNumber: inputs[1].value,
                country: inputs[2].value,
                type: inputs[3].value == 'Trade' ? BusinessType.Trade : BusinessType.Services,
            },
            address: {
                street: inputs[4].value,
                street2: inputs[5].value,
                city: inputs[6].value,
                state: inputs[7].value,
                postalCode: inputs[8].value,
            },
            email: inputs[9].value,
            phone: inputs[10].value,
            firstName: inputs[11].value,
            lastName: inputs[12].value,
        });

        const signature = document.querySelector('canvas');

        return true;
    };

    return { form, collectData };
};

export default useData;
