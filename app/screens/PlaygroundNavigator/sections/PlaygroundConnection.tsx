import React from 'react'
import { useSelector } from 'react-redux'
import { Text, View } from '../../../components'
import { useNetworkContext } from '../../../contexts/NetworkContext'
import { useThemeContext } from '../../../contexts/ThemeProvider'
import { isPlayground } from '../../../environment'
import { RootState } from '../../../store'
import { tailwind } from '../../../tailwind'
import { PlaygroundTitle } from '../components/PlaygroundTitle'

export function PlaygroundConnection (): JSX.Element {
  const { getThemeClass } = useThemeContext()
  const { network } = useNetworkContext()
  const connected = useSelector((state: RootState) => state.block.connected)
  const count = useSelector((state: RootState) => state.block.count)

  return (
    <View>
      <PlaygroundTitle title='Connection' status={{ online: connected, offline: !connected }} />

      <View style={tailwind('px-4 py-4', getThemeClass('row-bg'))}>
        <Text>
          <Text style={tailwind('font-medium', getThemeClass('body-text'))}>
            Network:
          </Text>
          <Text
            testID='playground_active_network'
            style={tailwind(getThemeClass('body-text'))}
          > {network}
          </Text>
        </Text>
        <Text style={tailwind(getThemeClass('body-text'))}>Blocks: {count === 0 ? '...' : count}</Text>
        {
          isPlayground(network) && (
            <Text style={tailwind('mt-2 text-sm', getThemeClass('body-text'))}>
              DeFi Playground is a specialized testing blockchain isolated from MainNet for testing DeFi applications.
              Assets are not real, it can be minted by anyone. Blocks are generated every 3 seconds, the chain resets
              daily.
            </Text>
          )
        }
      </View>
    </View>
  )
}
