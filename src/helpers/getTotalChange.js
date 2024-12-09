function calculateTotalChange(originalPrice, currentPrice) {
    if (originalPrice === 0) {
      throw new Error("Original price cannot be zero");
    }
    const change = (currentPrice - originalPrice) / originalPrice;
    return change;
  }
  

  export default calculateTotalChange;