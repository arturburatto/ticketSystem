import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCtDnFLLao3OlOMAtIuxTxcG-VvpzFgO1o",
    authDomain: "tickets-367c9.firebaseapp.com",
    projectId: "tickets-367c9",
    storageBucket: "tickets-367c9.appspot.com",
    messagingSenderId: "917890006589",
    appId: "1:917890006589:web:b013d90c4327b00b9ef454",
    measurementId: "G-7PCVL9KY38"
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp)
  const db = getFirestore(firebaseApp)
  const storage = getStorage(firebaseApp)

  export {auth, db, storage}