import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuthentication = async () => {
      if (!loading && !currentUser) {
        // user isn't authenticated, redirect to login
        router.push('./login');
      } else {
        setAuthorized(true);
      }
    };
    checkAuthentication();
  }, [currentUser, loading, router]);

  // show a loading indicator while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // if authorized render
  return authorized ? children : null;
}
