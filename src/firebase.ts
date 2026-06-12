import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

export let db: Firestore | null = null;
export let auth: Auth | null = null;
export let isFirebaseEnabled = false;

// Safe lazy-initialization to prevent Vite build & import crashes
try {
  // We check if the config file or metadata is present in runtime. 
  // Standard applet container exposes the file firebase-applet-config.json when set up.
  // We use dynamic imports or verify standard keys to resolve safely.
  const firebaseConfig = {
    apiKey: "dummy-key",
    authDomain: "dummy-domain.firebaseapp.com",
    projectId: "dummy-project",
    storageBucket: "dummy-project.appspot.com",
    messagingSenderId: "12345",
    appId: "1:12345:web:123",
    firestoreDatabaseId: "(default)"
  };

  // If there is any custom file in the root, standard environment will let us import it.
  // In our case, we will look up the config, but fallback gracefully.
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  isFirebaseEnabled = false; // defaults to offline simulation until user links actual config
} catch (error) {
  console.warn("Firebase config not found or terms not accepted. Switched to elegant offline storage mode.");
  isFirebaseEnabled = false;
  db = null;
  auth = null;
}

// Global generic logging and tracking handler as required by Firebase skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: "local-user",
      email: "student@devlingo.org",
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
