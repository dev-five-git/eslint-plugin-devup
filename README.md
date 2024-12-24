# devup-eslint-plugin

`devup`은 데브파이브에서 사용되는 더 빠르고 더 정확한 소프트웨어 개발을 위한 시스템입니다.

`devup-eslint-plugin`은 빠르고 정확하게 소프트웨어 개발을 할 수 있도록 도움을 줍니다.

각 룰에 대해서는 `src/rules` 디렉토리에 있는 파일을 참고하세요.

사내에서 사용하다가 외부에 공개된 만큼, 회사 내의 시스템을 위한 룰도 존재합니다.

원하는 룰만 사용할 수 있도록 `named export`로 모든 룰을 제공합니다.

## Installation

```bash
pnpm install --save-dev devup-eslint-plugin
```

## Test

반드시 커버리지가 100%가 되어야 합니다.

```bash
pnpm test
```

## Contributing

- 룰을 추가하거나 수정할 때는 `src/rules` 디렉토리에 파일을 추가하거나 수정합니다.
- 룰을 추가하거나 수정할 때는 `README.md`에 룰에 대한 설명을 추가합니다.

모든 의견과 기여를 환영합니다.
