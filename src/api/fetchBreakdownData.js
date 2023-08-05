import axios from "axios"

const typePaths = {
  spending: "/data/compare/fiscal-years-expenses",
  revenue: "/data/compare/fiscal-years-revenue",
}
const dimensionPaths = {
  department: "/depts",
  category: "/account-cats",
}
const dimensionKeys = {
  department: "department",
  category: "account_category",
}

export function fetchBreakdownData(years, yearTypes, type, dimension) {
  // Start two concurrent requests, one per year. Wait for them both to return before ending the fetch.
  const urls = years.map((year) => {
    return typePaths[type] + dimensionPaths[dimension] + `/${year}.json`
  })
  return axios.all(urls.map((url) => axios.get(url))).then(axios.spread((...budgets) => {
    // Put the data in the thing
    return budgets.map((b, i) => b.data.reduce((accumulator, row) => {
      // Filter rows that don't match the desired budget type.
      // Double-equals because it might be an integer in string form.
      if (row.budget_type == yearTypes[i]) {
        // convert to object and cast totals to numbers
        accumulator[row[dimensionKeys[dimension]]] = +row.total
      }
      return accumulator
    }, {}))
  }))
}
