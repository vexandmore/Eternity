def ln(x, terms=1000):
    """
    Approximating the natural logarithm (ln) of x using a series expansion.
    Valid for x > 0.
    """
    if x <= 0:
        raise ValueError("ln(x) is undefined for x <= 0")
    if x == 1:
        return 0.0

    # Use the transformation ln(x) = -ln(1/x) for x < 1 for better convergence
    if x < 1:
        return -ln(1 / x, terms)

    # Taylor series for ln(x) around 1: ln(x) = Σ ((-1)^(n+1) * (x-1)^n) / n
    z = (x - 1) / (x + 1)
    z_squared = z * z
    result = 0.0
    current_term = z

    for n in range(1, terms + 1):
        result += current_term / (2 * n - 1)
        current_term *= z_squared

    return 2 * result


def logb(x, b, terms=1000):
    """
    Computing log_b(x) using the natural logarithm approximation.
    """
    if x <= 0 or b <= 0:
        raise ValueError("log_b(x) is undefined for x <= 0 or b <= 0")
    if b == 1:
        raise ValueError("log_b(x) is undefined for b = 1")

    ln_x = ln(x, terms)
    ln_b = ln(b, terms)
    return ln_x / ln_b


if __name__ == "__main__":
    try:
        x = float(input("Enter the value of x: "))
        b = float(input("Enter the base (b): "))
        result = logb(x, b, terms=10000)  
        print(f"log_{b}({x}) = {result:.2f}")
    except ValueError as e:
        print(f"Error: {e}")
