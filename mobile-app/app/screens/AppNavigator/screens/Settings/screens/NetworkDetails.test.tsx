import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react-native'
import * as React from 'react'
import { NetworkDetails } from './NetworkDetails'
import { RootState } from '@store'
import { block } from '@store/block'

jest.mock('@shared-contexts/ThemeProvider', () => ({
  useThemeContext: () => {
    return {
      isLight: true
    }
  }
}))

jest.mock('@shared-contexts/NetworkContext', () => ({
  useNetworkContext: () => {
    return {
      network: 'Playground'
    }
  }
}))

jest.mock('@shared-contexts/DeFiScanContext', () => ({
  useDeFiScanContext: () => {
    return {
      getBlocksUrl: jest.fn
    }
  }
}))

jest.mock('dayjs', () => () => ({ format: () => 'Sep 14, 9:07 pm' }))

describe('NetworkDetails', () => {
  it('<NetworkDetails /> should render components', () => {
    const initialState: Partial<RootState> = {
      block: {
        count: 2000,
        masternodeCount: 10,
        lastSync: 'Tue, 14 Sep 2021 15:37:10 GMT',
        connected: true,
        isPolling: true
      }
    }
    const store = configureStore({
      preloadedState: initialState,
      reducer: { block: block.reducer }
    })
    const component = (
      <Provider store={store}>
        <NetworkDetails />
      </Provider>
    )
    const rendered = render(component)
    expect(rendered.toJSON()).toMatchSnapshot()
  })
})
