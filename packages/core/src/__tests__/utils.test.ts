import { lowerFirst, isEventProp } from '../utils'

describe('test utils', () => {
  it('lowerFirst should work', () => {
    expect(lowerFirst()).toBe('')
    expect(lowerFirst('')).toBe('')
    expect(lowerFirst('C')).toBe('c')
    expect(lowerFirst('Click')).toBe('click')
    expect(lowerFirst('click')).toBe('click')
  })

  it('isEventProp should work', () => {
    expect(isEventProp('onclick')).toBe(false)
    expect(isEventProp('onlyShowCurrent')).toBe(false)
    expect(isEventProp('onC')).toBe(false)
    expect(isEventProp('useClick')).toBe(false)

    expect(isEventProp('onClick')).toBe(true)
    expect(isEventProp('onCl')).toBe(true)
    expect(isEventProp('onClickPanel')).toBe(true)
  })
})
