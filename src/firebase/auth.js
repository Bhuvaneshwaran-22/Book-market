import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebaseApp';

const allowedDomains = ['.edu', '.com', 'gmail.com'];

const isCollegeEmail = (email) =>
  allowedDomains.some((domain) => email.toLowerCase().endsWith(domain));

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const email = result.user?.email || '';
  if (!isCollegeEmail(email)) {
    await signOut(auth);
    throw new Error('Use a verified college email to sign in.');
  }
  await ensureUserDocument(result.user);
  return result.user;
};

export const ensureUserDocument = async (user) => {
  const ref = doc(db, 'users', user.uid);
  await setDoc(
    ref,
    {
      uid: user.uid,
      name: user.displayName || 'Student',
      email: user.email,
      department: '',
      year: '',
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
};

export const subscribeToAuth = (callback) => onAuthStateChanged(auth, callback);

export const signOutUser = () => signOut(auth);

export { isCollegeEmail };
