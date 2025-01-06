import { saveToFirebase } from '../FirebaseService/fireBaseService';
import { fetchAllStocks } from './fetchAllStocks';

export const fetchStocks = async () => {
    try {
        const stocks = await fetchAllStocks();

        saveToFirebase(stocks) 

        return stocks;

    } catch (error) {
        console.error("Error fetching or saving stocks:", error);
        return [];
    }
};

