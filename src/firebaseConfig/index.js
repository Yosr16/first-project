import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"
function StartFirebase (){
    const firebaseConfig = {
        apiKey: "AIzaSyD6ZUyeY6kInaqIMie0TJ-YhsEpoRJPEqU",
  authDomain: "first-project-d9cea.firebaseapp.com",
  databaseURL: "https://first-project-d9cea-default-rtdb.firebaseio.com",
  projectId: "first-project-d9cea",
  storageBucket: "first-project-d9cea.appspot.com",
  messagingSenderId: "894829136049",
  appId: "1:894829136049:web:2d7a2ae3f5a80b24aeba90"
};

const app = initializeApp(firebaseConfig);
return getDatabase (app);


}
export default StartFirebase;
