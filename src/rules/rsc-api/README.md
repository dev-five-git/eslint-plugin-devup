# rsc-api

## Description

ServerComponent 를 사용할 때 일반 API인 getList, getOne, create, update, delete를 사용했을 경우 이를 cache버전으로 변경합니다.
generateMetadata 를 사용할 때도 cache 버전을 사용해야 합니다.


## Example

```jsx
// app/layout.tsx
import { getList } from "@devup/api";

export default async function Layout() {
    await getList()
    return <div>...</div>;
}
```

```jsx

// app/layout.tsx
import { cacheGetList } from "@devup/react";

export default async function Layout() {
    await cacheGetList()
    return <div>...</div>;
}
```
