import { lowerFirst } from '../utils'

describe('test utils', () => {
  it('lowerFirst should work', () => {
    expect(lowerFirst()).toBe('')
    expect(lowerFirst('')).toBe('')
    expect(lowerFirst('C')).toBe('c')
    expect(lowerFirst('Click')).toBe('click')
    expect(lowerFirst('click')).toBe('click')
  })
})
