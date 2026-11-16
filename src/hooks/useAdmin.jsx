import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../firebase';
import { useAuth } from '../AuthContext';

// Last verified admin status, remembered per browser. It is only a display hint
// (so the header doesn't pop an "Admin" link in and shift the nav on every
// load); access is still decided by the live database check below.
const ADMIN_HINT_KEY = 'canteen:admin-hint';

export const readAdminHint = (uid) => {
  try {
    const hint = JSON.parse(localStorage.getItem(ADMIN_HINT_KEY));
    if (!hint || (uid && hint.uid !== uid)) return false;
    return hint.isAdmin === true;
  } catch {
    return false;
  }
};

const writeAdminHint = (uid, isAdmin) => {
  try {
    localStorage.setItem(ADMIN_HINT_KEY, JSON.stringify({ uid, isAdmin }));
  } catch {
    // Storage unavailable (private mode, blocked): the hint is optional.
  }
};

export const clearAdminHint = () => {
  try {
    localStorage.removeItem(ADMIN_HINT_KEY);
  } catch {
    // Ignore: nothing to clear.
  }
};

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
        if (!isCurrent) return;
        const isAdmin = snapshot.exists();
        writeAdminHint(userId, isAdmin);
        setStatus({ userId, isAdmin });
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
  const loading = Boolean(userId) && !statusMatchesUser;
  return {
    isAdmin: statusMatchesUser && status.isAdmin,
    loading,
    // Verified status once known, otherwise the remembered hint.
    showAdminLink: loading ? readAdminHint(userId) : statusMatchesUser && status.isAdmin,
  };
};

export default useAdmin;
