// Create a function to fetch chat history data from Firestore based on userId. 
// This function will query Firestore using getFirestore, collection, query, where, and getDocs functions from Firebase Firestore SDK.
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";


// This function fetch data from the Firestore collection named 'chats'
const fetchChatHistory = async (userId) => {
    try {
        // Create a query to fetch documents from the 'chats' collection where 'userId' equals the provided userId
        const q = query(collection(db, "chats"), where("userId", "==", userId));

         // Execute the query and get the query snapshot
        const querySnapshot = await getDocs(q);

        // Initialize an empty array to hold the chat history
        const history = [];

        // Iterate over the query snapshot and push each document's data to the history array
        querySnapshot.forEach((doc) => {
            history.push({ id: doc.id, ...doc.data() });
        });

        // Return the chat history array
        return history;
    } catch (error) {
        console.error("Error fetching chat history:", error);
        throw new Error("Failed to fetch chat history.");
    }
};

export { fetchChatHistory };
