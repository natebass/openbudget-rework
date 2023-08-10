import React, {useEffect, useState} from "react"
import {schemeSet2 as colors} from "d3-scale-chromatic"
import Select from "react-select"
import {fetchTotals} from "../api/fetchTotals"
import {Bar} from "react-chartjs-2"
import {asTick, DiffStyled, parseDiff} from "../utils/utils"
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from "chart.js"
import './Compare.scss'
import Breakdown from "../components/Breakdown"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// TODO: Move totals chart into it's own component.
export const totalsChartOptions = {
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
        callback: (value) => {
          // display as currency in millions
          return `${asTick(value / 1000000)}M`
        },
      },
    },
  },
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  layout: {
    padding: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  },
}

const diffColors = {
  neg: "#e41a1c",
  pos: "#4daf4a",
}

const changesOptions = [
  { value: "pct", label: "percentage" },
  { value: "usd", label: "dollars" },
]

const tabs = [
  {"id": "tab-spending-department", "position": 1},
  {"id": "tab-spending-category", "position": 2},
  {"id": "tab-revenue-department", "position": 3},
  {"id": "tab-revenue-category", "position": 4}]

const Compare = () => {
  const [budget1Choice, setBudget1Choice] = useState({})
  const [budget2Choice, setBudget2Choice] = useState({})
  const [changeType, setChangeType] = useState({
    value: "pct",
    label: "percentage",
  })
  const [selectOptions, setSelectOptions] = useState([])
  const budget1Options = selectOptions.filter(option => option.value !== budget2Choice.value)
  const budget2Options = selectOptions.filter(option => option.value !== budget1Choice.value)
  const selectedYears = [budget1Choice, budget2Choice]
  const diff = parseDiff(selectedYears, changeType)
  const totalData = {
    labels: ["Total"],
    datasets: selectedYears.map((entry, i) => {
      return {
        data: [entry.total],
        label: entry.value,
        backgroundColor: colors[i],
        barPercentage: 0.8,
        categoryPercentage: 1,
      }
    }),
  }
  const [selectedTab, setSelectedTab] = useState(tabs[0])

  const changeTab = event => {
    document.getElementById(selectedTab.id).classList.remove("active")
    document.getElementById(selectedTab.id).classList.remove("tab-selector-active")
    document.getElementById(selectedTab.id).classList.add("tab-selector-inactive")
    document.getElementById(event.target.id).classList.remove("tab-selector-inactive")
    document.getElementById(event.target.id).classList.add("active")
    document.getElementById(event.target.id).classList.add("tab-selector-active")
    const t = tabs.filter(it => {
      return it.id === event.target.id
    })[0]
    setSelectedTab(t)
  }
  useEffect(() => {
    fetchTotals()
      .then((data) => {
        const selectOptions = data.map(option => {
          return {
            value: option.fiscal_year_range,
            budget_type: option.budget_type,
            label: `${option.fiscal_year_range} Adopted`,
            total: option.total,
          }
        })

        //default budget 1 and 2
        const defaultBudget1Choice = {
          value: data[0].fiscal_year_range,
          budget_type: data[0].budget_type,
          label: `${data[0].fiscal_year_range} Adopted`,
          total: data[0].total,
        }
        const defaultBudget2Choice = {
          value: data[1].fiscal_year_range,
          budget_type: data[1].budget_type,
          label: `${data[1].fiscal_year_range} Adopted`,
          total: data[1].total,
        }
        setBudget1Choice(defaultBudget1Choice)
        setBudget2Choice(defaultBudget2Choice)
        setSelectOptions(selectOptions)
      })
      .catch((err) => console.log(err))
  }, [fetchTotals])
  const customStyles1 = {singleValue: provided => ({...provided, color: "#66c2a5"})}
  const customStyles2 = {singleValue: provided => ({...provided, color: "#fc8d62"})}
  return (
    <div>
      <div className="flex h-32 items-end">
        <div className="flex h-20 w-9/12">
          <div className="flex items-center text-xl">
            <label className="inline-block pr-2">Compare</label>
            <Select
              className="pr-3"
              options={budget1Options}
              value={budget1Choice}
              onChange={setBudget1Choice}
              searchable={false}
              clearable={false}
              styles={customStyles1}
            />
            <label className="inline-block pr-2">With</label>
            <Select
              className="pr-3"
              options={budget2Options}
              value={budget2Choice}
              onChange={setBudget2Choice}
              searchable={false}
              clearable={false}
              styles={customStyles2}
            />
          </div>
        </div>
        <div className="w-3/12 h-20">
          <span>Show changes as:</span>
          <Select
            options={changesOptions}
            searchable={false}
            clearable={false}
            value={changeType}
            onChange={setChangeType}
          />
        </div>
      </div>
      <div>
        {budget1Options.length !== 0 && (
          <div className="">
            <h2 className="text-xl">
              Total Change:
              <DiffStyled
                diff={diff}
                colors={diffColors}
                usePercent={changeType.value === "pct"}
              ></DiffStyled>
            </h2>
            <div className="h-[100px] w-full">
              <Bar data={totalData} options={totalsChartOptions}/>
            </div>
          </div>
        )}
      </div>
      <div>
        <h2 className="text-xl pt-12">Budget breakdowns</h2>
        <p>Get more detail on where money came from and how it was spent.</p>
        <div className="flex pt-6">
          <ul className="tab-container flex-none pr-8">
            <div className="mr-2">
              <a onClick={changeTab} id={tabs[0].id} className="tab-selector-active active">Spending by
                Department</a>
            </div>
            <div className="mr-2">
              <a onClick={changeTab} id={tabs[1].id} className="tab-selector-inactive">Spending by
                Category</a>
            </div>
            <div className="mr-2">
              <a onClick={changeTab} id={tabs[2].id} className="tab-selector-inactive">Revenue by
                Department</a>
            </div>
            <div className="mr-2">
              <a onClick={changeTab} id={tabs[3].id} className="tab-selector-inactive">Revenue by
                Category</a>
            </div>
          </ul>
          {Object.getOwnPropertyNames(selectedYears[1]).length !== 0 && (
            <div className="flex-1 w-32">
              {selectedTab.position === 1 && (
                <Breakdown
                  colors={colors}
                  diffColors={diffColors}
                  usePercent={changeType.value === "pct"}
                  years={selectedYears}
                  type="spending"
                  dimension="department"
                ></Breakdown>
              )}
              {selectedTab.position === 2 && (
                <Breakdown
                  colors={colors}
                  diffColors={diffColors}
                  usePercent={changeType.value === "pct"}
                  years={selectedYears}
                  type="spending"
                  dimension="category"
                ></Breakdown>
              )}
              {selectedTab.position === 3 && (
                <Breakdown
                  colors={colors}
                  diffColors={diffColors}
                  usePercent={changeType.value === "pct"}
                  years={selectedYears}
                  type="revenue"
                  dimension="department"
                ></Breakdown>
              )}
              {selectedTab.position === 4 && (
                <Breakdown
                  colors={colors}
                  diffColors={diffColors}
                  usePercent={changeType.value === "pct"}
                  years={selectedYears}
                  type="revenue"
                  dimension="category"
                ></Breakdown>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Compare
