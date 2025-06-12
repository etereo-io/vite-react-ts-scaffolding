# React + TypeScript + Vite

This is a scaffolding project for building a React application using TypeScript and Vite. It includes various tools and configurations to streamline development, linting, testing, and building processes.

## Getting Started

### Prerequisites

- Node.js (>=16.0.0)
- npm (>=10.8.0)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/vite-react-ts-scaffolding.git
   cd vite-react-ts-scaffolding
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Development

To start the development server:

```sh
npm start
```

This will start the Vite development server and open the application in your default web browser.

### Building

To create a production build:

```sh
npm run build
```

This will compile the TypeScript files and bundle the application using Vite.

### Linting

To lint the project:

```sh
npm run lint
```

To fix linting errors:

```sh
npm run lint:fix
```

### Type Checking

To check for type errors:

```sh
npm run types:check
```

### Dependency Cruising

To check for circular dependencies:

```sh
npm run lint:deps
```

### Git Hooks

Pre-commit checks (type checking and dependency linting) are enforced using Husky and lint-staged:

```sh
npm run git:pre-commit
```

### Testing

To run the tests:

```sh
npm run test
```

To run the tests with coverage:

```sh
npm run test:coverage
```

To run the tests with a UI:

```sh
npm run test:ui
```

### Preview

To preview the production build:

```sh
npm run preview
```

## Dependencies

### Core Dependencies

- React
- React DOM
- React Router DOM
- Emotion (for CSS-in-JS)
- Tailwind
- React Query (for data fetching)
- i18next (for internationalization)

### Development Dependencies

- TypeScript
- Vite
- BiomeJS (with plugins for TypeScript, React, and Prettier)
- Vitest (for testing)
- Testing Library (for testing React components)
- Husky (for Git hooks)
- Lint-staged (for running linters on staged files)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
