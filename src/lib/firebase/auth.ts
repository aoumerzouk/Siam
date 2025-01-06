import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { app } from './app';

const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error setting auth persistence:', error);
});

export { auth };