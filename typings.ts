export enum BusinessType {
    Trade,
    Services,
}

export interface Company {
    logo: string;
    name: string;
    registrationNumber: string;
    country: string;
    type: BusinessType;
}

export interface Address {
    street: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
}

export interface ApplicationForm {
    firstName: string;
    lastName: string;
    signature: string;
    email: string;
    phone: string;
    company: Company;
    address: Address;
}

export interface AptosApplication {
    applicant: string;
    hashData: string;
}
