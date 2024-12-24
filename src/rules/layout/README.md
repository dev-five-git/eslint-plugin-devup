# layout

## Description

Row 컴포넌트의 자식은 반드시 Col 컴포넌트여야 합니다.

Row 컴포넌트 아래에 다른 컴포넌트가 올 경우 레이아웃에 대한 부작용을 예측할 수 없습니다.

layout Rule 은 자동으로 Row 컴포넌트의 자식이 Col 컴포넌트가 아닐 경우 에러를 발생시키며 자동으로 Col 컴포넌트로 감싸줍니다.

## Example

```jsx
// Bad
<Row>
  <div>...</div>
</Row>

// Good
<Row>
  <Col><div>...</div></Col>
</Row>
```
