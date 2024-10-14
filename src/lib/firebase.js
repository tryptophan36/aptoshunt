// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, setDoc, getDocs, doc } from "firebase/firestore"; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "treasurehunt-46064.firebaseapp.com",
  projectId: "treasurehunt-46064",
  storageBucket: "treasurehunt-46064.appspot.com",
  messagingSenderId: "333321972112",
  appId: "1:333321972112:web:dd80ab0a966131d9052b15",
  measurementId: "G-28R8EY97R1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

// Function to save treasure location
export const saveTreasureLocation = async (latitude, longitude, creatorAddress) => {
  try {
    const uniqueId = `${creatorAddress}_${Date.now()}`;
    const docRef = await setDoc(doc(firestore, "treasure-locations",uniqueId), {
      lattitude:latitude,
      longitude:longitude,
      creatorAddress:creatorAddress,
    }).then((response)=>{
        console.log(response,"---->response")
    }).catch((error)=>{
        console.log(error)
    })
    console.log("Document written with ID: ", docRef);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const fetchTreasureLocations = async () => {
    const treasures = [];
    const querySnapshot = await getDocs(collection(firestore, "treasure-locations"));
    
    querySnapshot.forEach((doc) => {
        const data = doc.data()
        const lattitude =data.lattitude
        const longitude = data.longitude
      treasures.push({ key:String(doc.id),location:{lat:lattitude,lng:longitude}})
    });
  
    return treasures;
  };