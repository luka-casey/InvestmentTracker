import convertCurrency from '../../helpers/convertCurrency';
import getTotalChangePercent from '../../helpers/getTotalChangePercent';
import axios from 'axios';
import sun from '../../icons/sunb.png'
import moon from '../../icons/moon.svg'

/**
 * Fetches data for a specific stock.
 *
 * @param {string} stockName - The name of the stock.
 * @param {string} stockSymbol - The stock's symbol (e.g., 'ETH-USD').
 * @param {string} stockRegion - The stock's region (e.g., 'US', 'AU').
 * @param {number} units - The number of units of the stock.
 * @param {number} originalMarketPrice - How much $AUD was spent to purchase the stock.
 * @param {string} fromCurrency - The currency used for conversion (e.g., 'USD').
 * @param {string} toCurrency - The target currency for conversion (e.g., 'AUD').
 * @param {string} icon - The icon representing the stock.
 * @param {boolean} isCrypto - Indicates if the stock is a cryptocurrency.
 * @returns {Promise<Object>} - A Promise resolving to an object with stock data.
 */
export const fetchAStock = async (stockName, stockSymbol, stockRegion, units, originalMarketPrice, fromCurrency, toCurrency, icon, isCrypto) => {
    try {
        const response = await getApiData(stockRegion, stockSymbol, process.env.REACT_APP_RAPID_API_KEY);

        const stockObject = await createStockObject(response.data, fromCurrency, toCurrency, originalMarketPrice, stockName, units, icon, isCrypto)

        return stockObject;
    }
    catch (error) {
        console.log(error)
    }
};

export async function createStockObject(data, fromCurrency, toCurrency, originalMarketPrice, stockName, units, icon, isCrypto) {

    try {
        const amount = data.quoteSummary.result[0].price.regularMarketPrice.raw;

        const convertedAmount = await convertExchangeRate(fromCurrency, toCurrency, amount);

        const currentMarketPrice = (convertedAmount * units).toFixed(2)

        const totalChange = currentMarketPrice - originalMarketPrice.toFixed(2);

        const totalChangePercent = getTotalChangePercent(currentMarketPrice, originalMarketPrice);

        const todaysChange = data.quoteSummary.result[0].price.regularMarketChangePercent.fmt;

        console.log(todaysChange)

        const todaysChangePercentage = parseFloat(todaysChange);

        const todaysChangeNum = (todaysChangePercentage / 100) * currentMarketPrice;

        const marketOpenIcon = await calculateMarketOpenIcon(fromCurrency, isCrypto)

        return {
            name: stockName,
            units: units,
            price: convertedAmount,
            todaysChange: todaysChange,
            totalChange: totalChange,
            totalChangePercent: totalChangePercent,
            icon: icon,
            todaysChangeNumeral: todaysChangeNum.toFixed(2),
            marketOpenIcon: marketOpenIcon
        };
    }
    catch (error) {
        console.log(error)
    }

}

export async function calculateMarketOpenIcon(fromCurrency, isCrypto) {
    let marketOpenIcon;

    if (isCrypto)
    {
        marketOpenIcon = sun;

        return marketOpenIcon;
    }
    else
    {
        const currentTime = new Date();

        const isMarketOpen = (timezone, openHour, closeHour) => {
            const formatter = new Intl.DateTimeFormat("en-US", {
                timeZone: timezone,
                hour: "numeric",
                hourCycle: "h23",
            });
            const currentHour = parseInt(formatter.format(currentTime), 10);
            return currentHour >= openHour && currentHour < closeHour;
        };
    
        if (fromCurrency === 'AUD') {
            // Australian Eastern Time, stock market open 10 AM - 4 PM
            if (isMarketOpen("Australia/Sydney", 10, 16)) {
                marketOpenIcon = sun; // Replace with your actual `sun` icon
            } else {
                marketOpenIcon = moon; // Replace with your actual `moon` icon
            }
        } else if (fromCurrency === 'USD') {
            // USA Eastern Time, stock market open 9:30 AM - 4 PM
            if (isMarketOpen("America/New_York", 9, 16)) {
                marketOpenIcon = sun;
            } else {
                marketOpenIcon = moon;
            }
        } else {
            console.log("Currency Code does not have an icon conversion yet");
        }

        return marketOpenIcon;
    }
}


export async function convertExchangeRate(fromCurrency, toCurrency, amount) {
    try {
        let convertedAmount;

        if (fromCurrency !== toCurrency) {
            convertedAmount = await convertCurrency(amount, fromCurrency, toCurrency);
        }
        else {
            convertedAmount = amount;
        }

        return convertedAmount;
    }
    catch (error) {
        console.log(error)
    }
}

export async function getApiData(stockRegion, stockSymbol, apiKey) {
    try {
        const response = await axios.get('https://yahoo-finance166.p.rapidapi.com/api/stock/get-price', {
            params: {
                region: stockRegion,
                symbol: stockSymbol
            },
            headers: {
                'x-rapidapi-host': 'yahoo-finance166.p.rapidapi.com',
                'x-rapidapi-key': apiKey,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });

        return response;
    }
    catch (error) {
        console.log(error)
    }
}