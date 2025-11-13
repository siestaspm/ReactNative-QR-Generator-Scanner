import {MMKV} from 'react-native-mmkv';
import CryptoJS from 'crypto-js';
export const QR_DATA = new MMKV();
export const USER_DATA = new MMKV();
export const ENCRYPTION_PASSCODE = '@D4t4dyn4m1xIT';

export const decryptData = async data => {
  try {
    const deCoded = CryptoJS.AES.decrypt(data, ENCRYPTION_PASSCODE);
    const passwordDetails = deCoded.toString(CryptoJS.enc.Utf8);

    if (passwordDetails) {
      return passwordDetails;
    } else {
      return 'Failed';
    }
  } catch (error) {
    return 'Failed';
  }
};
