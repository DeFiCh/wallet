import React from 'react'
import { SectionList, SectionListProps } from 'react-native'
import { useThemeContext } from '../../contexts/ThemeProvider'
import { tailwind } from '../../tailwind'
import { ThemedProps } from './index'

type ThemedSectionListProps = SectionListProps<any, any> & ThemedProps

export function ThemedSectionList (props: ThemedSectionListProps): JSX.Element {
  const { theme } = useThemeContext()
  const { style, light = 'bg-gray-100', dark = 'bg-gray-900', ...otherProps } = props

  return <SectionList style={[style, tailwind(theme === 'light' ? light : dark)]} {...otherProps} />
}
