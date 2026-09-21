"""Tests for the calculator module."""

import pytest
from calculator import Calculator


class TestCalculator:
    """Test cases for Calculator class."""

    def setup_method(self):
        """Set up test fixtures."""
        self.calc = Calculator()

    def test_add(self):
        """Test addition."""
        assert self.calc.add(2, 3) == 5
        assert self.calc.add(-1, 1) == 0
        assert self.calc.add(0, 0) == 0

    def test_subtract(self):
        """Test subtraction."""
        assert self.calc.subtract(10, 4) == 6
        assert self.calc.subtract(5, 10) == -5

    def test_multiply(self):
        """Test multiplication."""
        assert self.calc.multiply(3, 4) == 12
        assert self.calc.multiply(-2, 5) == -10
        assert self.calc.multiply(0, 100) == 0

    def test_divide(self):
        """Test division."""
        assert self.calc.divide(20, 4) == 5
        assert self.calc.divide(10, 2) == 5
        assert self.calc.divide(7, 2) == 3.5

    def test_divide_by_zero(self):
        """Test division by zero raises exception."""
        with pytest.raises(ZeroDivisionError):
            self.calc.divide(10, 0)

    def test_power(self):
        """Test power function."""
        assert self.calc.power(2, 3) == 8
        assert self.calc.power(5, 0) == 1
        assert self.calc.power(2, 0.5) == 1.4142135623730951  # sqrt(2)