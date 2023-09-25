import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist()

export const pageState = atom({
    key: 'pageState',
    default: 'home',
});

export const popUpState = atom({
    key: 'popUpState',
    default: '',
});

export const isSelectedState = atom({
    key: 'isSelectedState',
    default: false,
    effects_UNSTABLE: [persistAtom],
});

export const idState = atom({
    key: 'idState',
    default: '',
    effects_UNSTABLE: [persistAtom],
});

export const codeState = atom({
    key: 'codeState',
    default: '',
    effects_UNSTABLE: [persistAtom],
});
