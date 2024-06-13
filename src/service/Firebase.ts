import { initializeApp } from 'firebase/app';
import { child, get, getDatabase, ref, remove, update } from 'firebase/database';
import { Member } from 'typings';

const firebaseConfig = {
    apiKey: 'AIzaSyDGLuNUvgTThjkzcfifZCQitOkFF2ntd0Q',
    authDomain: 'aptos-form.firebaseapp.com',
    databaseURL: 'https://aptos-form-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'aptos-form',
    storageBucket: 'aptos-form.appspot.com',
    messagingSenderId: '374668925377',
    appId: '1:374668925377:web:4a5d270b394abb4c04f740',
    measurementId: 'G-SMCSYR52SE',
};

export default class KeyStore {
    private app = initializeApp(firebaseConfig);
    private db = getDatabase(this.app);

    async getApplicant(applicant: string): Promise<string> {
        const snapshot = await get(child(ref(this.db), `applicant/${applicant}`));
        return snapshot.exists() ? snapshot.val() : '';
    }

    async addApplicant(applicant: string, key: string) {
        const updates: any = {};
        updates[`/${applicant}`] = key;
        await update(ref(this.db, `applicant`), updates);
    }

    async deleteApplicant(applicant: string) {
        await remove(ref(this.db, `applicant/${applicant}`));
    }

    async addMember(company: string, member: string, data: Member) {
        const updates: any = {};
        updates[`/${member}`] = data;
        await update(ref(this.db, `company/${company}`), updates);
    }
}
