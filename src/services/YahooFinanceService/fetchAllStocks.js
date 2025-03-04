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
        //const teslaPrice = await fetchAStock('Tesla', 'TSLA', 'US', 5, 2642.13, 'USD', 'AUD', teslaIcon, false);
        const globalXPhysicalGoldPrice = await fetchAStock('Global X Physical Gold', 'GOLD.AX', 'AU', 47, 1553.6, 'AUD', 'AUD', goldIcon, false);
        const redoxTransaction1 = await fetchAStock('Redox', 'RDX.AX', 'AU', 772, 2478.58, 'AUD', 'AUD', redoxIcon, false);
        //const freelancer = await fetchAStock('Freelancer', 'FLN.AX', 'AU', 6451, 1096.67, 'AUD', 'AUD', freelancerIcon, false)
        const ethereumTransaction2 = await fetchAStock('Ethereum', 'ETH-USD', 'US', 0.371, 2000, 'USD', 'AUD', ethereumIcon, true);
        const ethereumTransaction3 = await fetchAStock('Ethereum', 'ETH-USD', 'US', 0.01, 55, 'USD', 'AUD', ethereumIcon, true);
        const redoxTransaction2 = await fetchAStock('Redox', 'RDX.AX', 'AU', 291, 998.77, 'AUD', 'AUD', redoxIcon, false);
        const ethereumTransaction4 = await fetchAStock('Ethereum', 'ETH-USD', 'US', 1, 4135, 'USD', 'AUD', ethereumIcon, true);
        const ethereumTransaction5 = await fetchAStock('Ethereum', 'ETH-USD', 'US', 1, 3380, 'USD', 'AUD', ethereumIcon, true);

        const ethereum = await processMultipleTransactions([ethereumTransaction1, ethereumTransaction2, ethereumTransaction3, ethereumTransaction4, ethereumTransaction5]);
        console.log(ethereum);

        const redox = await processMultipleTransactions([redoxTransaction1, redoxTransaction2]);

        return [ethereum, globalXPhysicalGoldPrice, redox];

    } catch (error) {
        console.error("Error fetching or saving stocks:", error);
        return [];
    }
};

async function processMultipleTransactions(transactions) {
    let stock = {};

    for (let i = 0; i < transactions.length; i++) {
        const transaction = await transactions[i];

        if (i === 0) {
            // Initialize the stock object with the first transaction
            stock.name = transaction.name;
            stock.units = transaction.units;
            stock.price = transaction.price;
            stock.todaysChange = transaction.todaysChange;
            stock.totalChange = transaction.totalChange;
            stock.totalChangePercent = transaction.totalChangePercent;
            stock.icon = transaction.icon;
            stock.todaysChangeNumeral = parseFloat(transaction.todaysChangeNumeral).toFixed(2);
            stock.marketOpenIcon = transaction.marketOpenIcon;
        } else {
            // Accumulate values for subsequent transactions
            stock.units += transaction.units;
            stock.totalChange += transaction.totalChange;
            stock.todaysChangeNumeral = (parseFloat(stock.todaysChangeNumeral) + parseFloat(transaction.todaysChangeNumeral)).toFixed(2);
        }
    }

    return stock;
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