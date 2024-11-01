import {MathNode, ConstantNode, FunctionNode, OperatorNode} from 'mathjs';
import { arcCos } from './Functions';

export function evaluate_custom(root: MathNode): number {
    if (root instanceof ConstantNode) {
        return root.evaluate();
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
    } else {
        throw Error(`Don't recognize ${root.constructor.name} node type`);
    }
}

