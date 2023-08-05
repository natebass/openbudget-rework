import React from "react"
import { Bar } from "react-chartjs-2"
import { keys, set } from "d3-collection"

import { asTick } from "../utils/utils"

const chartOpts = {
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        ticks: {
          autoSkip: false,
        },
      },
    ],
    yAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: "Amount (in millions)",
        },
        ticks: {
          beginAtZero: true,
          callback: (value) => {
            // display as currency in millions
            const num = (value / 1000000).toLocaleString("en")
            return `\$${num}M`
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
        return `${label}: ${asTick(item.yLabel / 1000000)}M`
      },
    },
  },
}

const Trend = ({data, years, colors}) => {
  const allKeys = set()
  keys(data[0]).forEach((key) => {
    allKeys.add(key)
  })
  keys(data[1]).forEach((key) => {
    allKeys.add(key)
  })
  const labels = allKeys.values().sort()
  const datasets = data.map((record, i) => {
    return {
      label: years[i].value,
      data: labels.map((label) => record[label]),
      backgroundColor: colors[i],
    }
  })
  const data2 = {labels, datasets}

 return <Bar data={data2} height={125}></Bar>
}
export default Trend

