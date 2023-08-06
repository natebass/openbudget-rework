import {sortData} from "../utils/utils.jsx";

export const fetchTotals = async () => {
  try {
    const response = await fetch("/data/compare/fiscal-years-expenses/totals.json")
    const data = await response.json()
    return data.sort(sortData)
  } catch (error) {
    console.log(error)
  }
}
