import React, { useState } from "react"
import { useQuery } from "react-query";
import DiffTable from "./DiffTable"
import Trend from "./Trend.jsx"
import { fetchBreakdownData } from "../api/fetchBreakdownData.js"

const Breakdown = ({
  colors,
  diffColors,
  usePct,
  years,
  type,
  dimension,
}) => {
  const [budgets, setBudgets] = useState([])
  const yearNames = years.map(year => year.value)
  const yearTypes = years.map(year => year.budget_type)
  const {data, status} = useQuery(yearNames, () => fetchBreakdownData(yearNames, yearTypes, type, dimension))
  return (
    <div>
      {status === "error" && <p>Error fetching data</p>}
      {status === "loading" && <p>Fetching data...</p>}
      {status === "success" && (
        <div>
          <Trend data={data} colors={colors} years={years}></Trend>
          <DiffTable
            data={data}
            years={years}
            colors={colors}
            diffColors={diffColors}
            usePct={usePct}
          />
        </div>
      )}
    </div>
  )
}
export default Breakdown