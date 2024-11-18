import {MathNode, ConstantNode, FunctionNode, OperatorNode, ParenthesisNode, SymbolNode} from 'mathjs';
import { factorial, arcCos, powerFunction, sin, sinh, cos, tan, PI, SD, sqrt, abs, Units, nth_root, logBase} from './Functions';

export class CalculatorContext {
    units: Units;
    previous_answer: number;

    constructor(units: Units, previous_answer: number) {
        this.units = units;
        this.previous_answer = previous_answer;
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
                return evaluate_custom(root.args[0], context) / evaluate_custom(root.args[1], context);
            case 'pow':
                return powerFunction(evaluate_custom(root.args[0], context), evaluate_custom(root.args[1], context));
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
            case 'acos':
                return arcCos(evaluate_custom(root.args[0], context));
            case 'SD':
            // Evaluate each argument of SD and pass them as an array to the SD function
             const values = root.args.map(arg => evaluate_custom(arg, context));
            return SD(values);
            case 'sin':
                return sin(evaluate_custom(root.args[0], context), context.units);
            case 'cos':
                return cos(evaluate_custom(root.args[0], context), context.units);
            case 'tan':
                return tan(evaluate_custom(root.args[0], context), context.units); 
            case 'log':
                if (root.args.length === 2) {
                    const base = evaluate_custom(root.args[1], context); // Pass context
                    const arg = evaluate_custom(root.args[0], context);  // Pass context
                    return logBase(arg, base);
                } else {
                        throw Error("Log function requires exactly two arguments: log(x, base)");
                    }
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

