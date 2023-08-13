import React, {useState} from "react"
import {useQuery} from "react-query"
import {fetchBreakdownData} from "../api/fetchBreakdownData.js"
import {Bar} from "react-chartjs-2"
import {keys, set} from "d3-collection"
import {ascending, descending} from "d3-array"
import {asDecimalTick, asTick, DiffStyled,} from "../utils/utils"
import Select from "react-select"
import PropTypes from "prop-types";
import {schemeSet2 as colors} from "d3-scale-chromatic"

/**
 * Horizontal bar chart with hidden legend
 */
const chartOptions = {
  indexAxis: "y",
  scales: {
    x: {
      ticks: {
        beginAtZero: true,
        callback: value => `${asTick(value / 1000000)}M`
      },
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: context => `${context.dataset.label}: ${asDecimalTick(context.raw / 1000000)}M`
      },
    }
  }
}

/**
 * Breakdown budgets by department and account type.
 * @component
 */
const TrendBarChart = ({data, years, colors}) => {
  const allKeys = set()
  keys(data[0]).forEach(key => allKeys.add(key))
  keys(data[1]).forEach(key => allKeys.add(key))
  const labels = allKeys.values().sort()
  const datasets = data.map((record, index) => {
    return {
      label: years[index].value,
      data: labels.map(label => record[label]),
      backgroundColor: colors[index],
    }
  })
  return <Bar data={{labels, datasets}} height={125}></Bar>
}

/**
 * Breakdown budgets by department and account type.
 * @component
 */
const BreakdownChartList = ({data, usePercent, years, colors, diffColors}) => {
  const [sortBy, setSortBy] = useState("diff")
  // TODO: Fix update sort not updating bug
  const sortFunc = sortBy === "diff" ? descending : ascending;
  const options = [{"value": "diff", "label": 'Amount'}, {"value": "key", "label": 'Name'}]
  const allKeys = set()
  keys(data[0]).forEach(key => allKeys.add(key))
  keys(data[1]).forEach(key => allKeys.add(key))
  const diffList = allKeys
    .values()
    .map(key => {
      // TODO: Check for the key in both years. If one is missing, set some special value that indicates that.
      const response = {
        key,
        value: data[0][key],
        prev: data[1][key]
      }
      // If key exists in previous, we can calculate a diff.
      // For missing values (removed entities) cast to zero for -100% diff
      if (response.prev) {
        response.diff = (response.value || 0) - response.prev
        if (usePercent) response.diff = response.diff / Math.abs(response.prev)
      } else {
        // Sentinel value: indicates there was no previous budget,
        // so this is a newly created entity. UI can handle these differently
        // if desired, and they will sort to the top of the list.
        response.diff = Infinity
      }
      return response
    })
    .sort((a, b) => sortFunc(a[sortBy], b[sortBy]))
    .map(entry => {
      const data = {
        labels: [""],
        datasets: [
          {
            data: [entry.value],
            label: years[0].value,
            backgroundColor: colors[0],
          },
          {
            data: [entry.prev],
            label: years[1].value,
            backgroundColor: colors[1],
          },
        ],
      }
      return (
        // TODO: Fix table styling resize bug. Rewrite and clean up styles.
        <div className="flex mt-6" key={entry.key}>
          <div style={{position: "relative", margin: "auto", width: "70vw"}} className="flex-1">
            {entry.key}
            <Bar className="grow w-max" data={data} options={chartOptions} height={40}></Bar>
          </div>
          {/*TODO: Make this item justify the the right*/}
          <div className="">
            <DiffStyled
              diff={entry.diff}
              colors={diffColors}
              usePercent={usePercent}
            ></DiffStyled>
          </div>
        </div>
      )
    })

  return (
    <div className="mt-6">
      <div className="flex justify-end">
        <div className="flex items-center w-fit">
          <label className="h-fit mr-3">Sort by:</label>
          <Select
            options={options}
            value={options.filter(option => option.value === sortBy)[0]}
            onChange={selection => setSortBy(selection.value)}
            searchable={false}
            clearable={false}
          />
        </div>
      </div>
      <div className="">{diffList}</div>
    </div>
  )
}

/**
 * Breakdown budgets by department and account type.
 * @component
 */
const Breakdown = props => {
  const {colors, diffColors, usePercent, years, type, dimension} = props
  const yearNames = years.map(year => year.value)
  const yearTypes = years.map(year => year.budget_type)
  const {data, status} = useQuery(yearNames, () => fetchBreakdownData(yearNames, yearTypes, type, dimension))
  return (
    <div>
      {status === "error" && <p>Error fetching data</p>}
      {status === "loading" && <p>Fetching data...</p>}
      {status === "success" && (
        <div>
          <TrendBarChart data={data} colors={colors} years={years}/>
          <BreakdownChartList
            data={data}
            years={years}
            colors={colors}
            diffColors={diffColors}
            usePercent={usePercent}
          />
        </div>
      )}
    </div>
  )
}

Breakdown.propTypes = {
  /**
   * User's name
   */
  colors: PropTypes.array.isRequired,
  /**
   * User's age
   */
  diffColors: PropTypes.object.isRequired,
  /**
   * User's name
   */
  usePercent: PropTypes.bool.isRequired,
  /**
   * User's age
   */
  years: PropTypes.array.isRequired,
  /**
   * User's name
   */
  type: PropTypes.string.isRequired,
  /**
   * User's age
   */
  dimension: PropTypes.string.isRequired,
}

Breakdown.defaultProps = {
  colors: colors,
  diffColors: {
    "neg": "#e41a1c",
    "pos": "#4daf4a"
  },
  usePercent: true,
  years: [
    {
      "value": "FY22",
      "budget_type": "1",
      "label": "FY22 Adopted",
      "total": "1196607155"
    },
    {
      "value": "FY21",
      "budget_type": "1",
      "label": "FY21 Adopted",
      "total": "1162061128"
    }
  ],
  type: "spending",
  dimension: "department",
}

export default Breakdown