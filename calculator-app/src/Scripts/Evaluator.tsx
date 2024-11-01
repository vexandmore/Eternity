import {MathNode, ConstantNode, FunctionNode, OperatorNode, ParenthesisNode} from 'mathjs';
import { arcCos, powerFunction } from './Functions';

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
            default:
                throw Error(`Don't recognize "${root.fn}" function`);
        }
    } else if (root instanceof ParenthesisNode) {
        return evaluate_custom(root.content);
    } else {
        throw Error(`Don't recognize ${root.constructor.name} node type`);
    }
}

