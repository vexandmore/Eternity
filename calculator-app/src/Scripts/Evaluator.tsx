import {MathNode, ConstantNode, FunctionNode, OperatorNode, ParenthesisNode} from 'mathjs';
import { arcCos, powerFunction, SD} from './Functions';

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
            default:
                throw Error(`Don't recognize ${root.fn} operator`);
        }
    } else if (root instanceof FunctionNode) {
        switch (root.fn.name) {
            case 'acos':
                return arcCos(evaluate_custom(root.args[0]));
            // Sin, cos, and tan use built-in since we don't need to have a custom
            // implementation for them (only for our transcendental functions).
            case 'SD':
            // Evaluate each argument of SD and pass them as an array to the SD function
             const values = root.args.map(arg => evaluate_custom(arg));
            return SD(values);
            case 'sin':
                return Math.sin(evaluate_custom(root.args[0]));
            case 'cos':
                return Math.cos(evaluate_custom(root.args[0]));
            case 'tan':
                return Math.tan(evaluate_custom(root.args[0]));
            default:
                throw Error(`Don't recognize "${root.fn}" function`);
        }
    } else if (root instanceof ParenthesisNode) {
        return evaluate_custom(root.content);
    } else {
        throw Error(`Internal processing error. Don't recognize ${root.constructor.name} node type`);
    }
}

