export function powerFunction(b: number, x: number): number {
    let output = 1;
    let decimalPart = 0.0;
    let integerPart = x;
    let absX = Math.abs(x);

    if (x % 1 !== 0) {
        // Check if x has a decimal part
        integerPart = Math.floor(absX);
        decimalPart = absX - integerPart;
    }

    output = calcExp(b, integerPart);

    if (decimalPart !== 0.0) {
        output *= eApprox(decimalPart * lnApprox(b));
    }

    if (x >= 0 || x % 2 === 0) {
        return output;
    } else {
        return output;
    }
};
// Attach to global scope
(window as any).powerFunction = powerFunction;

function lnApprox(b: number): number {
    if (b > 0 && b < 2) {
        let x = b - 1;
        let term = x;
        let result = term;
        let n = 2;

        while (n < 20) {
            term *= -x;
            result += term / n;
            n++;
        }

        return result;
    } else {
        return lnApprox(b / 2) + 0.69314718056;
    }
};

function eApprox(x: number): number {
    let result = 1.0;
    let term = 1.0;
    let i = 1;

    while (i < 30) {
        term *= x / i;
        result += term;
        i++;
    }

    return result;
};

function calcExp(b: number, x: number): number {
    if (x === 0) {
        return 1;
    } else if (x % 2 === 0) {
        const temp = calcExp(b, Math.floor(x / 2));
        return temp * temp;
    } else {
        return b * calcExp(b, x - 1);
    }
}