import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";

export const useAuth = () => {
  const { $auth } = useNuxtApp(); // プラグインから$authを取得
  const user = useState<FirebaseUser | null>("firebase-user", () => null);

  // onAuthStateChangedはクライアントサイドでのみ監視
  if (process.client) {
    onAuthStateChanged($auth, (firebaseUser) => {
      if (firebaseUser) {
        user.value = firebaseUser;
      } else {
        user.value = null;
      }
    });
  }

  const signUp = (email, password) => {
    return createUserWithEmailAndPassword($auth, email, password);
  };

  const logIn = (email, password) => {
    return signInWithEmailAndPassword($auth, email, password);
  };

  const logOut = () => {
    return signOut($auth);
  };

  const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        $auth,
        (user) => {
          unsubscribe();
          resolve(user);
        },
        reject
      );
    });
  };

  return { user, signUp, logIn, logOut, getCurrentUser };
};
