# pulkitxm.com

This repository hosts a modern web application built with Next.js, initialized using create-next-app. The project primarily utilizes TypeScript, ensuring robust type-checking and a seamless developer experience.

## Table of Contents

- [pulkitxm.com](#pulkitxmcom)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Method 1: Using Docker (Recommended)](#method-1-using-docker-recommended)
    - [Method 2: Traditional Setup](#method-2-traditional-setup)
  - [Usage](#usage)
  - [Scripts](#scripts)
  - [Project Structure](#project-structure)
  - [Deployment](#deployment)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

Choose one of the following installation methods:

### Method 1: Using Docker (Recommended)

```bash
docker run -p 3000:3000 ghcr.io/pulkitxm/pulkitxm.com:latest
```

Then open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Method 2: Traditional Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Pulkitxm/pulkitxm.com.git
   cd pulkitxm.com
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` using the `.env.example` file:
   ```bash
    cp .env.example .env
   ```

## Usage

To start the development server, run:

```bash
npm run dev
```

Then open http://localhost:3000 in your browser to see the application.

## Scripts

The following npm scripts are available to streamline development and production workflows:

- `dev`: Starts the development server with turbo mode.
- `clean`: Removes the `.next` and `node_modules` directories.
- `ins:clean`: Cleans the project and installs dependencies using pnpm.
- `dev:clean`: Cleans the project, installs dependencies, and starts the development server.
- `build`: Builds the application for production.
- `build:clean`: Cleans the project, installs dependencies, and builds the application.
- `start`: Runs the built application in production mode.
- `serve`: Builds the application and starts it in production mode.
- `serve:clean`: Cleans, builds, and starts the application in production mode.
- `lint`: Runs ESLint to check for linting errors.
- `format`: Formats the codebase using Prettier.
- `check`: Checks the code formatting using Prettier.
- `prepare`: Prepares the project for husky.

## Project Structure

```txt
.
├── .github/        # GitHub Actions workflows
├── .husky/         # Git hooks
├── public/         # Static assets
├── src/
│   ├── actions/    # Server actions
│   ├── app/        # Next.js app router pages
│   │   ├── api/    # API routes
│   │   └── [...routes]/ # App routes
│   ├── assets/     # Asset imports and configs
│   ├── components/ # React components
│   │   ├── ui/     # Reusable UI components
│   │   └── [...components]/ # Feature components
│   ├── data/       # Data and configurations
│   ├── lib/        # Utility functions
│   └── types/      # TypeScript types
├── .dockerignore   # Docker ignore rules
├── .env.example    # Environment variables example
├── .eslintrc.json  # ESLint configuration
├── .gitignore      # Git ignore rules
├── .prettierrc     # Prettier configuration
├── components.json # UI components config
├── Dockerfile      # Docker configuration
├── next.config.mjs # Next.js configuration
├── package.json    # Project dependencies
├── pnpm-lock.yaml  # pnpm lock file
├── tailwind.config.ts # Tailwind configuration
├── tsconfig.json   # TypeScript configuration
└── README.md       # Project documentation
```

## Deployment

To deploy the application, build the project and deploy the contents of the out directory to your preferred hosting service:

```bash
npm run build
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:

```sh
git checkout -b feature/your-feature
```

3. Commit your changes:

```sh
git commit -m 'Add some feature'
```

4. Push to the branch:

```sh
git push origin feature/your-feature
```

5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
