import React, {useEffect, useState} from "react"
import {schemeSet2 as colors} from "d3-scale-chromatic"
import Select from "react-select"
import {fetchTotals} from "../api/fetchTotals"
import './Compare.scss'
import Total from "../components/Total";
import Breakdown from "../components/Breakdown";

const diffColors = {
  neg: "#e41a1c",
  pos: "#4daf4a",
}

const changesOptions = [
  { value: "pct", label: "percentage" },
  { value: "usd", label: "dollars" },
]
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
  const [selectedTab, setSelectedTab] = useState(1)

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
          <Total selectedYears={selectedYears}
                 colors={colors}
                 diffColors={diffColors}
                 changeType={changeType}/>
        )}
      </div>
      <div>
        <h2 className="text-xl pt-12">Budget breakdowns</h2>
        <p>Get more detail on where money came from and how it was spent.</p>
        <div className="flex pt-6">
          <ul className="tab-container flex-none pr-8">
            <div className="mr-2">
              <a onClick={() => setSelectedTab(1)}
                 className={selectedTab === 1 ? "tab-selector-active active" : "tab-selector-inactive"}>Spending by
                Department</a>
            </div>
            <div className="mr-2">
              <a onClick={() => setSelectedTab(2)}
                 className={selectedTab === 2 ? "tab-selector-active" : "tab-selector-inactive"}>Spending by
                Category</a>
            </div>
            <div className="mr-2">
              <a onClick={() => setSelectedTab(3)}
                 className={selectedTab === 3 ? "tab-selector-active" : "tab-selector-inactive"}>Revenue by
                Department</a>
            </div>
            <div className="mr-2">
              <a onClick={() => setSelectedTab(4)}
                 className={selectedTab === 4 ? "tab-selector-active" : "tab-selector-inactive"}>Revenue by
                Category</a>
            </div>
          </ul>
          {Object.getOwnPropertyNames(selectedYears[1]).length !== 0 && (
            <div className="flex-1 w-32">
              {selectedTab === 1 && (
                <Breakdown
                  colors={colors}
                  diffColors={diffColors}
                  usePercent={changeType.value === "pct"}
                  years={selectedYears}
                  type="spending"
                  dimension="department"/>
              )}
              {selectedTab === 2 && (
                <Breakdown
                  colors={colors}
                  diffColors={diffColors}
                  usePercent={changeType.value === "pct"}
                  years={selectedYears}
                  type="spending"
                  dimension="category"/>
              )}
              {selectedTab === 3 && (
                <Breakdown
                  colors={colors}
                  diffColors={diffColors}
                  usePercent={changeType.value === "pct"}
                  years={selectedYears}
                  type="revenue"
                  dimension="department"/>
              )}
              {selectedTab === 4 && (
                <Breakdown
                  colors={colors}
                  diffColors={diffColors}
                  usePercent={changeType.value === "pct"}
                  years={selectedYears}
                  type="revenue"
                  dimension="category"/>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Compare
