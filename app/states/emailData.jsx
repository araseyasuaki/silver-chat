import { atom, selector } from 'recoil';

export const emailData = atom({
  key: 'emailData',
  default: '',
});

export const emailDataValue = selector({
  key: 'emailDataValue',
  get: ({ get }) => {
    const email = get(emailData);
    return email || '';
  },
});

export const chatRoomKey = atom({
  key: 'arase',
  default: '',
})

export const chatRoomKeyValue = atom({
  key: 'araseValue',
  get: ({ get }) => {
    const arasedata = get(chatRoomKey);
    return arasedata || '';
  },
})