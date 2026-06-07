# CLI Calculator

A simple command-line interface (CLI) calculator written in Python.

## Features

- Performs basic arithmetic operations: addition (`+`), subtraction (`-`), multiplication (`*`), and division (`/`).
- Includes input validation to ensure correct number and operator formats.
- Handles common errors such as division by zero and invalid input.
- Interactive mode allows continuous calculations until the user exits.

## Setup and Run

To set up and run the calculator, follow these steps:

1.  **Navigate to the directory**:

    ```bash
    cd testing
    ```

2.  **Run the calculator script**:

    ```bash
    python3 calculator.py
    ```

    _Note: Ensure you have Python 3 installed on your system. You might use `python` instead of `python3` depending on your environment configuration._

## Usage

Once the script is running, you will see a prompt like this:

```
Welcome to the CLI Calculator!
Enter expressions like '5 + 3' or '10 / 2'. Type 'exit' to quit.
Enter expression >
```

- Enter your arithmetic expression in the format `number operator number` (e.g., `15.5 * 2`).
- Press `Enter` to see the result.
- To quit the calculator, type `exit` and press `Enter`.

### Examples:

```
Enter expression > 10 + 5
Result: 10.0 + 5.0 = 15.0
Enter expression > 20 / 4
Result: 20.0 / 4.0 = 5.0
Enter expression > 7 * 3.5
Result: 7.0 * 3.5 = 24.5
Enter expression > 10 - 20
Result: 10.0 - 20.0 = -10.0
Enter expression > 5 / 0
Error: Cannot divide by zero!
Enter expression > hello + world
Error: Invalid number provided. 'hello' or 'world' is not a valid number.
Enter expression > 5 plus 3
Error: Invalid operator 'plus'. Supported operators are +, -, *, /.
Enter expression > exit
Exiting calculator. Goodbye!
```
