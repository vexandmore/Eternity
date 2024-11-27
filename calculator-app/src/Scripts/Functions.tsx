export function powerFunction(b: number, x: number): number {
    if (b < 0 && x % 1 !== 0) {
        throw new Error("Fractional exponents for negative bases result in complex numbers, which are not supported.");
    }

    let output = 1;
    let decimalPart = 0.0;
    let integerPart = Math.floor(Math.abs(x));
    let absX = Math.abs(x);

    if (x % 1 !== 0) {
        // If x has a decimal part
        decimalPart = absX - integerPart;
    }

    // Calculate the positive exponent part
    output = calcExp(Math.abs(b), integerPart);

    if (decimalPart !== 0.0) {
        // Approximate fractional exponent part using e^x
        output *= eApprox(decimalPart * lnApprox(Math.abs(b)));
    }

    // If the exponent is negative, return the reciprocal of the result
    if (x < 0) {
        output = 1 / output;
    }

    // Handle the sign of the base for integer exponents
    if (b < 0 && x % 2 !== 0) {
        output = -output;
    }

    return output;
}

// Helper function for logarithm approximation
function lnApprox(b: number): number {
    if (b > 0 && b < 2) {
        let x = b - 1;
        let term = x;
        let result = term;
        let n = 2;

        while (n < 50) {
            term *= -x;
            result += term / n;
            n++;
        }

        return result;
    } else {
        return lnApprox(b / 2) + 0.69314718056; // Approximate ln(x) for b >= 2
    }
}

// Exponential approximation (for fractional exponents)
export function eApprox(x: number): number {
    let result = 1.0;
    let term = 1.0;
    let i = 1;

    while (i < 50) {
        term *= x / i;
        result += term;
        i++;
    }

    return result;
}

// Efficient Exponentiation for Integer Exponents (Exponentiation by Squaring)
function calcExp(b: number, x: number): number {
    if (x === 0) {
        return 1;
    }

    let result = 1;
    let base = b;

    // Exponentiation by squaring
    while (x > 0) {
        if (x % 2 === 1) {
            result *= base;
        }
        base *= base;
        x = Math.floor(x / 2);
    }

    return result;
}


let A_terms: number[] = [1.5707963050, -0.2145988016, 0.0889789874, -0.0501743046,
    0.0308918810, -0.0170881256, 0.0066700901, -0.0012624911];
export function arcCos(x: number, units: Units): number {
    let negative: boolean = x < 0.0;
    x = Math.abs(x);
    let result: number = 0.0;
    let x_power_n: number = 1.0;
    for (let a of A_terms) {
        result += a * x_power_n;
        x_power_n *= x;
    }
    result = sqrt(1 - x) * result;

    if (negative) {
        // If negative input, need to use the result
        // we got from the positive value and convert
        return convert_out_of_rad(Math.PI - result, units);
    } else {
        return convert_out_of_rad(result, units);
    }
}

export function factorial(n: number): number {
    if (Math.floor(n) !== n) {
        throw Error("Can only take factorial of an integer");
    }
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Since this is used in arc cosine, implement
// special case to get more accuracy.
export function sqrt(n: number, iterations: number = 50): number {
    let guess = 1.0;
    for (let i = 0; i < iterations; i++) {
        guess = 1/2 * (guess + (n / guess));
    }
    return guess;
}

export function nth_root(nth: number, n: number) {
    return powerFunction(n, 1/nth);
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
        return (2 * PI) + (x % (2 * PI));
    }
}

function convert_to_rad(x: number, units: Units): number {
    if (units === Units.RAD) {
        return x;
    } else {
        return x * (PI / 180);
    }
}

function convert_out_of_rad(x: number, units: Units): number {
    if (units === Units.RAD) {
        return x;
    } else {
        return x * (180 / PI);
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
    return result;
}

export function cos(x: number, units: Units, terms: number = 25): number {
    x = convert_to_rad(x, units);
    x = x + (PI / 2.0);
    return sin(x, Units.RAD, terms);
}

export function tan(x: number, units: Units, terms: number = 25): number {
    return sin(x, units, terms) / cos(x, units, terms);
}


export function SD(values: number[]): number {
    if (values.length === 0) {
        throw new Error("Array is empty. Add values before calculating SD.");
    }
    let n = values.length;
    let sum = values.reduce((accumulator, currentValue) => accumulator + currentValue, 0); 
    let mean = sum / n;
    let variance = values.reduce((accumulator, currentValue) => accumulator + Math.pow(currentValue - mean, 2), 0) / (n-1);
    let sd = Math.sqrt(variance);
    return sd;
}


  
export function log(x: number, b: number, terms: number = 100): number {
    if (x <= 0 || b <= 0) {
        throw new Error("logBase is undefined for x <= 0 or b <= 0");
    }
    if (b === 1) {
        throw new Error("logBase is undefined for b = 1");
    }
    //taylor series approximation
    const lnX = lnAppx(x, terms);
    const lnB = lnAppx(b, terms);
    // log_b(x) = ln(x) / ln(b)
    return lnX / lnB;
}

//this function is helps to calculate the logbfunction
export function lnAppx(x: number, terms: number = 100): number {
    if (x <= 0) {
        throw new Error("ln is undefined for x <= 0");
    }
    if (x === 1) {
        return 0.0;
    }
    //ln(x) = -ln(1/x) for x < 1 for better convergence
    if (x < 1) {
        return -lnAppx(1 / x, terms);
    }
    //ln(x) = 2 * Σ [((x - 1) / (x + 1))^(2n - 1) / (2n - 1)]
    const z = (x - 1) / (x + 1);
    const zSquared = z * z;
    let result = 0.0;
    let currentTerm = z;
    for (let n = 1; n <= terms; n++) {
        result += currentTerm / (2 * n - 1);
        currentTerm *= zSquared;
    }
    return 2 * result;
}

  
  
export function sinh(x: number): number {
    const expX = eApprox(x);
    const expNegX = eApprox(-x);
    return (expX - expNegX) / 2;
}

export function MAD(values: number[]): number {
    if (values.length === 0) {
        throw new Error("Array is empty. Add values before calculating MAD.");
    }

    const mean: number = values.reduce((acc: number, val: number) => acc + val, 0) / values.length;

    const absoluteDeviations: number[] = values.map((value: number) => Math.abs(value - mean));

    return absoluteDeviations.reduce((acc: number, val: number) => acc + val, 0) / values.length;
}
