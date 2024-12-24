import { RuleTester } from 'eslint'

import { layout } from '../'

describe('layout rule', () => {
  const ruleTester = new RuleTester({
    languageOptions: {
      ecmaVersion: 'latest',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  })
  ruleTester.run('layout', layout, {
    valid: [
      {
        code: `import {Col} from "@devup/react";
<Row><Col /></Row>`,
      },
      {
        code: '<Row><Col /><></></Row>',
      },
    ],
    invalid: [
      {
        code: '<Row><div></div></Row>',
        output: `import { Col, Row } from '@devup/react';
<Row><Col><div></div></Col></Row>`,
        errors: [
          {
            message: 'Row 컴포넌트의 자식은 Col 컴포넌트만 가능합니다.',
          },
        ],
      },
      {
        code: `import { Row } from '@devup/react';
<Row><div></div></Row>`,
        output: `import { Row, Col } from '@devup/react';
<Row><Col><div></div></Col></Row>`,
        errors: [
          {
            message: 'Row 컴포넌트의 자식은 Col 컴포넌트만 가능합니다.',
          },
        ],
      },
      {
        code: `import {} from '@devup/react';
<Row><div></div></Row>`,
        output: `import { Col } from '@devup/react';
<Row><Col><div></div></Col></Row>`,
        errors: [
          {
            message: 'Row 컴포넌트의 자식은 Col 컴포넌트만 가능합니다.',
          },
        ],
      },
      {
        code: `import * as ty from '@devup/react';
<Row><div></div></Row>`,
        output: `import { Col, Row } from '@devup/react';
import * as ty from '@devup/react';
<Row><Col><div></div></Col></Row>`,
        errors: [
          {
            message: 'Row 컴포넌트의 자식은 Col 컴포넌트만 가능합니다.',
          },
        ],
      },
      {
        code: `import { Col } from '@devup/react';
<Row><div></div></Row>`,
        output: `import { Col } from '@devup/react';
<Row><Col><div></div></Col></Row>`,
        errors: [
          {
            message: 'Row 컴포넌트의 자식은 Col 컴포넌트만 가능합니다.',
          },
        ],
      },
    ],
  })
})
