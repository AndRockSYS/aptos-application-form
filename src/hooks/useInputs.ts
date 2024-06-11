import ReactSignatureCanvas from 'react-signature-canvas';

const useInputs = () => {
    const handleInputError = (sectionName: string) => {
        const inputs = document.querySelectorAll(
            `${sectionName} input`
        ) as NodeListOf<HTMLInputElement>;

        let amount = 0;

        inputs.forEach((input) => {
            if (input.value == '' && input.name != 'street-address-2') amount++;

            input.style.borderColor =
                input.value != '' || input.name == 'street-address-2'
                    ? 'var(--passive)'
                    : 'var(--error)';
        });

        const error = document.querySelector(`${sectionName} div.error`) as HTMLElement;

        error.style.display = amount > 0 ? 'block' : 'none';
    };

    const handleSignatureError = (sigCanvas: ReactSignatureCanvas | null, toClear: boolean) => {
        if (sigCanvas != null && toClear) sigCanvas.clear();

        const error = document.querySelector(`div.signature div.error`) as HTMLElement;
        error.style.display = toClear ? 'block' : 'none';
        const canvas = document.querySelector(`div.signature canvas`) as HTMLElement;
        canvas.style.borderColor = toClear ? 'var(--error)' : 'var(--passive)';
    };

    return { handleInputError, handleSignatureError };
};

export default useInputs;
