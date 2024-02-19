# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Roadmap
- [x] Create NewPost page or component, so I can add fake data
- [ ] Use Firebase Storage to upload Images and Videos
- [x] Implement Firebase authentication
- [ ] Use Firebase Functions to fanout data
- [ ] Create a schema for the data model, hierarchy of subcollections and documents, and the data types in a file called `schema.ts`
- [ ] Create a modal dialog to show followers, following, or who likes

## Firebase Emulators for local development

Used Firebase emulators for local development and to persist data in the Firestore and Auth emulators I used export import approuch.

To export/import data in `/firebase-emulators` I used the following commands and added them to the `package.json` scripts section for easy access.

```bash
{
  "scripts": {
    "emulators:start": "firebase emulators:start --import firebase-emulators/ --export-on-exit firebase-emulators/"
  }
}
```