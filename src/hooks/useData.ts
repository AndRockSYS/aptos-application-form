import CryptoJS from 'crypto-js';

import { InputTransactionData, useWallet } from '@aptos-labs/wallet-adapter-react';

import { ApplicationForm, BusinessType } from 'typings';
import KeyStore from '@/class/KeyStore';

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

    const collectData = (signatureData: string): ApplicationForm => {
        const inputs = document.querySelectorAll(
            'section.application > form input, section.application > form select'
        ) as NodeListOf<HTMLInputElement>;

        return {
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
            signature: signatureData,
        };
    };

    const sendForm = (signatureData: string) => {
        console.log(signatureData);
        if (!account) return;

        const application = collectData(signatureData);

        hashData(application).then(async ([data, privateKey]) => {
            const keyStore = new KeyStore();

            await keyStore.addKey(account.address, privateKey).catch((error) => {
                alert(`Error - ${error}`);
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

            await signAndSubmitTransaction(transaction).catch((error) =>
                alert(`Error occured - ${error}`)
            );
        });
    };

    const hashData = async (form: ApplicationForm): Promise<string[]> => {
        if (!account) return [];

        const signedMessage = await signMessage({
            message: 'Application Form on Aptos',
            nonce: '0',
        });

        const seed = (signedMessage.signature as string) + Date.now();

        const privateKey = CryptoJS.SHA256(seed).toString();
        const hashed = CryptoJS.AES.encrypt(JSON.stringify(form), privateKey).toString();

        return [hashed, privateKey];
    };

    const decodeData = (
        data: string | undefined,
        privateKey: string
    ): ApplicationForm | undefined => {
        if (!data) return;

        const json = CryptoJS.AES.decrypt(data, privateKey).toString(CryptoJS.enc.Utf8);

        console.log({ json });

        return JSON.parse(json);
    };

    return { isFulfilled, sendForm, decodeData };
};

export default useData;
