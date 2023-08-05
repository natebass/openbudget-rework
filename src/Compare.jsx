import React, { useEffect, useState } from "react"
import { schemeSet2 as colors } from "d3-scale-chromatic"
import Select from "react-select"
import { fetchTotals } from "./api/fetchTotals"
import './Compare.css'
import { Bar } from "react-chartjs-2"
import { asTick, DiffStyled } from "./utils/utils"
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip, } from "chart.js"
import Breakdown from "./components/Breakdown";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export const options = {
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
const styles = [{color: colors[0]}, {color: colors[1]}]
const diffColors = {
  neg: "#e41a1c",
  pos: "#4daf4a",
}
const changesOptions = [
  { value: "pct", label: "percentage" },
  { value: "usd", label: "dollars" },
]

function parseDiff(selectedYears, changeType) {
  let difference = selectedYears[0].total - selectedYears[1].total
  if (changeType.value === "pct") {
    difference = difference / selectedYears[1].total
  }
  return difference
}

function parseBudgets() {
  const budgets = data.map((option) => {
    return {
      total: option.total,
      year: option.fiscal_year_range,
    };
  });
}

const Compare = () => {
  const [budgets, setBudgets] = useState([])
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
  useEffect(() => {
    fetchTotals()
      .then((data) => {
        const selectOptions = data.map((option) => {
          return {
            value: option.fiscal_year_range,
            budget_type: option.budget_type,
            label: `${option.fiscal_year_range} Adopted`,
            total: option.total,
          };
        });

        //default budget 1 and 2
        const defaultBudget1Choice = {
          value: data[0].fiscal_year_range,
          budget_type: data[0].budget_type,
          label: `${data[0].fiscal_year_range} Adopted`,
          total: data[0].total,
        };
        const defaultBudget2Choice = {
          value: data[1].fiscal_year_range,
          budget_type: data[1].budget_type,
          label: `${data[1].fiscal_year_range} Adopted`,
          total: data[1].total,
        };
        setBudget1Choice(defaultBudget1Choice);
        setBudget2Choice(defaultBudget2Choice);
        setSelectOptions(selectOptions);
      })
      .catch((err) => console.log(err));
  }, [fetchTotals]);
  const customStyles1 = {
    singleValue: (provided) => ({
      ...provided,
      color: "#66c2a5",
    }),
  }
  const customStyles2 = {
    singleValue: (provided) => ({
      ...provided,
      color: "#fc8d62",
    }),
  }

  return (
    <div>
      <div className="flex w-full h-32 items-end">
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
                usePct={changeType.value === "pct"}
              ></DiffStyled>
            </h2>
            <div className="h-[100px] w-full">
              <Bar data={totalData} options={options}/>
            </div>
          </div>
        )}
      </div>
      <div>
        <h2 className="text-xl pt-12">Budget breakdowns</h2>
        <p>Get more detail on where money came from and how it was spent.</p>
        <div className="flex pt-6">
          <div className="flex-none pr-8">
            <div>Spending by Department</div>
            <div>Spending by Category</div>
            <div>Revenue by Department</div>
            <div>Revenue by Category</div>
          </div>
          <div className="flex-auto w-32">
            <div>
              {Object.getOwnPropertyNames(selectedYears[1]).length !== 0 && (
                <Breakdown
                  colors={colors}
                  diffColors={diffColors}
                  usePct={changeType.value === "pct"}
                  years={selectedYears}
                  type="spending"
                  dimension="department"
                ></Breakdown>
              )}
            </div>
            <div>
                {/* <Breakdown
                  colors={colors}
                  diffColors={diffColors}
                  usePct={usePct}
                  years={selectedYears}
                  type="spending"
                  dimension="category"
                ></Breakdown> */}
            </div>
            <div>
                {/* <Breakdown
                  colors={colors}
                  diffColors={diffColors}
                  usePct={usePct}
                  years={selectedYears}
                  type="revenue"
                  dimension="department"
                ></Breakdown> */}
            </div>
            <div>
                {/* <Breakdown
                  colors={colors}
                  diffColors={diffColors}
                  usePct={usePct}
                  years={selectedYears}
                  type="revenue"
                  dimension="category"
                ></Breakdown> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Compare
