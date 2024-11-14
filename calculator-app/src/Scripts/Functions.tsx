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

let A_terms: number[] = [1.5707963050, -0.2145988016, 0.0889789874, -0.0501743046,
    0.0308918810, -0.0170881256, 0.0066700901, -0.0012624911];
export function arcCos(x: number): number {
    let negative: boolean = x < 0.0;
    x = Math.abs(x);
    let result: number = 0.0;
    let x_power_n: number = 1.0;
    for (let a of A_terms) {
        result += a * x_power_n;
        x_power_n *= x;
    }
    result = Math.sqrt(1 - x) * result;

    if (negative) {
        // If negative input, need to use the result
        // we got from the positive value and convert
        return Math.PI - result;
    } else {
        return result;
    }
}

export function factorial(n: number): number {
    if (Math.floor(n) !== n) {
        throw Error("Can only take factorial of an integer");
    }
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

export function sqrt(n: number): number {
    return powerFunction(n, 1/2.0);
}

export function abs(n: number): number {
    return n < 0 ? -n : n;
}

export enum Units {
    DEG,
    RAD
}

export const PI = 3.141592653589793;

// Reduce x into range [0, 2*pi]
function reduce_to_2pi(x: number): number {
    if (x >= 0 && x <= 2 * PI) {
        return x;
    } else if (x > (2 * PI)) {
        return x % (2*PI);
    } else {
        return (2 * PI) - (abs(x) % 2 * PI);
    }
}

function convert_to_rad(x: number, units: Units): number {
    if (units == Units.RAD) {
        return x;
    } else {
        return x * (PI / 180);
    }
}

export function sin(x: number, units: Units, terms: number = 25) : number {
    x = convert_to_rad(x, units);
    x = reduce_to_2pi(x);
    let result: number = 0;

    for (let i = 0; i < terms; i++) {
        // Calculate the power and factorial
        const power: number = 2 * i + 1;
        const term: number = powerFunction(x, power) / factorial(power);

        // Alternate between adding and subtracting terms
        if (i % 2 === 0) {
            result += term;
        } else {
            result -= term;
        }
    }
    // Clamp result to 0 or 1 if very close
    if (abs(result - 0.0) < 1e-14) {
        return 0.0;
    } else if (abs(result - 1.0) < 1e-14) {
        return 1.0;
    }
    return result;
}

export function cos(x: number, units: Units, terms: number = 25): number {
    return sin(x + (PI / 2), terms, units);
}

export function tan(x: number, units: Units, terms: number = 25): number {
    return sin(x, terms, units) / cos(x, terms, units);
}

// let sdArray: number[] = []; // Global array to store values

// export function addValue(value: number): void {
//     // Add the new value to sdArray
//     sdArray.push(value);
// }
export function SD(values: number[]): number {
    if (values.length === 0) {
        throw new Error("Array is empty. Add values before calculating SD.");
    }
    //n = population size
    let n = values.length;
    let sum = values.reduce((accumulator, currentValue) => accumulator + currentValue, 0); 
    let mean = sum / n;
    let variance = values.reduce((accumulator, currentValue) => accumulator + Math.pow(currentValue - mean, 2), 0) / n;
    let sd = Math.sqrt(variance);
    return sd;
}
