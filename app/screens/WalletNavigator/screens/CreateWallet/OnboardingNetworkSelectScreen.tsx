import { SectionTitle } from '@components/SectionTitle'
import { getEnvironment } from '@environment'
import { RowNetworkItem } from '@screens/AppNavigator/screens/Settings/components/RowNetworkItem'
import { translate } from '@translations'
import * as React from 'react'
import { View } from 'react-native'

export function OnboardingNetworkSelectScreen (): JSX.Element {
  const networks = getEnvironment().networks

  return (
    <View testID='wallet_network_selection_screen'>
      <SectionTitle
        testID='wallet_network_selection_screen_title'
        text={translate('screens/NetworkSelectionScreen', 'SELECT NETWORK')}
      />

      {
        networks.map((network, index) => (
          <RowNetworkItem
            key={index}
            network={network}
          />
        ))
      }
    </View>
  )
}
