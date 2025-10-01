# component

## Description

app 폴더, 혹은 components 폴더에 있는 컴포넌트는 파일명 혹은 index.tsx 라면 폴더명에 따라서 이름을 지어야 합니다.

## Example

```jsx
// app/hello/index.tsx
export function Hello() {
  return <div>...</div>
}
```

```jsx
// components/app-wrapper/index.tsx
export function AppWrapper() {
  return <div>...</div>
}
```
