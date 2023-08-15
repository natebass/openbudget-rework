const url = "/data/compare/fiscal-years-expenses/totals.json";
export const fetchTotals = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data) {
      data.sort((a, b) => {
        // sort in reverse chronological order,
        // then adjusted,adopted,proposed within each year
        const [indexA, indexB] = [a, b].map((record) => {
          const year = record.fiscal_year_range.slice(2, 4);
          // type numbers don't really correspond to the order we want;
          // this rearranges them
          const type = 6 / record.budget_type;
          // construct numbers that will sort in descending order;
          // 2 digit year before the decimal, transformed type number after
          return +`${year}.${type}`;
        });
        return indexA < indexB ? 1 : -1;
      });
    }
    return data;
  } catch (err) {
    console.log(err);
  }
};
