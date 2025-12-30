# component-interface

## Description

Adds an interface when component props is an empty object.

## Example

```tsx
// Before
export function Hello({}) {
  return <div>...</div>
}
```

```tsx
// After
interface HelloProps {}
export function Hello({}: HelloProps) {
  return <div>...</div>
}
```
