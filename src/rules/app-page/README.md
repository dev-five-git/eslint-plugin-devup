# app-page

## Description

When creating a page.tsx or layout.tsx file inside the app directory, this rule warns if the file is empty and automatically generates a component.

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
