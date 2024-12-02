function getTotalChangePercent(currentMarketPrice, originalMarketPrice) {
    const totalChangePercent = ((currentMarketPrice - originalMarketPrice) / originalMarketPrice ) * 100;
    return totalChangePercent.toFixed(2)
  }
  

  export default getTotalChangePercent;