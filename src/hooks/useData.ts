import CryptoJS from 'crypto-js';
import { InputTransactionData, useWallet } from '@aptos-labs/wallet-adapter-react';

import Firebase from '@/service/Firebase';

import { ApplicationForm, BusinessType } from 'typings';

const useData = () => {
    const { account, signMessage, signAndSubmitTransaction } = useWallet();

    const isFulfilled = (): boolean => {
        const inputs = document.querySelectorAll(
            'section.application > form input, section.application > form select'
        ) as NodeListOf<HTMLInputElement>;

        for (let i = 0; i < inputs.length; i++) {
            if (!inputs[i].value && inputs[i].name != 'street-address-2') {
                inputs[i].scrollIntoView();
                return false;
            }
        }

        return true;
    };

    const collectData = async (signatureData: string): Promise<ApplicationForm | undefined> => {
        const inputs = document.querySelectorAll(
            'section.application > form input, section.application > form select'
        ) as NodeListOf<HTMLInputElement>;

        const imageInput = inputs[4].files?.item(0);

        if (imageInput && imageInput.size > 5000) {
            alert('The logo is too big, max is 5kB');
            return undefined;
        }

        const image = await inputs[4].files?.item(0)?.arrayBuffer();
        if (!image) return undefined;

        const buffer = Buffer.from(image);

        return {
            company: {
                logo: buffer.toString('base64'),
                name: inputs[0].value,
                registrationNumber: inputs[1].value,
                country: inputs[2].value,
                type: inputs[3].value == 'Trade' ? BusinessType.Trade : BusinessType.Services,
            },
            address: {
                street: inputs[5].value,
                street2: inputs[6].value,
                city: inputs[7].value,
                state: inputs[8].value,
                postalCode: inputs[9].value,
            },
            email: inputs[10].value,
            phone: inputs[11].value,
            firstName: inputs[12].value,
            lastName: inputs[13].value,
            signature: signatureData,
        };
    };

    const sendForm = async (signatureData: string) => {
        if (!account) return;

        const application = await collectData(signatureData);

        if (!application) {
            alert(`Could not get applicaton data`);
            return;
        }

        const [data, privateKey] = await hashData(application);

        const firebase = new Firebase();
        await firebase.initialize();

        await firebase.addApplicant(account.address, privateKey).catch((error) => {
            alert(error);
            return;
        });

        const transaction: InputTransactionData = {
            data: {
                function: `${
                    process.env.NEXT_PUBLIC_MODULE_ADDRESS as string
                }::application_form::add_application`,
                functionArguments: [data],
            },
        };

        await signAndSubmitTransaction(transaction)
            .then(() => alert('Form was successfully submitted'))
            .catch((error) => alert(`Error occured - ${error}`));
    };

    const hashData = async (form: ApplicationForm): Promise<string[]> => {
        if (!account) return [];

        const signedMessage = await signMessage({
            message: 'Application Form on Aptos',
            nonce: '0',
        });

        const seed = (signedMessage.signature as string) + Date.now();

        const privateKey = CryptoJS.SHA256(seed).toString();
        const hashed = CryptoJS.AES.encrypt(JSON.stringify({ form }), privateKey).toString();

        return [hashed, privateKey];
    };

    const decodeData = (
        data: string | undefined,
        privateKey: string
    ): ApplicationForm | undefined => {
        if (!data) return;

        const stringData = CryptoJS.AES.decrypt(data, privateKey).toString(CryptoJS.enc.Utf8);

        const json = JSON.parse(stringData);

        return json.form;
    };

    return { isFulfilled, sendForm, decodeData };
};

export default useData;
