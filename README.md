# Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
**First, [install nodejs and npm](https://nodejs.org/en/download/prebuilt-installer/current).**
Then:
- `cd calculator-app`
- `npm install` to install dependencies
- `npm start`
- If it doesn't open by itself, open it at [http://localhost:3000](http://localhost:3000)

## Using it

An equation can be entered with either the buttons or the keyboard, press enter or the `=`
button to view the result.
Most buttons simply add the given symbol or function to the input window.
The following is a description of the other buttons:
- DEG/RAD allow the unit for the trigonometric functions (sin, cos, tan) to be selected
- x adds an "x", as in a variable. Necessary for function graphing.
- ↶ ↷ navigate through the history
- AC clears the current expression and the history
- C clears the current expression
- ← and → move the cursor in the input window
- DEL deletes the character before the
- ANS is equal to the previous expression

The transcendental functions are as follows:
- `arccos(x)` is the inverse of the cosine function. It
outputs in whatever unit is specified (degrees or radians)
- `x^y` is the exponential function
- `logb(x)` is the logarithm, in any base. The argument
list is:
    - The number you want the log of
    - The base of the logarithm
- `mad` is the mean absolute difference. Enter the numbers
with commas separating them, or a data series
- `sinh(x)` is the hyperbolic sine function
- `σ` is the standard deviation of a **sample**.
Enter the samples with commas beteween them,
or a data series.


## Graphing
To graph, enter a univariate equation with `x` as the variable, for instance
`cos(x^2)`, and press the graph button in the right pane.

## Data series
Press the "+" button in the right pane to upload CSV files (which must have
one data series in the first column) to the calculator. You can then select
it in the bottom, and toggle between a view of the data in tabular form and
a histogram by clicking the graph button in the top right button of the pane.

Once a data series is imported, it can be dragged into the input window to 
be pasted there, for instance to be used as an argument to a call to 
standard deviation.


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
