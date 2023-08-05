import React from "react"
import { format } from "d3-format"

export const asTick = format("$,.1f")

export const asDollars = format("+$,")

export const asPct = format("+.2%")

export const BUDGET_TYPES = {
  1: "Adopted",
  2: "Adjusted",
  3: "Proposed",
}

export const compareChartOptions = {
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        ticks: {
          beginAtZero: true,
          callback: (value) => {
            // display as currency in millions
            return `${asTick(value / 1000000)}M`
          },
        },
      },
    ],
  },
  tooltips: {
    callbacks: {
      label: (item, data) => {
        // display as currency in millions
        const label = data.datasets[item.datasetIndex].label
        return `${label}: ${asTick(item.xLabel / 1000000)}M`
      },
    },
  },
}

export function asDiff(value, usePct) {
  // special handling for sentinel values
  switch (value) {
    case Infinity:
      return "Newly Added"
    default:
      break
  }
  // otherwise choose the appropriate formatting
  if (usePct) {
    return asPct(value)
  } else {
    return asDollars(value)
  }
}

export function DiffStyled({diff, colors, usePct}) {
    const style = {
      color: diff >= 0 ? colors.pos : colors.neg,
    }
    return (
      <span style={style}> {asDiff(diff, usePct)}</span>
    )
}
