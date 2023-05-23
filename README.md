# Stresslessy
## About the project
The project is called Stresslessy and it is a mobile app built with React Native and Django primarily for ios. 

## Credits
This project was created by Katariina Blom, Elsa Grönbeck, Elise Hammarström, Lovisa Nilsson and Nina Persson.

## How to Install and Run the Project
### Get started
You must install Expo CLI to run this project. Follow the instructions here: https://docs.expo.dev/get-started/installation/
You must also have the iOS simulator: https://docs.expo.dev/workflow/ios-simulator/

After that:
1. Open the terminal
2. Navigate to the folder where you placed the contents of our github repo
3. Install the backend dependencies by running 
```bash
pip install -r requirements.txt
```
If you don't have pip, you can read more about the package manager [pip](https://pip.pypa.io/en/stable/) here. 
4. Write these commands in the following order: 

``` bash
cd backendApi
source venv/bin/activate
python3 manage.py runserver
```

Now the backend server is up and running.

5. Open up a new terminal window, and write
```bash
npx expo start
```
Don't forget to install the Frontend packages, see the section about Frontend dependencies below. 

6. Then choose iOS in the menu that pops up in your terminal
If you don't have the 

Done! 

### Dependencies
To start our app there are a few packets needed.

#### Frontend
- @react-navigation/native
- @react-navigation/native
- axios
- date-fns
- react-hook-form
- react-native-paper
- react-native-stopwatch-timer
- react-native-calendars
- react-native-paper
- react-native-dropdown-select-list
- react-native-ratings
- react-native-chart-kit
- timelite/time

#### Backend
All packages are installed by running "pip install -r requirements.txt" in the main folder of the project

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)




