# Open Budget Sacramento

## Contributing
Visit the project page to learn more about how to contribute. Get involved with Code for Sacramento by attending our virtual meetups.

## Front end
Run the front end by starting the web server in the /frontend directory.
```npm dev```

Build the application for production by running the build command.
```npm build```

## Budget Data
Run the files in the scripts folder to generate budget data for the application. The source of the budget data is. The files are saved in the budgets folder, along with a config file that the scripts use to parse it. For more information about how to get started, view [](documentation/budget-data.md).
```python scripts/treemap_process_data.py budgets/1332_approved/City_of_Sacramento_Approved_Budgets.csv budgets/1322_approved/config.json```

## Documentation
Learn about how works by viewing the files in the documentation folder. You can view the documentation page by running Sphinx. Documentation is also hosted in the project's Google Drive folder.
 ```sphinx up```

## Run with VSCode
This repository includes run/debug configurations for VSCode. For more information about other editors, see [](documentation/running-with-ides.md**.
* Run React Web Server
* Build React Web Server
* Generate Treemap Data
* Generate Flow Data
* Generate Compare Data

## Run with Make
Running various tasks can be done with Make from the root directory.
* Run docker container
 * ```make local```
* Run React Web Server
 * ```make launch-react```
* Test React Web Server
 * ```make test-react```
* Build React Web Server
 * ```make build-react```
* Run Budget Data Scripts
 * ```make run-budget```
* Test Budget Data Scripts
 * ```make test-budget```

## Docker
You can run the front end and documentation server at the same time by running the docker compose in the root directory.
```docker compose up```
