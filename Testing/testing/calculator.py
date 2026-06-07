#!/usr/bin/env python3

import sys

def calculate(num1, operator, num2):
    """Performs the specified arithmetic operation and returns the result."""
    if operator == '+':
        return num1 + num2
    elif operator == '-':
        return num1 - num2
    elif operator == '*':
        return num1 * num2
    elif operator == '/':
        if num2 == 0:
            raise ZeroDivisionError("Error: Cannot divide by zero!")
        return num1 / num2
    else:
        raise ValueError(f"Error: Invalid operator '{operator}'. Supported operators are +, -, *, /.")

def main():
    """Main function to run the CLI calculator."""
    print("Welcome to the CLI Calculator!")
    print("Enter expressions like '5 + 3' or '10 / 2'. Type 'exit' to quit.")

    while True:
        try:
            user_input = input("Enter expression > ").strip()

            if user_input.lower() == 'exit':
                print("Exiting calculator. Goodbye!")
                break

            # Split the input into parts
            parts = user_input.split()

            # Input validation: check for exactly three parts (number, operator, number)
            if len(parts) != 3:
                print("Error: Invalid input format. Please use 'number operator number' (e.g., '5 + 3').")
                continue

            num1_str, operator, num2_str = parts

            # Input validation: ensure numbers are valid floats
            try:
                num1 = float(num1_str)
                num2 = float(num2_str)
            except ValueError:
                print(f"Error: Invalid number provided. '{num1_str}' or '{num2_str}' is not a valid number.")
                continue

            # Perform the calculation
            result = calculate(num1, operator, num2)
            print(f"Result: {num1} {operator} {num2} = {result}")

        except ZeroDivisionError as e:
            print(e)
        except ValueError as e:
            print(e)
        except Exception as e:
            print(f"An unexpected error occurred: {e}")

if __name__ == '__main__':
    main()
