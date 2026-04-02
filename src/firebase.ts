import { initializeApp, type FirebaseOptions } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, type User } from 'firebase/auth'

function required(name: keyof ImportMetaEnv): string {
  const v = import.meta.env[name]
  if (!v || String(v).trim() === '') {
    throw new Error(
      `Thiếu biến môi trường ${name} — copy web/.env.example thành web/.env và điền.`,
    )
  }
  return String(v)
}

const firebaseConfig: FirebaseOptions = {
  apiKey: required('VITE_FIREBASE_API_KEY'),
  authDomain: required('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: required('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || undefined,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || undefined,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
}

export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account',
})

export function waitForAuthReady(): Promise<User | null> {
  if (typeof window === 'undefined') {
    return Promise.resolve(null)
  }

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

/** Analytics chỉ chạy trên trình duyệt (không hỗ trợ file://). */
void isSupported().then((ok) => {
  if (ok && firebaseConfig.measurementId) {
    getAnalytics(firebaseApp)
  }
})
