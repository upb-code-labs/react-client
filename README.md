# React Client

<p align="center">
<a href="https://github.com/upb-code-labs/react-client/actions/workflows/release.yaml">
   <img alt="Github Actions Release Status" src="https://img.shields.io/github/actions/workflow/status/upb-code-labs/react-client/tagging.yaml?label=release">
</a>
<a href="https://github.com/upb-code-labs/react-client/actions/workflows/tagging.yaml">
   <img alt="Github Actions Tagging Status" src="https://img.shields.io/github/actions/workflow/status/upb-code-labs/react-client/tagging.yaml?label=tagging">
</a>
<a href="https://github.com/upb-code-labs/react-client/actions/workflows/integration.yaml">
   <img alt="Github Actions Integration Status" src="https://img.shields.io/github/actions/workflow/status/upb-code-labs/react-client/integration.yaml?label=integration">
</a>
<a href="https://github.com/prettier/prettier">
   <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">
</a>
<a href="https://github.com/eslint/eslint">
   <img alt="linter: eslint" src="https://img.shields.io/badge/linter-eslint-7C7CEA.svg?style=flat-square">
</a>
<a href="https://github.com/microsoft/playwright">
   <img alt="testing: playwright" src="https://img.shields.io/badge/testing-playwright-A6D388.svg?style=flat-square">
</a>
<a href="https://github.com/shadcn-ui/ui">
   <img alt="UI library: shadcn/ui" src="https://img.shields.io/badge/UI_library-shadcn/ui-000.svg?style=flat-square">
</a>
</p>

## Development

1. Install dependencies:

```bash
pnpm install
```

2. Start database and micro-services:

```bash
docker-compose up
```

3. Start the development server:

```bash
pnpm dev
```

## Testing

Write your tests under `e2e` directory. You can run your tests in UI mode with:

```bash
pnpm test:open
```

Or you can run your tests in headless mode with:

```bash
pnpm test:run
```

It's recommended to remove `docker-compose` cache and re-start the services before running tests:

```bash
docker rm $(docker ps -qa) && docker-compose up --remove-orphans --force-recreate
```
