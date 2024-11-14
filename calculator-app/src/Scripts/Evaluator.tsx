import {MathNode, ConstantNode, FunctionNode, OperatorNode, ParenthesisNode, SymbolNode} from 'mathjs';
import { factorial, arcCos, powerFunction, sin, cos, tan, PI, SD, sqrt, abs, Units } from './Functions';


export function evaluate_custom(root: MathNode, units: Units): number {
    if (root instanceof ConstantNode) {
        return Number(root.value);
    }

    if (root instanceof OperatorNode) {
        switch (root.fn) {
            case 'add':
                return evaluate_custom(root.args[0], units) + evaluate_custom(root.args[1], units);
            case 'subtract':
                return evaluate_custom(root.args[0], units) - evaluate_custom(root.args[1], units);
            case 'multiply':
                return evaluate_custom(root.args[0], units) * evaluate_custom(root.args[1], units);
            case 'divide':
                return evaluate_custom(root.args[0], units) / evaluate_custom(root.args[1], units);
            case 'pow':
                return powerFunction(evaluate_custom(root.args[0], units), evaluate_custom(root.args[1], units));
            case 'factorial':
                return factorial(evaluate_custom(root.args[0], units));
            case 'unaryMinus':
                return -1 * evaluate_custom(root.args[0], units);
            case 'unaryPlus':
                return evaluate_custom(root.args[0], units);
            default:
                throw Error(`Don't recognize ${root.fn} operator`);
        }
    } else if (root instanceof FunctionNode) {
        switch (root.fn.name) {
            case 'acos':
                return arcCos(evaluate_custom(root.args[0], units));
            case 'SD':
            // Evaluate each argument of SD and pass them as an array to the SD function
             const values = root.args.map(arg => evaluate_custom(arg, units));
            return SD(values);
            case 'sin':
                return sin(evaluate_custom(root.args[0], units), units);
            case 'cos':
                return cos(evaluate_custom(root.args[0], units), units);
            case 'tan':
                return tan(evaluate_custom(root.args[0], units), units);
            case 'abs':
                return abs(evaluate_custom(root.args[0], units));
            case 'sqrt':
                return sqrt(evaluate_custom(root.args[0], units));
            default:
                throw Error(`Don't recognize "${root.fn}" function`);
        }
    } else if (root instanceof SymbolNode) {
        switch (root.name) {
            case 'pi':
                return PI;
            default:
                throw Error(`Don't recognize "${root.name}" symbol`);
        }
    } else if (root instanceof ParenthesisNode) {
        return evaluate_custom(root.content, units);
    } else {
        throw Error(`Internal processing error. Don't recognize ${root.constructor.name} node type`);
    }
}

