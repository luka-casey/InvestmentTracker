import React from 'react';
import '../styles/home.css';


const RetrievePricesButton = ({fetchStockData, loading}) => {

    return (
        <div className='mainTable'>
            <button className='retrievePricesButton' onClick={fetchStockData}>Retrieve Prices</button>
            {loading && <p>Loading...</p>}
        </div>
    );
};

export default RetrievePricesButton;
