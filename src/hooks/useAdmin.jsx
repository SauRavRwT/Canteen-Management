import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../firebase';
import { useAuth } from '../AuthContext';

const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (currentUser) {
        const adminRef = ref(database, `admins/${currentUser.uid}`);
        try {
          const snapshot = await get(adminRef);
          setIsAdmin(snapshot.exists());
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [currentUser]);

  return isAdmin;
};

export default useAdmin;
