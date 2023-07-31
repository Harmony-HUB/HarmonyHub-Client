import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { UserData } from "../../types";

type FirebaseAuthProps = {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
};

function FirebaseAuth({ setLoggedIn, setUserData }: FirebaseAuthProps) {
  useEffect(() => {
    const auth = getAuth();

    const unSubscribe = onAuthStateChanged(auth, user => {
      if (user && user.email && user.displayName) {
        setUserData({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });

    return () => {
      unSubscribe();
    };
  }, [setLoggedIn, setUserData]);

  return null;
}

export default FirebaseAuth;
