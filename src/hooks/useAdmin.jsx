import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../firebase';
import { useAuth } from '../AuthContext';

const useAdmin = () => {
  const [status, setStatus] = useState({ userId: null, isAdmin: false });
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  useEffect(() => {
    let isCurrent = true;

    if (!userId) return () => {
      isCurrent = false;
    };

    const adminRef = ref(database, `admins/${userId}`);
    get(adminRef)
      .then((snapshot) => {
        if (isCurrent) setStatus({ userId, isAdmin: snapshot.exists() });
      })
      .catch((error) => {
        console.error("Error checking admin status:", error);
        if (isCurrent) setStatus({ userId, isAdmin: false });
      });

    return () => {
      isCurrent = false;
    };
  }, [userId]);

  const statusMatchesUser = status.userId === userId;
  return {
    isAdmin: statusMatchesUser && status.isAdmin,
    loading: Boolean(userId) && !statusMatchesUser,
  };
};

export default useAdmin;
