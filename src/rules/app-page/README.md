# app-page

## Description

app 내의 page.tsx 혹은 layout.tsx 파일을 생성한 후 파일이 비어 있다면 경고를 발생시키고 자동으로 컴포넌트를 생성합니다.


## Example

```jsx
// app/hello/page.tsx
export default function HelloPage() {
  return <div>...</div>;
}
```

```jsx

// app/page.tsx
export default function IndexPage() {
  return <div>...</div>;
}
```
