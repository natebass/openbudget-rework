import React, {useState} from "react"
import {Bar} from "react-chartjs-2"
import {keys, set} from "d3-collection"
import {ascending, descending} from "d3-array"

import {DiffStyled,} from "../utils/utils"
import Select from "react-select";

const DiffTable = ({data, usePct, years, colors, diffColors}) => {
  const [sortBy, setSortBy] = useState("diff")

  const updateSort = (e) => {
    const target = e.target;
    setSortBy(target.value);
  }
  const options = [
    {
      "value": "FY22",
      "budget_type": "1",
      "label": "FY22 Adopted",
      "total": "1196607155"
    }]
  const expose = () => {
  }

  // <option value="diff">amount</option>
  // <option value="key">name</option>
  const sortFunc = sortBy === "diff" ? descending : ascending
  const allKeys = set()
  keys(data[0]).forEach((key) => {
    allKeys.add(key)
  })
  keys(data[1]).forEach((key) => {
    allKeys.add(key)
  })
  const diffList = allKeys
    .values()
    .map((key) => {
      // check for key in both years if one is missing,
      // set some special value that indicates that
      const res = {
        key,
        value: data[0][key],
        prev: data[1][key],
      }
      // if key exists in previous, we can calculate a diff
      // missing values (removed entities) cast to zero for -100% diff
      if (res.prev) {
        res.diff = (res.value || 0) - res.prev
        if (usePct) {
          res.diff = res.diff / Math.abs(res.prev)
        }
      } else {
        // sentinel value: indicates there was no previous budget,
        // so this is a newly created entity. UI can handle these differently
        // if desired, and they will sort to the top of the list.
        res.diff = Infinity
      }
      return res
    })
    .sort((a, b) => {
      return sortFunc(a[sortBy], b[sortBy])
    })
    .map((entry) => {
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
        <div key={entry.key}>
          <div>
            <h4>
              {entry.key}
              <Bar data={data} height={40}></Bar>
            </h4>
          </div>
          <div>
            <DiffStyled
              diff={entry.diff}
              colors={diffColors}
              usePct={usePct}
            ></DiffStyled>
          </div>
        </div>
      );
    });

  return (
    // Todo: Use CSS Grid to display 2 rows on xl, 1 row sm, and make both responsive resize
    <div className="table">
      <div className="">
        <div className="">
          <label className="">Sort by:</label>
          <Select
            className=""
            id="sortControl"
            options={options}
            value={sortBy}
            onChange={expose}
            searchable={false}
            clearable={false}
          />
        </div>
      </div>
      <div>{diffList}</div>
    </div>
  );
};
export default DiffTable