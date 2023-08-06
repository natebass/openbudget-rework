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

export async function fetchBreakdownData(years, yearTypes, type, dimension) {
  const urls = years.map(year => typePaths[type] + dimensionPaths[dimension] + `/${year}.json`)
  try {
    const response = await Promise.all(urls.map(url => fetch(url)));
    const [...budgets] = await Promise.all(response.map(data => data.json()))
    return budgets.map((budget, index) => {
      let rd = reduceBudgetData(budget, yearTypes, dimensionKeys, dimension, index)
      return rd
    })
  } catch (error) {
    console.log(error)
  }
}