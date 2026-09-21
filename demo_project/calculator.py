"""Simple calculator module with intentional bug for demo purposes."""

class Calculator:
    """A simple calculator class."""

    def add(self, a: float, b: float) -> float:
        """Add two numbers."""
        return a + b

    def subtract(self, a: float, b: float) -> float:
        """Subtract b from a."""
        return a - b

    def multiply(self, a: float, b: float) -> float:
        """Multiply two numbers."""
        return a * b

    def divide(self, a: float, b: float) -> float:
        """Divide a by b. BUG: Doesn't handle division by zero."""
        # Intentional bug: no check for division by zero
        return a / b

    def power(self, base: float, exponent: float) -> float:
        """Raise base to the power of exponent."""
        return base ** exponent


def main():
    """Demo function to show calculator usage."""
    calc = Calculator()
    print("Calculator Demo")
    print(f"5 + 3 = {calc.add(5, 3)}")
    print(f"10 - 4 = {calc.subtract(10, 4)}")
    print(f"6 * 7 = {calc.multiply(6, 7)}")
    print(f"20 / 4 = {calc.divide(20, 4)}")
    print(f"2^8 = {calc.power(2, 8)}")
    # This will crash:
    # print(f"10 / 0 = {calc.divide(10, 0)}")


if __name__ == "__main__":
    main()