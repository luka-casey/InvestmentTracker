import axios from 'axios';

/**
 * Converts an amount from one currency to another.
 * @param {number} amount - The amount to be converted.
 * @param {string} fromCurrency - The currency code of the amount to convert (e.g. 'USD').
 * @param {string} toCurrency - The target currency code to convert to (e.g. 'EUR').
 * @returns {Promise<number>} The converted amount.
 */
const convertCurrency = async (amount, fromCurrency, toCurrency) => {
    const exchangeRateAPI = 'https://api.exchangerate-api.com/v4/latest';
  
    try {
      const response = await axios.get(`${exchangeRateAPI}/${fromCurrency}`);
      const rate = response.data.rates[toCurrency];
      if (!rate) throw new Error(`Rate for ${toCurrency} not available.`);
      const convertedAmount = (amount * rate).toFixed(2);
      return parseFloat(convertedAmount);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      throw new Error('Error converting currency');
    }
  };
  
  export default convertCurrency;