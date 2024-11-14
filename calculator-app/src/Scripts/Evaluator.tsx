import {MathNode, ConstantNode, FunctionNode, OperatorNode, ParenthesisNode, SymbolNode} from 'mathjs';
import { factorial, arcCos, powerFunction, sin, cos, tan, PI, SD, sqrt, abs } from './Functions';


export function evaluate_custom(root: MathNode): number {
    if (root instanceof ConstantNode) {
        return Number(root.value);
    }

    if (root instanceof OperatorNode) {
        switch (root.fn) {
            case 'add':
                return evaluate_custom(root.args[0]) + evaluate_custom(root.args[1]);
            case 'subtract':
                return evaluate_custom(root.args[0]) - evaluate_custom(root.args[1]);
            case 'multiply':
                return evaluate_custom(root.args[0]) * evaluate_custom(root.args[1]);
            case 'divide':
                return evaluate_custom(root.args[0]) / evaluate_custom(root.args[1]);
            case 'pow':
                return powerFunction(evaluate_custom(root.args[0]), evaluate_custom(root.args[1]));
            case 'factorial':
                return factorial(evaluate_custom(root.args[0]));
            case 'unaryMinus':
                return -1 * evaluate_custom(root.args[0]);
            case 'unaryPlus':
                return evaluate_custom(root.args[0]);
            default:
                throw Error(`Don't recognize ${root.fn} operator`);
        }
    } else if (root instanceof FunctionNode) {
        switch (root.fn.name) {
            case 'acos':
                return arcCos(evaluate_custom(root.args[0]));
            case 'SD':
            // Evaluate each argument of SD and pass them as an array to the SD function
             const values = root.args.map(arg => evaluate_custom(arg));
            return SD(values);
            case 'sin':
                return sin(evaluate_custom(root.args[0]));
            case 'cos':
                return cos(evaluate_custom(root.args[0]));
            case 'tan':
                return tan(evaluate_custom(root.args[0]));
            case 'abs':
                return abs(evaluate_custom(root.args[0]));
            case 'sqrt':
                return sqrt(evaluate_custom(root.args[0]));
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
        return evaluate_custom(root.content);
    } else {
        throw Error(`Internal processing error. Don't recognize ${root.constructor.name} node type`);
    }
}

