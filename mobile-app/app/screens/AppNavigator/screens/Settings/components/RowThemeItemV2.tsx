import { MaterialIcons } from '@expo/vector-icons'
import { useState } from 'react'
import { View } from 'react-native'
import { ThemePersistence } from '@api'
import { Switch } from '@components/index'
import { ThemedTextV2, ThemedViewV2 } from '@components/themed'
import { useThemeContext } from '@shared-contexts/ThemeProvider'
import { tailwind } from '@tailwind'
import { translate } from '@translations'

export function RowThemeItemV2 (props: { border?: boolean }): JSX.Element {
  const {
    setTheme,
    isLight
  } = useThemeContext()
  const [isDark, setIsDark] = useState<boolean>(!isLight)
  return (
    <ThemedViewV2
      light={tailwind('border-mono-light-v2-300')}
      dark={tailwind('border-mono-dark-v2-300')}
      style={tailwind('flex py-4.5 ml-5 mr-4 flex-row items-center justify-between', { 'border-b-0.5': props.border })}
      testID='theme_row'
    >
      <ThemedTextV2
        light={tailwind('text-mono-light-v2-900')}
        dark={tailwind('text-mono-dark-v2-900')}
        style={tailwind('font-normal-v2 text-sm')}
      >
        {translate('screens/Settings', 'Theme')}
      </ThemedTextV2>

      <View style={tailwind('flex-row items-center')}>
        {isLight
        ? (
          <MaterialIcons
            name='wb-sunny'
            size={20}
            testID='light_mode_icon'
            style={tailwind('mr-2 text-orange-v2')}
          />
          )
        : (
          <MaterialIcons
            name='nightlight-round'
            size={20}
            testID='dark_mode_icon'
            style={tailwind('mr-2 text-orange-v2')}
          />
        )}

        <Switch
          onValueChange={async (v) => {
            const newTheme = v ? 'dark' : 'light'
            setTheme(newTheme)
            setIsDark(newTheme === 'dark')
            await ThemePersistence.set(newTheme)
          }}
          testID='theme_switch'
          value={isDark}
        />
      </View>
    </ThemedViewV2>
  )
}