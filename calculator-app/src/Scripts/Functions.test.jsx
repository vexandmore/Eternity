import {arcCos, sqrt, powerFunction, sinh, SD, log, cos, nth_root, MAD} from './Functions'
import { Units } from "../Scripts/Functions";

it('test sqrt', () => {
    expect(sqrt(2)).toBeCloseTo(1.41421356237, 11);
    expect(sqrt(3)).toBeCloseTo(1.73205080757, 11);
})

it('test nth root', () => {
    expect(nth_root(3, 8)).toBeCloseTo(2, 6);
    expect(nth_root(5, 12)).toBeCloseTo(1.64375183, 6);
})

it('test arccosine', () => {
    expect(arcCos(0)).toBeCloseTo(1.5707963, 6);
    expect(arcCos(0.1)).toBeCloseTo(1.4706289, 6);
    expect(arcCos(0.2)).toBeCloseTo(1.3694384, 6);
    expect(arcCos(0.3)).toBeCloseTo(1.2661037, 6);
    expect(arcCos(0.4)).toBeCloseTo(1.1592795, 6);
    expect(arcCos(0.5)).toBeCloseTo(1.0471976, 6);
    expect(arcCos(0.6)).toBeCloseTo(0.9272952, 6);
    expect(arcCos(0.7)).toBeCloseTo(0.7953988, 6);
    expect(arcCos(0.8)).toBeCloseTo(0.6435011, 6);
    expect(arcCos(0.9)).toBeCloseTo(0.4510268, 6);
    expect(arcCos(1.0)).toBeCloseTo(0, 6);
});

it('test arccos is inverse of cos', () => {
    expect(arcCos(cos(1.5, Units.RAD))).toBeCloseTo(1.5, 6);
    expect(arcCos(cos(1.0, Units.RAD))).toBeCloseTo(1.0, 6);
})

it('test power', () => {
    expect(powerFunction(2, 3)).toBeCloseTo(8, 6);
    expect(powerFunction(3.4, 2.3)).toBeCloseTo(16.6878931, 6);
    expect(powerFunction(5.6, 1.2)).toBeCloseTo(7.9036123, 6);
});

it('test sinh', () => {
    expect(sinh(1)).toBeCloseTo(1.175201, 6);
    expect(sinh(2)).toBeCloseTo(3.626860, 6);
    expect(sinh(4)).toBeCloseTo(27.2899171, 6);
});

it('test SD', () => {
    expect(SD([10, 12, 23, 23, 16, 23, 21, 16])).toBeCloseTo(5.2372293, 6);
    expect(SD([2, 4, 6, 7, 11, 10, 20])).toBeCloseTo(5.9401779675119, 6);
});

it('test MAD', () => {
    expect(MAD([1, 2, 3, 4, 5, 6, 8])).toBeCloseTo(1.8775510, 6);
    expect(MAD([13,45,45,65,102,562])).toBeCloseTo(141.1111111, 6);
});

it('test log', () => {
    expect(log(15, 10)).toBeCloseTo(1.176091259, 6);
    expect(log(20, 2)).toBeCloseTo(4.321928095, 6);
});
