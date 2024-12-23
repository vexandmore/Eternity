import {MathNode, ConstantNode, FunctionNode, OperatorNode, ParenthesisNode, SymbolNode} from 'mathjs';
import { factorial, arcCos, powerFunction, sin, sinh, cos, tan, PI, SD, MAD, sqrt, abs, Units, nth_root, log, lnAppx, eApprox} from './Functions';
import { parse } from "mathjs";
import { makeMessage } from "../Scripts/ParseErrorInterpreter";
import { DataSeries } from "../Pages/Calculator";

export class CalculatorContext {
    units: Units;
    previous_answer: number;
    data_series: DataSeries[];

    constructor(units: Units, previous_answer: number, data_series: DataSeries[]) {
        this.units = units;
        this.previous_answer = previous_answer;
        this.data_series = data_series;
    }
}

function getDataSeries(context: CalculatorContext, name: string): number[] {
    let dataSeries = context.data_series;
    let matchingSeries = dataSeries.filter((val) => val.name === name);
    if (matchingSeries.length > 0) {
        return matchingSeries[0].data.map((val) => parseFloat(val['0']));
    } else {
        throw Error(`No data series with name ${name}`);
    }
}

export function evaluate_custom(root: MathNode, context: CalculatorContext): number {
    if (root instanceof ConstantNode) {
        return Number(root.value);
    }

    if (root instanceof OperatorNode) {
        switch (root.fn) {
            case 'add':
                return evaluate_custom(root.args[0], context) + evaluate_custom(root.args[1], context);
            case 'subtract':
                return evaluate_custom(root.args[0], context) - evaluate_custom(root.args[1], context);
            case 'multiply':
                return evaluate_custom(root.args[0], context) * evaluate_custom(root.args[1], context);
            case 'divide':
                let numerator = evaluate_custom(root.args[0], context);
                let denominator = evaluate_custom(root.args[1], context);
                if (denominator == 0) {
                    throw Error("Cannot divide by 0");
                }
                return numerator/denominator;
            case 'pow':
                // special case for e^x
                let arg0 = root.args[0];
                if (arg0 instanceof SymbolNode && arg0.name === "e") {
                    return eApprox(evaluate_custom(root.args[1], context));
                } else {
                    return powerFunction(evaluate_custom(root.args[0], context), evaluate_custom(root.args[1], context));
                }
            case 'factorial':
                return factorial(evaluate_custom(root.args[0], context));
            case 'unaryMinus':
                return -1 * evaluate_custom(root.args[0], context);
            case 'unaryPlus':
                return evaluate_custom(root.args[0], context);
            default:
                throw Error(`Don't recognize ${root.fn} operator`);
        }
    } else if (root instanceof FunctionNode) {
        switch (root.fn.name) {
            case 'arccos':
                return arcCos(evaluate_custom(root.args[0], context), context.units);
            case 'sd':
                if (root.args[0] instanceof SymbolNode) {
                    // Have a data series
                    let seriesName = root.args[0].name;
                    let dataSeries = getDataSeries(context, seriesName);
                    return SD(dataSeries);
                } else {
                    // Evaluate each argument of SD and pass them as an array to the SD function
                    const values = root.args.map(arg => evaluate_custom(arg, context));
                    return SD(values);
                }
            case 'mad':
                if (root.args[0] instanceof SymbolNode) {
                    // Have a data series
                    let seriesName = root.args[0].name;
                    let dataSeries = getDataSeries(context, seriesName);
                    return MAD(dataSeries);
                } else {
                    // Evaluate each argument of SD and pass them as an array to the SD function
                    const values = root.args.map(arg => evaluate_custom(arg, context));
                    return MAD(values);
                }
            case 'sin':
                return sin(evaluate_custom(root.args[0], context), context.units);
            case 'cos':
                return cos(evaluate_custom(root.args[0], context), context.units);
            case 'tan':
                return tan(evaluate_custom(root.args[0], context), context.units); 
            case 'logb':
                if (root.args.length === 2) {
                    const base = evaluate_custom(root.args[1], context); // Pass context
                    const arg = evaluate_custom(root.args[0], context);  // Pass context
                    return log(arg, base);
                } else {
                        throw Error("Log function requires exactly two arguments: log(x, base)");
                }
            case 'ln':
                return lnAppx(evaluate_custom(root.args[0], context));
            case 'abs':
                return abs(evaluate_custom(root.args[0], context));
            case 'sqrt':
                return sqrt(evaluate_custom(root.args[0], context));
            case 'root':
                return nth_root(evaluate_custom(root.args[0], context), evaluate_custom(root.args[1], context));
            case 'sinh':
                return sinh(evaluate_custom(root.args[0], context));
            default:
                throw Error(`Don't recognize "${root.fn}" function`);
        }
    } else if (root instanceof SymbolNode) {
        switch (root.name) {
            case 'pi':
                return PI;
            case 'ANS':
                if (isNaN(context.previous_answer)) {
                    throw Error("Can't use ANS if have no previous answer");
                }
                return context.previous_answer;
            default:
                throw Error(`Don't recognize "${root.name}" symbol`);
        }
    } else if (root instanceof ParenthesisNode) {
        return evaluate_custom(root.content, context);
    } else {
        throw Error(`Internal processing error. Don't recognize ${root.constructor.name} node type`);
    }
}

// Return the parsing error, or "" if no error
export function makeErrorMessage(expr: string): string {
    try {
        // We parse, but don't care about the return value (we just case if it's successful)
        parse(expr);
        return "";
    } catch(e) {
        if (e instanceof SyntaxError) {
            return makeMessage(expr, e);
        } else {
            return String(e);
        }
    }
}