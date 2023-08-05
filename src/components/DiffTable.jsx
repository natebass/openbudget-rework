import React, { useState } from "react"
import { Bar } from "react-chartjs-2"
import { keys, set } from "d3-collection"
import { ascending, descending } from "d3-array"

import { DiffStyled, } from "../utils/utils"

const DiffTable = ({data, usePct, years, colors, diffColors}) => {
  const [sortBy, setSortBy] = useState("diff")

  const updateSort = (e) => {
    const target = e.target;
    setSortBy(target.value);
  }

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
        <tr key={entry.key}>
          <td>
            <h4>
              {entry.key}
              <Bar data={data} height={40}></Bar>
            </h4>
          </td>
          <td>
            <DiffStyled
              diff={entry.diff}
              colors={diffColors}
              usePct={usePct}
            ></DiffStyled>
          </td>
        </tr>
      );
    });

  return (
    // Todo: Use CSS Grid to display 2 rows on xl, 1 row sm, and make both responsive resize
    <table className="table">
      <thead>
        <tr>
          <th className="">
            <div className="">
              <label className="" htmlFor="sortControl">Sort by:{" "}</label>
              <div className="">
                <select
                  className=""
                  id="sortControl"
                  value={sortBy}
                  onChange={updateSort}
                >
                  <option value="diff">amount</option>
                  <option value="key">name</option>
                </select>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>{diffList}</tbody>
    </table>
  );
};
export default DiffTable