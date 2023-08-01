# [Working In Progress] Joke Factory Client

# The React App Overview

- Styling
  I'm using TailwindCSS.

# Development

First of all, for testing here are the libraries that we should install:

```
 "@testing-library/jest-dom": "^5.16.5",
  "@testing-library/react": "^14.0.0",
  "@testing-library/user-event": "^14.4.3",
  "@types/jest": "^29.5.2",
  "jest": "^29.6.1",
  "jest-environment-jsdom": "^29.6.1",
  "ts-jest": "^29.1.1",
```

Here's a great blog to set it up: [jest-vite](https://hung.dev/posts/jest-vite)

For Linting & also formatting, I'm using the guidelines from this blog: [setting EsLint](https://github.com/CodingGarden/react-ts-starter), and here's the YouTube Video : [Youtube](https://www.youtube.com/watch?v=cchqeWY0Nak)

Don't forget to create a folder `.vscode` and add this line for TypeScript React. If not, prettier won't detect it.

```
{
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
  },
}
```

## Updating Dependency

To ensure security and also performance, regularly check: `npx npm-check-updates` to check dependency. Then update it either using :

- `npx npm-check-updates --reject <package> -u`
- `npx npm-check-updates --filter <package> -u`
  Here's the guidance: [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)

# TDD Process

Here's the document for the [TDD Process](./src/__docs__/TDD-Process/).

# Journal

- July 22 2023 - Setting Up The client Project
  Let's begin this. Start the app with Vite 🌩️. After considering, I think I need to learn properly to do the TDD at React. Instead of trial and error, with the proper guidance, I can use this as a starting point and expand it.
- July 30 2023 - Just reinstalling my Windows & WSl.
