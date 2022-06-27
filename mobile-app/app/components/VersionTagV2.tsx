import { tailwind } from '@tailwind'
import { nativeApplicationVersion } from 'expo-application'
import { ThemedText, ThemedView } from '@components/themed'
import { translate } from '@translations'

export function VersionTag (): JSX.Element {
  return (
    <ThemedView>
      <ThemedText
        dark={tailwind('text-mono-dark-v2-900')}
        light={tailwind('text-mono-light-v2-900')}
        style={tailwind('text-sm font-medium text-center')}
        testID='version_tag'
      >
        {translate('components/VersionTag', 'Version {{number}}', { number: nativeApplicationVersion ?? '0.0.0' })}
      </ThemedText>
    </ThemedView>

  )
}