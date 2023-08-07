# Open Budget Sacramento

## Contributing
Visit the project page to learn more about how to contribute. Get involved with Code for Sacramento by attending our virtual meetups.

## Front end
Run the front end by starting the web server in the /frontend directory.
```sh
npm start
```

Build the application for production by running the build command.
```sh
npm run build
```

## Budget Data
Run the files in the scripts folder to generate budget data for the application. The source of the budget data is. The files are saved in the budgets folder, along with a config file that the scripts use to parse it. For more information about how to get started, view [budget-data.md](documentation/budget-data.md).
```sh
python scripts/treemap_process_data.py budgets/1332_approved/City_of_Sacramento_Approved_Budgets.csv budgets/1322_approved/config.json
```

## Documentation
Learn about how works by viewing the files in the documentation folder. You can view the documentation page by running Sphinx. Documentation is also hosted in the project's Google Drive folder.
 ```sh
 sphinx up
```

## Run with VSCode
This repository includes run/debug configurations for VSCode. For more information about other editors, see [running-with-ides.md](documentation/running-with-ides.md).
* **Run React Web Server**
* **Build React Web Server**
* **Test React Web Server**
* **Generate Treemap Data**
* **Generate Flow Data**
* **Generate Compare Data**

## Run with Make
Running various tasks can be done with Make from the root directory.
* **Run docker container:** ```make local```
* **Run React web server:** ```make launch-react```
* **Test React web server:** ```make test-react```
* **Build React web server:** ```make build-react```
* **Run budget data scripts:** ```make run-budget```
* **Test budget data Scripts:** ```make test-budget```

## Docker
You can run the front end and documentation server at the same time by running the docker compose in the root directory.
```sh
docker compose up
```
