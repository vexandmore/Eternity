import {arcCos, sqrt, powerFunction, sinh, SD, log} from './Functions'

it('test sqrt', () => {
    expect(sqrt(2)).toBeCloseTo(1.41421356237, 11);
    expect(sqrt(3)).toBeCloseTo(1.73205080757, 11);
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


