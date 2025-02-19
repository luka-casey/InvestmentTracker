import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, setDoc, getDocs, query, where } from "firebase/firestore";

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

function getFormattedDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const year = today.getFullYear().toString().slice(-2);
    return `${month} ${day} ${year}`;
}


export const saveToFirebase = async (stocks) => {
    try {

        const stocksCollection = collection(db, "testForStocks"); // "stocks" is the collection name
        
        for (const stock of stocks) {

            const formattedDate = getFormattedDate(); // Get today's date format

            const stockQuery = query(stocksCollection, 
                where("name", "==", stock.name), 
                where("date", "==", formattedDate)
            );

            const querySnapshot = await getDocs(stockQuery);

            const stockData = {
                name: stock.name, // The name of the stock (e.g., 'Ethereum', 'Tesla')
                units: stock.units, // The number of units
                price: stock.price, // The price of the stock
                todaysChange: stock.todaysChange, // Today's change in percentage
                totalChange: stock.totalChange, // Total change in price
                totalChangePercent: stock.totalChangePercent, // Total change percentage
                icon: stock.icon, // The stock icon (for display purposes)
                date: formattedDate, // Firestore server-side timestamp
            };

            if (!querySnapshot.empty) {
                // If record exists, update the first found document
                const existingDoc = querySnapshot.docs[0].ref;
                await setDoc(existingDoc, stockData, { merge: true });
                console.log(`✅ Updated stock record for ${stock.name} on ${formattedDate}`);
            } else {
                // If no record exists, create a new one
                await addDoc(stocksCollection, stockData);
                console.log(`🆕 Added new stock record for ${stock.name} on ${formattedDate}`);
            }
        }


    } catch (error) {
        console.error("Error saving to firebase:", error);
    }
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);