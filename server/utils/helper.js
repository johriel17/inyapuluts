export const generateRandomIndexes = (max, count) => {
    const indexes = new Set()
    while (indexes.size < count) {
        indexes.add(Math.floor(Math.random() * max))
    }
    return Array.from(indexes)
}