import { render } from '@testing-library/react-native'
import * as React from 'react'
import { NetworkSelectionScreen } from './NetworkSelectionScreen'

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}))

jest.mock('@shared-contexts/NetworkContext', () => ({
  useNetworkContext: () => {
    return {
      network: 'Playground'
    }
  }
}))

jest.mock('@shared-contexts/ThemeProvider', () => ({
  useThemeContext: () => {
    return {
      isLight: true
    }
  }
}))

describe('network selection screen', () => {
  it('should render', async () => {
    const rendered = render(<NetworkSelectionScreen />)
    expect(rendered.toJSON()).toMatchSnapshot()
  })
})
