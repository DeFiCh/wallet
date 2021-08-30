import { AddressToken } from '@defichain/whale-api-client/dist/api/address'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import BigNumber from 'bignumber.js'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native'
import NumberFormat from 'react-number-format'
import { useSelector } from 'react-redux'
import { Logging } from '../../../../../api'
import { View } from '../../../../../components'
import { Button } from '../../../../../components/Button'
import { getNativeIcon } from '../../../../../components/icons/assets'
import { NumberTextInput } from '../../../../../components/NumberTextInput'
import { SectionTitle } from '../../../../../components/SectionTitle'
import { AmountButtonTypes, SetAmountButton } from '../../../../../components/SetAmountButton'
import {
  ThemedIcon,
  ThemedScrollView,
  ThemedText,
  ThemedTouchableOpacity,
  ThemedView
} from '../../../../../components/themed'
import { useWhaleApiClient } from '../../../../../contexts/WhaleContext'
import { useTokensAPI } from '../../../../../hooks/wallet/TokensAPI'
import { RootState } from '../../../../../store'
import { hasTxQueued as hasBroadcastQueued } from '../../../../../store/ocean'
import { hasTxQueued } from '../../../../../store/transaction_queue'
import { tailwind } from '../../../../../tailwind'
import { translate } from '../../../../../translations'
import { BalanceParamList } from '../BalancesNavigator'

export type ConversionMode = 'utxosToAccount' | 'accountToUtxos'
type Props = StackScreenProps<BalanceParamList, 'ConvertScreen'>

interface ConversionIO extends AddressToken {
  unit: 'UTXO' | 'Token'
}

export function ConvertScreen (props: Props): JSX.Element {
  const client = useWhaleApiClient()
  // global state
  const tokens = useTokensAPI()
  const hasPendingJob = useSelector((state: RootState) => hasTxQueued(state.transactionQueue))
  const hasPendingBroadcastJob = useSelector((state: RootState) => hasBroadcastQueued(state.ocean))
  const navigation = useNavigation<NavigationProp<BalanceParamList>>()
  const [mode, setMode] = useState(props.route.params.mode)
  const [sourceToken, setSourceToken] = useState<ConversionIO>()
  const [targetToken, setTargetToken] = useState<ConversionIO>()
  const [convAmount, setConvAmount] = useState<string>('0')
  const [fee, setFee] = useState<BigNumber>(new BigNumber(0.0001))
  const [amount, setAmount] = useState<string>('')

  useEffect(() => {
    client.fee.estimate()
      .then((f) => setFee(new BigNumber(f)))
      .catch(Logging.error)
  }, [])

  useEffect(() => {
    const [source, target] = getDFIBalances(mode, tokens)
    setSourceToken(source)
    setTargetToken(target)
    const conversion = new BigNumber(amount).isNaN() ? '0' : new BigNumber(amount).toString()
    setConvAmount(conversion)
  }, [mode, JSON.stringify(tokens), amount])

  if (sourceToken === undefined || targetToken === undefined) {
    return <></>
  }

  function convert (sourceToken: ConversionIO, targetToken: ConversionIO): void {
    if (hasPendingJob || hasPendingBroadcastJob) {
      return
    }
    navigation.navigate({
      name: 'ConvertConfirmationScreen',
      params: {
        sourceUnit: sourceToken.unit,
        sourceBalance: BigNumber.maximum(new BigNumber(sourceToken.amount).minus(convAmount), 0),
        targetUnit: targetToken.unit,
        targetBalance: BigNumber.maximum(new BigNumber(targetToken.amount).plus(convAmount), 0),
        mode,
        amount: new BigNumber(amount),
        fee
      },
      merge: true
    })
  }

  return (
    <ThemedScrollView style={tailwind('w-full flex-col flex-1')}>
      <ConversionIOCard
        style={tailwind('my-4 mt-1')}
        mode='input'
        current={amount}
        unit={sourceToken.unit}
        balance={new BigNumber(sourceToken.amount)}
        onChange={setAmount}
      />
      <ToggleModeButton onPress={() => setMode(mode === 'utxosToAccount' ? 'accountToUtxos' : 'utxosToAccount')} />
      <ConversionReceiveCard
        current={BigNumber.maximum(new BigNumber(targetToken.amount).plus(convAmount), 0).toFixed(8)}
        unit={targetToken.unit}
      />
      <TokenVsUtxosInfo />
      <Button
        testID='button_continue_convert'
        disabled={!canConvert(convAmount, sourceToken.amount) || hasPendingJob || hasPendingBroadcastJob}
        title='Convert' onPress={() => convert(sourceToken, targetToken)}
        label={translate('components/Button', 'CONTINUE')}
      />
    </ThemedScrollView>
  )
}

function getDFIBalances (mode: ConversionMode, tokens: AddressToken[]): [source: ConversionIO, target: ConversionIO] {
  const source: AddressToken = mode === 'utxosToAccount'
    ? tokens.find(tk => tk.id === '0_utxo') as AddressToken
    : tokens.find(tk => tk.id === '0') as AddressToken
  const sourceUnit = mode === 'utxosToAccount' ? 'UTXO' : 'Token'

  const target: AddressToken = mode === 'utxosToAccount'
    ? tokens.find(tk => tk.id === '0') as AddressToken
    : tokens.find(tk => tk.id === '0_utxo') as AddressToken
  const targetUnit = mode === 'utxosToAccount' ? 'Token' : 'UTXO'

  return [
    { ...source, unit: sourceUnit, amount: getConvertibleUtxoAmount(mode, source) },
    { ...target, unit: targetUnit }
  ]
}

function ConversionIOCard (props: { style?: StyleProp<ViewStyle>, mode: 'input' | 'output', unit: 'UTXO' | 'Token', current: string, balance: BigNumber, onChange: (amount: string) => void}): JSX.Element {
  const iconType = props.unit === 'UTXO' ? '_UTXO' : 'DFI'
  const titlePrefix = props.mode === 'input' ? 'CONVERT' : 'TO'
  const title = `${translate('screens/Convert', titlePrefix)} ${props.unit}`
  const DFIIcon = getNativeIcon(iconType)

  return (
    <View style={[tailwind('flex-col w-full'), props.style]}>
      <SectionTitle text={title.toUpperCase()} testID={`text_input_convert_from_${props.mode}_text`} />
      <ThemedView
        style={tailwind('flex-row w-full items-center pl-4 pr-4')} light={tailwind('bg-white border-b border-gray-200')}
        dark={tailwind('bg-gray-800 border-b border-gray-700')}
      >
        <NumberTextInput
          placeholder={translate('screens/Convert', 'Enter an amount')}
          testID={`text_input_convert_from_${props.mode}`}
          value={props.current}
          style={tailwind('flex-1 mr-4 text-gray-500 px-1 py-4')}
          editable={props.mode === 'input'}
          onChange={event => {
            props.onChange(event.nativeEvent.text)
          }}
        />
        <DFIIcon />
      </ThemedView>
      <ThemedView
        style={tailwind('w-full px-4 flex-row items-center')} light={tailwind('bg-white border-b border-gray-200')}
        dark={tailwind('bg-gray-800 border-b border-gray-700')}
      >
        <View style={tailwind('flex flex-row flex-1 px-1 py-4 flex-wrap mr-2')}>
          <ThemedText>{translate('screens/Convert', 'Balance')}: </ThemedText>
          <NumberFormat
            value={props.balance.toFixed(8)} decimalScale={8} thousandSeparator displayType='text' suffix=' DFI'
            renderText={(value: string) => (
              <ThemedText
                testID='source_balance'
                light={tailwind('text-gray-500')}
                dark={tailwind('text-white text-opacity-70')}
                style={tailwind('font-medium')}
              >{value}
              </ThemedText>
            )}
          />
        </View>
        {props.mode === 'input' &&
          <SetAmountButton type={AmountButtonTypes.half} onPress={props.onChange} amount={props.balance} />}
        {props.mode === 'input' &&
          <SetAmountButton type={AmountButtonTypes.max} onPress={props.onChange} amount={props.balance} />}
      </ThemedView>
    </View>
  )
}

function ConversionReceiveCard (props: { style?: StyleProp<ViewStyle>, unit: string, current: string }): JSX.Element {
  const iconType = props.unit === 'UTXO' ? '_UTXO' : 'DFI'
  const titlePrefix = 'TO'
  const title = `${translate('screens/Convert', titlePrefix)} ${props.unit.toUpperCase()}`
  const DFIIcon = getNativeIcon(iconType)

  return (
    <View style={[tailwind('flex-col w-full'), props.style]}>
      <SectionTitle text={title} testID='text_input_convert_from_to_text' />
      <ThemedView
        style={tailwind('w-full px-4 flex-row items-center')} light={tailwind('bg-white border-b border-gray-200')}
        dark={tailwind('bg-gray-800 border-b border-gray-700')}
      >
        <View style={tailwind('flex flex-row flex-1 px-1 py-4 flex-wrap mr-2')}>
          <ThemedText>{translate('screens/Convert', 'Balance')}: </ThemedText>
          <NumberFormat
            value={props.current} decimalScale={8} thousandSeparator displayType='text' suffix=' DFI'
            renderText={(value: string) => (
              <ThemedText
                testID='target_balance'
                light={tailwind('text-gray-500')}
                dark={tailwind('text-white text-opacity-70')}
                style={tailwind('font-medium')}
              >{value}
              </ThemedText>
            )}
          />
        </View>
        <DFIIcon />
      </ThemedView>
    </View>
  )
}

function ToggleModeButton (props: { onPress: () => void }): JSX.Element {
  return (
    <View style={tailwind('flex-row justify-center items-center')}>
      <ThemedTouchableOpacity
        testID='button_convert_mode_toggle'
        light={tailwind('border border-gray-300 rounded bg-white')}
        dark={tailwind('border border-gray-400 rounded bg-gray-900')}
        style={tailwind('p-1')}
        onPress={props.onPress}
      >
        <ThemedIcon
          iconType='MaterialIcons' name='swap-vert' size={24} light={tailwind('text-primary-500')}
          dark={tailwind('text-darkprimary-500')}
        />
      </ThemedTouchableOpacity>
    </View>
  )
}

function TokenVsUtxosInfo (): JSX.Element {
  const navigation = useNavigation<NavigationProp<BalanceParamList>>()
  return (
    <TouchableOpacity
      style={tailwind('flex-row px-4 py-2 my-2 items-center justify-start')}
      onPress={() => {
        navigation.navigate('TokensVsUtxo')
      }}
      testID='token_vs_utxo_info'
    >
      <ThemedIcon
        iconType='MaterialIcons' name='help' size={16} light={tailwind('text-primary-500')}
        dark={tailwind('text-darkprimary-500')}
      />
      <ThemedText
        light={tailwind('text-primary-500')} dark={tailwind('text-darkprimary-500')}
        style={tailwind('ml-1 text-sm font-medium')}
      >{translate('screens/ConvertScreen', 'Token vs UTXO, what is the difference?')}
      </ThemedText>
    </TouchableOpacity>
  )
}

function canConvert (amount: string, balance: string): boolean {
  return new BigNumber(balance).gte(amount) && !(new BigNumber(amount).isZero()) && (new BigNumber(amount).isPositive())
}

function getConvertibleUtxoAmount (mode: ConversionMode, source: AddressToken): string {
  if (mode === 'accountToUtxos') {
    return source.amount
  }

  const utxoToReserve = '0.1'
  const leftover = new BigNumber(source.amount).minus(new BigNumber(utxoToReserve))
  return leftover.isLessThan(0) ? '0' : leftover.toFixed()
}
