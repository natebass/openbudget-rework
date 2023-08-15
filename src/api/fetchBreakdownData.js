import {reduceBudgetData} from "../utils/utils.jsx";

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


export function reduceBudgetData(budget, yearTypes, dimensionKeys, dimension, index) {
  return budget.reduce((accumulator, row) => {
    if (parseInt(row.budget_type) === parseInt(yearTypes[index])) {
      // Convert to object and cast totals to numbers
      accumulator[row[dimensionKeys[dimension]]] = +row.total
    }
    return accumulator
  }, {})
}

export async function fetchBreakdownData(years, yearTypes, type, dimension) {
  const urls = years.map(year => `${typePaths[type]}${dimensionPaths[dimension]}/${year}.json`)
  try {
    const response = await Promise.all(urls.map(url => {
      let response =  fetch(url)
      return response
    }));
    const [...budgets] = await Promise.all(response.map(data => {
      let budgets = data.json()
      return budgets
    }))
    const result = budgets.map((budget, index) => {
      let resultBudget = reduceBudgetData(budget, yearTypes, dimensionKeys, dimension, index)
      return resultBudget
    })
    return result
  } catch (error) {
    console.log(error)
  }
}