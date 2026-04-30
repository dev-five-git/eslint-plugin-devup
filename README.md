# eslint-plugin-devup

`devup` is a system for faster and more accurate software development used at DevFive.

`eslint-plugin-devup` helps you develop software quickly and accurately.

For details on each rule, please refer to the files in the `src/rules` directory.

As this was originally used internally and has now been made public, some rules exist for company-specific systems.

All rules are provided as `named exports` so you can use only the rules you want.

## Installation

```bash
bun add -d eslint-plugin-devup
```

## Usage

### ESLint

Create an `eslint.config.mjs` file in your project root.

```js
import { configs } from "eslint-plugin-devup";

export default configs.recommended;
```

### Oxlint

Create an `oxlint.config.ts` file in your project root.

```ts
import devupConfig from 'eslint-plugin-devup/oxlint-config'

export default devupConfig
```

Use the `eslint-plugin-devup/oxlint-config` export instead of importing a file path from `node_modules`. The package only publishes `dist`, and this export points to the built config while still generating rules dynamically from the installed plugin versions.

`oxlint.config.ts` is loaded by Oxlint through Node.js, so CI should use the latest Node.js when running `oxlint`.

If you need project-specific overrides, extend the config object.

```ts
import { defineConfig } from 'oxlint'
import devupConfig from 'eslint-plugin-devup/oxlint-config'

export default defineConfig({
  extends: [devupConfig],
  rules: {
    'no-console': 'off',
  },
})
```

## Test

Coverage score must be 100%.

```bash
bun test
```

## Contributing

- When adding or modifying rules, add or modify files in the `src/rules` directory.
- When adding or modifying rules, add a description of the rule in `README.md`.

All opinions and contributions are welcome.

## Join the Community

[Discord](https://discord.gg/8zjcGc7cWh)
