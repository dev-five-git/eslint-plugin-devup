import * as index from '../index'
describe('export index', () => {
  it('export', () => {
    expect({ ...index }).toEqual({
      component: expect.any(Object),
      componentInterface: expect.any(Object),
      rscApi: expect.any(Object),
      appPage: expect.any(Object),
    })
  })
})
