# WhereIsMyMoney
An app for budgeting

## DATABASE
you should have **PostgreSQL** installed  
run the back/express/prerequisites/**data.sql** to create a 'budget' DB with all the necessary tables

## BACKEND
⚙️ the app will need all the env params from back/express/**.env**  
⚙️ **NODE_ENV** should be production  
⚙️ **DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME** for DB connection  
⚙️ **SECRET_KEY** for encryption  
⚙️ **CURRENCY_RATES_URL, CURRENCY_RATES_API_VERSION, CURRENCY_RATES_ENPOINT_1** for requesting currencies  

go to back/**express**
run
```
npm run deploy
```
to start the app

## FRONTEND
⚙️ the app will need all the env params from front/just-react-simpler/**.env**  
⚙️ **REACT_APP_BACKEND_URL** to know where backend is  
⚙️ **REACT_APP_COOKIE_AUTH_NAME** how the auth cookie should be called  

go to front/**just-react-simpler**
run 
```
npm run build
```
the 'build' folder will appear with the current build
