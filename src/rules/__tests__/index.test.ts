import * as index from '../index'
describe('export index', () => {
  it('export', () => {
    expect({ ...index }).toEqual({
      layout: expect.any(Object),
      component: expect.any(Object),
      rscApi: expect.any(Object),
      appPage: expect.any(Object),
      cssTs: expect.any(Object),
    })
  })
})
