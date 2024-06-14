import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { InputTransactionData, useWallet } from '@aptos-labs/wallet-adapter-react';
import { useEffect, useState } from 'react';

import Firebase from '@/service/Firebase';

import { AptosApplication } from 'typings';

const useAptos = () => {
    const { account, signAndSubmitTransaction } = useWallet();

    const [applications, setApplications] = useState<AptosApplication[]>([]);
    const [approved, setApproved] = useState<AptosApplication[]>([]);

    const requestApplications = async (method: string): Promise<AptosApplication[]> => {
        const aptosConfig = new AptosConfig({ network: Network.DEVNET });
        const aptos = new Aptos(aptosConfig);

        const [addresses, hashes] = await aptos.view<[string[], string[]]>({
            payload: {
                function: `${
                    process.env.NEXT_PUBLIC_MODULE_ADDRESS as string
                }::application_form::${method}`,
            },
        });

        return addresses.map((address, index) => {
            return { applicant: address, hashData: hashes[index] };
        });
    };

    const updateApplication = () => {
        requestApplications('get_applications').then((data) => setApplications(data));
    };

    const updateApproved = () => {
        requestApplications('get_all_approved').then((data) => setApproved(data));
    };

    const inviteMember = async (member: string) => {
        const transaction: InputTransactionData = {
            data: {
                function: `${
                    process.env.NEXT_PUBLIC_MODULE_ADDRESS as string
                }::application_form::invite_member`,
                functionArguments: [member],
            },
        };
        await signAndSubmitTransaction(transaction).catch((error) =>
            alert(`Error occured - ${error}`)
        );
    };

    const isMemberInvited = async (company: string, member: string): Promise<boolean> => {
        const aptosConfig = new AptosConfig({ network: Network.DEVNET });
        const aptos = new Aptos(aptosConfig);

        const data = await aptos.view<boolean[]>({
            payload: {
                function: `${
                    process.env.NEXT_PUBLIC_MODULE_ADDRESS as string
                }::application_form::is_invited`,
                functionArguments: [company, member],
            },
        });

        return data[0];
    };

    const reviewApplication = async (applicant: string, isApproved: boolean) => {
        const transaction: InputTransactionData = {
            data: {
                function: `${
                    process.env.NEXT_PUBLIC_MODULE_ADDRESS as string
                }::application_form::review_application`,
                functionArguments: [applicant, isApproved],
            },
        };
        await signAndSubmitTransaction(transaction).catch((error) =>
            alert(`Error occured - ${error}`)
        );

        if (!isApproved) {
            const firebase = new Firebase();
            await firebase.initialize();
            firebase.deleteApplicant(applicant);
        }
    };

    useEffect(() => {
        updateApplication();
        updateApproved();
    }, [account]);

    return {
        applications,
        updateApplication,
        approved,
        updateApproved,
        reviewApplication,
        inviteMember,
        isMemberInvited,
    };
};

export default useAptos;
