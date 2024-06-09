import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useEffect, useState } from 'react';

import { AptosApplication } from 'typings';

const useAptos = () => {
    const { account } = useWallet();

    const [applications, setApplications] = useState<AptosApplication[]>([]);

    const updateApplication = () => {
        const aptosConfig = new AptosConfig({ network: Network.DEVNET });
        const aptos = new Aptos(aptosConfig);

        aptos
            .view<[string[], string[]]>({
                payload: {
                    function: `${
                        process.env.NEXT_PUBLIC_MODULE_ADDRESS as string
                    }::application_form::get_applications`,
                },
            })
            .then(([addresses, hashes]) => {
                const temp: AptosApplication[] = [];

                addresses.forEach((address, index) => {
                    temp.push({ applicant: address, hashData: hashes[index] });
                });

                setApplications(applications);
            });
    };

    useEffect(() => {
        updateApplication();
    }, [account]);

    return { applications, updateApplication };
};

export default useAptos;
