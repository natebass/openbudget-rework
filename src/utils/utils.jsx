import React from "react";
import { format } from "d3-format";

export const asTick = format("$,.1f");

export const asDollars = format("+$,");

export const asPct = format("+.2%");

export const compareChartOptions = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  scales: {
    x: {
      ticks: {
        beginAtZero: true,
        // display as currency in millions
        callback: value => `${asTick(value / 1000000)}M`
      },
    },
  },
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        // display as currency in millions
        label: context => `${context.dataset.label}: ${asTick(context.raw / 1000000)}M`
      },
    }
  }
};

export function asDiff(value, usePct) {
  // special handling for sentinel values
  switch (value) {
    case Infinity:
      return "Newly Added";
    default:
      // otherwise, choose the appropriate formatting.
      if (usePct) {
        return asPct(value);
      } else {
        return asDollars(value);
      }
  }
}


export function DiffStyled({diff, colors, usePercent}) {
  const style = {color: diff >= 0 ? colors.pos : colors.neg};
  return (
    <span style={style}> {asDiff(diff, usePercent)}</span>
  );
}

export function parseDiff(selectedYears, changeType) {
  let difference = selectedYears[0].total - selectedYears[1].total
  if (changeType.value === "pct") {
    difference = difference / selectedYears[1].total
  }
  return difference
}