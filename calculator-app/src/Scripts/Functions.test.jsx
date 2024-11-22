import {arcCos, sqrt} from './Functions'

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