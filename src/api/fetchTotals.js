import axios from "axios"

const url = "/data/compare/fiscal-years-expenses/totals.json"
export const fetchTotals = async () => {
  try {
    const response = await axios.get(url)
    const data = await response.data
    if (data) {
      data.sort((a, b) => {
        // Sort in reverse chronological order, then adjusted, adopted, proposed within each year.
        const [indexA, indexB] = [a, b].map((record) => {
          const year = record.fiscal_year_range.slice(2, 4)
          // Type numbers don't really correspond to the order we want, this rearranges them.
          const type = 6 / record.budget_type
          // Construct numbers that will sort in descending order.
          // 2 digit year before the decimal, transformed type number after.
          return +`${year}.${type}`
        })
        // return descending(indexA, indexB)
        return indexA < indexB ? 1 : -1
      })
    }
    return data
  } catch (error) {
    console.log(error)
  }
}
