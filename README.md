# ProofFlow

**An interactive propositional logic workspace built with React, TypeScript, and Node.js.**

ProofFlow allows users to write logical expressions, explore their abstract syntax trees (ASTs), assign values to logical variables, and evaluate expressions interactively.

The project is designed as a lightweight foundation for exploring formal logic and proof-oriented workflows.

## Features

- **Logical Expression Editor:** Write propositional logic expressions using `AND`, `OR`, `NOT`, and implication (`->`).
- **Tokenizer:** Converts input expressions into tokens for parsing.
- **Recursive Descent Parser:** Parses expressions while respecting operator precedence and associativity.
- **AST Visualization:** Displays the abstract syntax tree representing the parsed expression.
- **Variable Extraction:** Automatically identifies unique variables used in an expression.
- **Variable Assignments:** Assign Boolean values (`TRUE` or `FALSE`) to each variable.
- **Expression Evaluation:** Evaluates logical expressions based on the assigned values.
- **Input Validation:** Detects malformed expressions and reports meaningful parsing errors.
- **Example Expressions:** Provides valid and invalid examples to explore parser behavior.

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS v4

### Shared Package

- TypeScript
- Zod
- Vitest

### Planned Backend


- Node.js
- TypeScript
- Effect (Effect-TS)

### Development Tools

- npm Workspaces
- Git
- ESLint
- Vitest

## Project Structure

```text
proofflow/
|-- apps/
|   |-- web/                  # React frontend
|   |-- api/                  # Node.js backend (planned)
|
|-- packages/
|   |-- shared/               # Shared types, schemas, parser and evaluator
|
|-- package.json              # Root workspace configuration
|-- package-lock.json
|-- tsconfig.base.json        # Shared TypeScript configuration
|-- README.md
```

The project uses **npm Workspaces** to manage multiple applications and shared packages within a single repository.

The `packages/shared` workspace contains reusable logic and types that can be consumed by both the frontend and backend.

## Getting Started

### Prerequisites

- Node.js (v22 or later recommended)
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/SyedAzlanzar/proofflow.git
cd proofflow
```

Install dependencies from the project root:

```bash
npm install
```

### Run the Frontend

Start the Vite development server:

```bash
npm run dev:web
```

Open the local URL displayed in your terminal (usually `http://localhost:5173`).

### Run Tests

Run the shared package tests:

```bash
npm run test --workspace=@proofflow/shared
```

Run the frontend tests:

```bash
npm run test --workspace=@proofflow/web
```

## Project Status

<badge color="success">Frontend implemented</badge> <badge color="warning">Backend in progress</badge>

The current frontend supports expression parsing, AST visualization, variable assignments, and logical evaluation.

The backend and persistent storage are planned for the next development phase.

## Current Limitations

- Supports a limited subset of propositional logic: `AND`, `OR`, `NOT`, and `->`.
- Does not currently support quantifiers, predicates, or first-order logic.
- AST visualization represents the syntactic structure of an expression; it is not a verified proof.
- Evaluation determines truth values for given variable assignments; it does not perform formal theorem proving.
- Expressions are currently processed locally in the frontend.

## Future Improvements

- Backend API using Node.js and Effect.
- Persistent storage for expressions and evaluation history.
- Improved proof-oriented workflows.
- Potential integration with external theorem-proving tools.

## License

This project is currently under development.
