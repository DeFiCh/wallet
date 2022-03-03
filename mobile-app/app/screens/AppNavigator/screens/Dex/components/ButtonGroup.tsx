import { ThemedText, ThemedTouchableOpacity, ThemedView } from '@components/themed'
import { tailwind } from '@tailwind'
import BigNumber from 'bignumber.js'
import { View } from 'react-native'

interface ButtonGroupProps {
  buttons: Buttons[]
  activeButtonGroupItem: string
  testID: string
}

interface Buttons {
  id: string
  label: string
  handleOnPress: () => void
}

export function ButtonGroup (props: ButtonGroupProps): JSX.Element {
  const buttonWidth = new BigNumber(100).dividedBy(props.buttons.length)
  return (
    <ThemedView
      light={tailwind('bg-gray-100')}
      dark={tailwind('bg-dfxblue-800')}
      style={tailwind('rounded-2xl flex flex-row justify-between')}
      testID={props.testID}
    >
      {
        props.buttons.map((button) => (
          <ButtonGroupItem
            label={button.label}
            onPress={button.handleOnPress}
            isActive={props.activeButtonGroupItem === button.id}
            width={buttonWidth}
            key={button.id}
            testID={`${props.testID}_${button.id}`}
          />
        ))
      }
    </ThemedView>
  )
}

interface ButtonGroupItemProps {
  label: string
  onPress: () => void
  isActive: boolean
  width: BigNumber
  testID: string
}

function ButtonGroupItem (props: ButtonGroupItemProps): JSX.Element {
  return (
    <View style={tailwind('p-0.5 flex flex-row')}>
      <ThemedTouchableOpacity
        onPress={props.onPress}
        light={tailwind({ 'bg-primary-50': props.isActive })}
        dark={tailwind({ 'bg-dfxblue-900': props.isActive })}
        style={[tailwind('flex-1 rounded-2xl py-2 px-3'), { width: `${props.width.toFixed(2)}%` }]}
        testID={`${props.testID}${props.isActive ? '_active' : ''}`}
      >
        <ThemedText
          light={tailwind({ 'text-primary-500': props.isActive, 'text-gray-900': !props.isActive })}
          dark={tailwind({ 'text-white': props.isActive, 'text-dfxgray-300': !props.isActive })}
          style={tailwind('font-medium text-center')}
        >
          {props.label}
        </ThemedText>
      </ThemedTouchableOpacity>
    </View>
  )
}
