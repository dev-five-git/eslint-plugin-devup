# component interface

## Description

컴포넌트의 props 가 빈 object 일 때 interface 를 추가합니다.

## Example

```tsx
export function Hello({}) {
  return <div>...</div>
}
```

```tsx
interface HelloProps {}
export function Hello({}: HelloProps) {
  return <div>...</div>
}
```

```

```
