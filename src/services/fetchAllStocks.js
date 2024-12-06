import { authenticateUser } from './fireBaseService';
import { fetchAStock } from './fetchAStock';
import ethereumIcon from '../icons/ethereum.svg'
import teslaIcon from '../icons/tesla.svg'
import goldIcon from '../icons/gold.svg'
import redoxIcon from '../icons/redox.svg'

export const fetchAllStocks = async () => {
    try {
        await authenticateUser();
        
        const ethereumPrice = await fetchAStock('Ethereum', 'ETH-USD', 'US', 0.6238, 3000, 'USD', 'AUD', ethereumIcon, true);
        const teslaPrice = await fetchAStock('Tesla', 'TSLA', 'US', 5, 2642.13, 'USD', 'AUD', teslaIcon, false);
        const globalXPhysicalGoldPrice = await fetchAStock('Global X Physical Gold', 'GOLD.AX', 'AU', 47, 1553.6, 'AUD', 'AUD', goldIcon, false);
        const redoxPrice = await fetchAStock('Redox', 'RDX.AX', 'AU', 772, 2478.58, 'AUD', 'AUD', redoxIcon, false);

        return [ethereumPrice, teslaPrice, globalXPhysicalGoldPrice, redoxPrice];

    } catch (error) {
        console.error("Error fetching or saving stocks:", error);
        return [];
    }
};