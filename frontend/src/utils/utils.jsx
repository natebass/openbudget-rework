import React from "react"
import {format} from "d3-format"

export const asTick = format("$,.1f")
export const asDollars = format("+$,")
export const asPercent = format("+.2%")

export function asDiff(value, usePercent) {
  switch (value) {
    // Special handling for sentinel values.
    case Infinity:
      return "Newly Added"
    // Otherwise, choose the appropriate formatting.
    default:
      if (usePercent) {
        return asPercent(value)
      } else {
        return asDollars(value)
      }
  }
}

export function DiffStyled({diff, colors, usePercent}) {
  const style = {color: diff >= 0 ? colors.pos : colors.neg}
  return (
    <span style={style}> {asDiff(diff, usePercent)}</span>
  )
}

export function sortData(a, b) {
  // Sort in reverse chronological order, then adjusted, adopted, proposed within each year.
  const [indexA, indexB] = [a, b].map((record) => {
    const year = record.fiscal_year_range.slice(2, 4)
    // Type numbers don't really correspond to the order we want, this rearranges them.
    const type = 6 / record.budget_type
    // Construct numbers that will sort in descending order.
    // 2 digit year before the decimal, transformed type number after.
    return +`${year}.${type}`
  })
  return indexA < indexB ? 1 : -1
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