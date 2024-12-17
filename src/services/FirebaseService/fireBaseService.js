import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

//https://console.firebase.google.com/u/0/project/investmenttracker-9e2e6/overview

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const authenticateUser = async () => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            process.env.REACT_APP_FIREBASE_EMAIL, 
            process.env.REACT_APP_FIREBASE_PASSWORD     
        );
        console.log("User signed in:", userCredential.user);
    } catch (error) {
        console.error("Error signing in:", error);
    }
};

export const saveToFirebase = async (stocks) => {
    try {

        const stocksCollection = collection(db, "stocks"); // "stocks" is the collection name
        
        for (const stock of stocks) {

            const stockData = {
                name: stock.name, // The name of the stock (e.g., 'Ethereum', 'Tesla')
                units: stock.units, // The number of units
                price: stock.price, // The price of the stock
                todaysChange: stock.todaysChange, // Today's change in percentage
                totalChange: stock.totalChange, // Total change in price
                totalChangePercent: stock.totalChangePercent, // Total change percentage
                icon: stock.icon, // The stock icon (for display purposes)
                dateTime: serverTimestamp(), // Firestore server-side timestamp
            };

            await addDoc(stocksCollection, stockData); // Add the stock data to Firestore
        }


    } catch (error) {
        console.error("Error saving to firebase:", error);
    }
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);