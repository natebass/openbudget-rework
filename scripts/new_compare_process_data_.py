import json
import os
import sys
from pathlib import Path

import pandas as pd


def load_config(cfg_file):
    """
    Directly loads a config .json file. This .json file specifies the way that
    each treemap .json file is built, including how to pivot the data.

    cfg_file --> the path to the config .json file to load
    """
    if os.path.exists(cfg_file):  # check for the file
        try:
            return json.load(open(cfg_file))  # load and parse json text to object
        except Exception as ex:
            print("Couldn't parse .json file: {}\n\t{}".format(cfg_file, ex))
            return json.loads("{}")  # empty object
    else:
        print("File", cfg_file, "is missing.")
        return json.loads("{}")  # empty object


def load_csv_data(csv_file):
    """
    Directly loads a budget .csv file. This .csv file contains all relevant
    budget data in a tabular format. The config.json file refers to column names
    that are in the .csv file in its instructions. This function loads .csv data
    into a pandas DataFrame.

    csv_file --> the path to the budget .csv file to load
    """
    if os.path.exists(csv_file):  # check for the file
        try:
            return pd.read_csv(csv_file, encoding='unicode_escape')  # load it into a pandas dataframe
        except Exception as ex:
            print("Couldn't parse .csv file: {}\n\t{}".format(csv_file, ex))
            return pd.DataFrame()  # blank dataframe
    else:
        print("File", csv_file, "is missing")
        return pd.DataFrame()  # blank dataframe


def write_json_file(path, contents, overwrite=True):
    directory = Path(os.path.dirname(path))
    directory.mkdir(parents=True, exist_ok=overwrite)
    with open(path, 'w', encoding="utf-8") as file:
        json.dump(contents, file)


def create_budget_expenses_totals_file(departments_table, expense_key, fiscal_years):
    # departments_table.index.get_level_values(0).unique()
    totals_list = list()
    for year in fiscal_years:
        total_dict = dict()
        total_dict["budget_type"] = str(1)
        fiscal_year_range_string = f"FY{str(year)[-2:]}"
        total_dict["fiscal_year_range"] = fiscal_year_range_string
        total_dict["total"] = str(int(departments_table.loc[year].sum()[expense_key]))
        total_dict["general_fund"] = str(
            int(departments_table.loc[year].sum()[f"General Fund {expense_key}"]))
        totals_list.append(total_dict)
    write_json_file(Path("compare", "fiscal-years-expenses", "totals.json"), totals_list)


def parse_fiscal_year_key(fiscal_year):
    if fiscal_year[:2] == "FY":
        return fiscal_year
    elif fiscal_year[:2] == "20":
        return int(fiscal_year)


def create_files_by_year(df, config):
    df1 = pd.DataFrame()
    df2 = pd.DataFrame()
    df3 = pd.DataFrame()
    df4 = pd.DataFrame()
    for i, j, k in zip(df.index,  df['Fiscal Year'], df['Account Type']):
        # FY15-16 revenue
        if j == list(config['groups'][0].values())[0][1] and k == list(config['groups'][0].values())[0][0]:
            df1 = pd.concat([df.iloc[[i]], df1], axis=0, ignore_index=True)
            df11 = df1.loc[:, [config['amount_header'], config['grouping_headers'][0], config['grouping_headers'][1],
                               list(config['groups'][0].values())[1][1], list(config['groups'][0].values())[1][2],
                               'Order - Account Name']]
            # print(df)
        # FY15-16 expense
        if j == list(config['groups'][2].values())[0][1] and k == list(config['groups'][2].values())[0][0]:
            df2 = pd.concat([df.iloc[[i]], df2], axis=0, ignore_index=True)
            df22 = df2.loc[:, [config['amount_header'], config['grouping_headers'][0], config['grouping_headers'][1],
                               list(config['groups'][2].values())[1][0], list(config['groups'][2].values())[1][1],
                               list(config['groups'][2].values())[1][2], list(config['groups'][2].values())[1][3],
                               'Order - Account Name']]
        # FY16-17 revenue
        if j == list(config['groups'][1].values())[0][1] and k == list(config['groups'][1].values())[0][0]:
            df3 = pd.concat([df.iloc[[i]], df3], axis=0, ignore_index=True)
            df33 = df3.loc[:, [config['amount_header'], config['grouping_headers'][0], config['grouping_headers'][1],
                               list(config['groups'][1].values())[1][0], list(config['groups'][1].values())[1][1],
                               list(config['groups'][1].values())[1][2], 'Order - Account Name']]
        # FY16-17 expense
        if j == list(config['groups'][3].values())[0][1] and k == list(config['groups'][3].values())[0][0]:
            df4 = pd.concat([df.iloc[[i]], df4], axis=0, ignore_index=True)
            df44 = df4.loc[:, [config['amount_header'], config['grouping_headers'][0], config['grouping_headers'][1],
                               list(config['groups'][3].values())[1][0], list(config['groups'][3].values())[1][1],
                               list(config['groups'][3].values())[1][2], list(config['groups'][3].values())[1][3],
                               'Order - Account Name']]
    d1 = df11.to_dict(orient='records')
    d2 = df22.to_dict(orient='records')
    d3 = df33.to_dict(orient='records')
    d4 = df44.to_dict(orient='records')
    json1 = json.dumps(d1)
    json2 = json.dumps(d2)
    json3 = json.dumps(d3)
    json4 = json.dumps(d4)
    with open("Revenue.FY15-16.json", "w") as outfile:
        outfile.write(json1)
    with open("Expense.FY15-16.json", "w") as outfile:
        outfile.write(json2)
    with open("Revenue.FY16-17.json", "w") as outfile:
        outfile.write(json3)
    with open("Expense.FY16-17.json", "w") as outfile:
        outfile.write(json4)
    # new1 = pd.concat(df1,df3)new2 = pd.concat(df2,df4)

def main():
    '''
    Load the configuration, load the raw data from .csv, then transform it all
    '''
    print(*sys.argv)
    if len(sys.argv) != 3:
        print("This script requires two extra arguments: <config>.json <budget data>.csv")
    cfg = load_config(sys.argv[1])  # load the config file
    df = load_csv_data(sys.argv[2])  # load the csv data
    create_files_by_year(df, cfg)
    # generate_files(df, cfg)


if __name__ == '__main__':
    main()
