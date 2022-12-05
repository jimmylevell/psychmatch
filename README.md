# Psychmatch app
## Scope
Keyword-based match making of first client contact emails with possible psychologist and psychotherapist.

## Productive Infrastructure
The application consists of a frontend written in react and a backend written in NodeJS. For the storage of the data mongodb is used.

## Design
### Frontend
Using react in combination with the material design to create a intuitive UI.

### Backend
Backend API is using nodeJS and mongodb as datastore.

# Development
Backend and frontend are combined in this project but each with an individual package.json. and .env file.

## Backend
For the configuration of the app the following environment variable can be used:

    PORT=3000

    # mongo db DB connection string
    MONGO_DB_STRING=mongodb://mongoadmin:password@localhost:27017/psychmatch?authSource=admin

## Frontend
For the configuration of the app the following environment variable can be used:

    # react port
    PORT=3100

    REACT_APP_BACKEND_URL=http://localhost:3000
    REACT_APP_VERSION=1.0.0
    REACT_APP_NAME=$npm_package_name

## Local DB
Using the following docker command a local mongo DB instance can be instantiated.

    docker run -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=password -p 27017:27017 --name psychmatch-mongo -d --restart always mongo

## Local NLP Model
Using the following docker command a local NLP model can be instantiated.

    docker run -p 5000:5000 --name psychmatch-nlp -d --restart always ghcr.io/jimmylevell/psychmatch/psychmatch_nlp_model:latest

# Available Scripts
In the project directory, you can run:

## `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
