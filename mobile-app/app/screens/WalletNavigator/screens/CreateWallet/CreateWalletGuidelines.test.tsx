import { render } from '@testing-library/react-native'
import * as React from 'react'
import { CreateWalletGuidelines } from './CreateWalletGuidelines'

jest.mock('@shared-contexts/ThemeProvider', () => ({
  useThemeContext: () => {
    return {
      isLight: true
    }
  }
}))
describe('create wallet guidelines', () => {
  it('should match snapshot', () => {
    const navigation: any = {
      navigate: jest.fn()
    }
    const route: any = {}
    const rendered = render(<CreateWalletGuidelines
      navigation={navigation}
      route={route}
                            />)
    expect(rendered.toJSON()).toMatchSnapshot()
  })
})
