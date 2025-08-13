import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics"; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAovJZHHsPcu_8Y7OkFoGuH8eMJvTmGLbI",
  authDomain: "twitter-clone-f3f7b.firebaseapp.com",
  projectId: "twitter-clone-f3f7b",
  storageBucket: "twitter-clone-f3f7b.firebasestorage.app",
  messagingSenderId: "228902542207",
  appId: "1:228902542207:web:30e93eb1824f4961e4984a",
  measurementId: "G-F3KEW83NNW"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// ブラウザ環境でのみAnalyticsを初期化する
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      // この行はAnalyticsのインスタンスを初期化するだけ
      getAnalytics(app);
    }
  });
}