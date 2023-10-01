# Generate PDF For Seo Audit Report

Codewalnut leads an open-source project offering a high-quality Node.js boilerplate. It's accessible for developers to use and customize as per their needs.

## Working

In this Node.js application we get a data from Airtable on the basis of table id, coming from frontend NextJs (repo link: https://github.com/CW-Codewalnut/seo-audit-tool-next ). Once we get a data from Airtable we do some color coding and calculations, then we pass that data into out PDF template.

## Technologies

### Core

- [TypeScript](https://www.typescriptlang.org/) - a superset of JavaScript that adds static typing. This allows for more robust code and better developer experience.

- [puppeteer] - we are using Puppeteer to render web pages as PDF documents.

- [handlebars] - it allows you to generate dynamic HTML content by defining templates with placeholders for data.

### Testing

- [Jest](https://jestjs.io/) - for running tests. Jest is a JavaScript testing framework that allows for running tests.

### Linting & Formatting

- [ESLint](https://eslint.org/) - for linting. ESLint is a linter that checks for common errors and code smells in JavaScript code.

- [Prettier](https://prettier.io/) - for formatting. Prettier is a code formatter that automatically formats JavaScript code.

## Getting Started

---

First, install the app dependencies:

```
npm install
```

Then, you can run the development server with the command:

```
npm run dev
```