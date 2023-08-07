import {sortData} from "../utils/utils.jsx";
import {sort} from "d3-array";

/**
 * Fetch budget totals.
 * @See BudgetAPI#FetchTotals
 * @See API Style Guide
 * @returns {Promise<*>}
 */
export const fetchTotals = async () => {
  try {
    const response = await fetch("/openbudget-rework/data/compare/fiscal-years-expenses/totals.json")
    const data = await response.json()
    const sortedData = data.sort(sortData)
    return sortedData
  } catch (error) {
    console.log(error)
  }
}
