import { getFunctions, httpsCallable } from 'firebase/functions';

export const verifyAdminStatus = async () => {
  try {
    const functions = getFunctions();
    const checkAdmin = httpsCallable(functions, 'isUserAdmin');
    const result = await checkAdmin();
    return result.data.isAdmin;
  } catch (error) {
    console.error('Admin verification error:', error);
    return false;
  }
};
