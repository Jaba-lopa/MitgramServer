export default function convertObjArrToJSON(array: Array<{}>) {
    if (!Array.isArray(array)) return []
    return array.map((el) => JSON.stringify(el))
}