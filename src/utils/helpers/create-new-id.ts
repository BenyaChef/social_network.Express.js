export const createNewId = () => {
    const date = +(new Date())
    return date.toString()
}