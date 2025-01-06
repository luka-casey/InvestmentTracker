import { authenticateUser } from '../FirebaseService/fireBaseService';
import { fetchAStock } from './fetchAStock';
import ethereumIcon from '../../icons/ethereum.svg'
import teslaIcon from '../../icons/tesla.svg'
import goldIcon from '../../icons/gold.svg'
import redoxIcon from '../../icons/redox.svg'
import freelancerIcon from '../../icons/freelancer.png'

export const fetchAllStocks = async () => {
    try {
        await authenticateUser();
        
        const ethereumTransaction1 = await fetchAStock('Ethereum', 'ETH-USD', 'US', 0.6238, 3000, 'USD', 'AUD', ethereumIcon, true);
        const teslaPrice = await fetchAStock('Tesla', 'TSLA', 'US', 5, 2642.13, 'USD', 'AUD', teslaIcon, false);
        const globalXPhysicalGoldPrice = await fetchAStock('Global X Physical Gold', 'GOLD.AX', 'AU', 47, 1553.6, 'AUD', 'AUD', goldIcon, false);
        const redoxPrice = await fetchAStock('Redox', 'RDX.AX', 'AU', 772, 2478.58, 'AUD', 'AUD', redoxIcon, false);
        const freelancer = await fetchAStock('Freelancer', 'FLN.AX', 'AU', 6451, 1096.67, 'AUD', 'AUD', freelancerIcon, false)
        const ethereumTransaction2 = await fetchAStock('Ethereum', 'ETH-USD', 'US', 0.371, 2000, 'USD', 'AUD', ethereumIcon, true);
        const ethereumTransaction3 = await fetchAStock('Ethereum', 'ETH-USD', 'US', 0.01, 55, 'USD', 'AUD', ethereumIcon, true);

        const ethereum = await processEthereumTransactions([ethereumTransaction1, ethereumTransaction2, ethereumTransaction3]);
        console.log(ethereum);

        return [ethereum, teslaPrice, globalXPhysicalGoldPrice, redoxPrice, freelancer];

    } catch (error) {
        console.error("Error fetching or saving stocks:", error);
        return [];
    }
};

async function processEthereumTransactions(transactions) {
    let ethereum = {};

    for (let i = 0; i < transactions.length; i++) {
        const transaction = await transactions[i];

        if (i === 0) {
            // Initialize the ethereum object with the first transaction
            ethereum.name = transaction.name;
            ethereum.units = transaction.units;
            ethereum.price = transaction.price;
            ethereum.todaysChange = transaction.todaysChange;
            ethereum.totalChange = transaction.totalChange;
            ethereum.totalChangePercent = transaction.totalChangePercent;
            ethereum.icon = transaction.icon;
            ethereum.todaysChangeNumeral = parseFloat(transaction.todaysChangeNumeral).toFixed(2);
            ethereum.marketOpenIcon = transaction.marketOpenIcon;
        } else {
            // Accumulate values for subsequent transactions
            ethereum.units += transaction.units;
            ethereum.totalChange += transaction.totalChange;
            ethereum.todaysChangeNumeral = (parseFloat(ethereum.todaysChangeNumeral) + parseFloat(transaction.todaysChangeNumeral)).toFixed(2);
        }
    }

    return ethereum;
}


// name: stockName,
// units: units,
// price: convertedAmount,
// todaysChange: todaysChange,
// totalChange: totalChange,
// totalChangePercent: totalChangePercent,
// icon: icon,
// todaysChangeNumeral: todaysChangeNum.toFixed(2),
// marketOpenIcon: marketOpenIcon