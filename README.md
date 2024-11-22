# Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
**First, [install nodejs and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).**
Then:
- `cd calculator-app`
- `npm install` to install dependencies
- `npm start`
- If it doesn't open by itself, open it at [http://localhost:3000](http://localhost:3000)

## Using it

An equation can be entered with either the buttons or the keyboard, press enter or the `=`
button to view the result. The ↶ ↷ buttons navigate through the history, and the
← and → buttons move the cursor in the input window. C clears the current expression,
and AC clears the expression and history. DEL deletes the character before the
cursor, and ANS is equal to the previous expression.

## Graphing
To graph, enter a univariate equation with `x` as the variable, for instance
`cos(x^2)`, and press the graph button in the right pane.

## Data series
Press the "+" button in the right pane to upload CSV files (which must have
one data series in the first column) to the calculator. You can then select
it in the bottom, and toggle between a view of the data in tabular form and
a histogram by clicking the graph button in the top right button of the pane.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
