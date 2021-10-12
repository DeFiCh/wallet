import { render } from '@testing-library/react-native'
import * as React from 'react'
import { BarCodeScanner } from './BarCodeScanner'

jest.mock('@shared-contexts/ThemeProvider', () => ({
  useThemeContext: () => {
    return {
      isLight: true
    }
  }
}))
describe('barcode scanner', () => {
  it('should match snapshot', async () => {
    const navigation: any = {
      navigate: jest.fn()
    }
    const route: any = {}
    const component = (
      <BarCodeScanner
        navigation={navigation}
        route={route}
      />
    )
    const rendered = render(component)
    expect(rendered.toJSON()).toMatchSnapshot()
  })
})
