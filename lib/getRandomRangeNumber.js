const getRandomRangeNumber = (min=2, max=10) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

export default getRandomRangeNumber;