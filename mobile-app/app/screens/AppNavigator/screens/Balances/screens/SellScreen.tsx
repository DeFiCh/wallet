/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { InputHelperText } from '@components/InputHelperText'
import { WalletTextInput } from '@components/WalletTextInput'
import { StackScreenProps } from '@react-navigation/stack'
import { DFITokenSelector, DFIUtxoSelector, fetchTokens, tokensSelector, WalletToken } from '@store/wallet'
import BigNumber from 'bignumber.js'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Control, Controller, useForm } from 'react-hook-form'
import { Platform, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { AmountButtonTypes, SetAmountButton } from '@components/SetAmountButton'
import {
  ThemedIcon,
  ThemedScrollView,
  ThemedSectionTitle,
  ThemedText,
  ThemedTouchableOpacity,
  ThemedView
} from '@components/themed'
import { onTransactionBroadcast } from '@api/transaction/transaction_commands'
import { useWhaleApiClient } from '@shared-contexts/WhaleContext'
import { RootState } from '@store'
import { hasTxQueued as hasBroadcastQueued } from '@store/ocean'
import { hasTxQueued } from '@store/transaction_queue'
import { tailwind } from '@tailwind'
import { translate } from '@translations'
import { BalanceParamList } from '../BalancesNavigator'
import { FeeInfoRow } from '@components/FeeInfoRow'
import { useLogger } from '@shared-contexts/NativeLoggingProvider'
import { SymbolIcon } from '@components/SymbolIcon'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { BottomSheetNavScreen, BottomSheetWebWithNav, BottomSheetWithNav } from '@components/BottomSheetWithNav'
import { BottomSheetToken, BottomSheetTokenList, TokenType } from '@components/BottomSheetTokenList'
import { BottomSheetFiatAccountList } from '@components/SellComponents/BottomSheetFiatAccountList'
import { useWalletContext } from '@shared-contexts/WalletContext'
import { SubmitButtonGroup } from '@components/SubmitButtonGroup'
import { StackActions, useIsFocused } from '@react-navigation/native'
import { useDFXAPIContext } from '@shared-contexts/DFXAPIContextProvider'
import { SellRoute } from '@shared-api/dfx/models/SellRoute'
import { DfxKycInfo } from '@components/DfxKycInfo'
import { ActionButton } from '../../Dex/components/PoolPairCards/ActionSection'
import { BottomSheetFiatAccountCreate } from '@components/SellComponents/BottomSheetFiatAccountCreate'
import { send } from './SendConfirmationScreen'
import { useNetworkContext } from '@shared-contexts/NetworkContext'
import { useConversion } from '@hooks/wallet/Conversion'

type Props = StackScreenProps<BalanceParamList, 'SellScreen'>

export function SellScreen ({
  route,
  navigation
}: Props): JSX.Element {
  const network = useNetworkContext()
  const logger = useLogger()
  const client = useWhaleApiClient()
  const { address } = useWalletContext()
  const blockCount = useSelector((state: RootState) => state.block.count)
  const tokens = useSelector((state: RootState) => tokensSelector(state.wallet))
  const [token, setToken] = useState(route.params?.token)
  const { listFiatAccounts } = useDFXAPIContext()
  const [selectedFiatAccount, setSelectedFiatAccount] = useState<SellRoute>()
  const [fiatAccounts, setFiatAccounts] = useState<SellRoute[]>([])
  const isFocused = useIsFocused()
  const {
    control,
    setValue,
    formState,
    getValues,
    trigger
  } = useForm({ mode: 'onChange' })
  const dispatch = useDispatch()
  const [fee, setFee] = useState<number>(2.9)
  const hasPendingJob = useSelector((state: RootState) => hasTxQueued(state.transactionQueue))
  const hasPendingBroadcastJob = useSelector((state: RootState) => hasBroadcastQueued(state.ocean))
  const DFIUtxo = useSelector((state: RootState) => DFIUtxoSelector(state.wallet))
  const DFIToken = useSelector((state: RootState) => DFITokenSelector(state.wallet))
  const {
    isConversionRequired,
    conversionAmount
  } = useConversion({
    inputToken: {
      type: token?.id === '0_unified' ? 'utxo' : 'others',
      amount: new BigNumber(getValues('amount'))
    },
    deps: [getValues('amount'), JSON.stringify(token)]
  })
  const [hasBalance, setHasBalance] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOnPage, setIsOnPage] = useState<boolean>(true)

  // Bottom sheet token
  const [isModalDisplayed, setIsModalDisplayed] = useState(false)
  const [bottomSheetScreen, setBottomSheetScreen] = useState<BottomSheetNavScreen[]>([])
  const containerRef = useRef(null)
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const expandModal = useCallback(() => {
    if (Platform.OS === 'web') {
      setIsModalDisplayed(true)
    } else {
      bottomSheetRef.current?.present()
    }
  }, [])
  const dismissModal = useCallback(() => {
    if (Platform.OS === 'web') {
      setIsModalDisplayed(false)
    } else {
      bottomSheetRef.current?.close()
    }
  }, [])

  useEffect(() => {
    if (isFocused) {
      dispatch(fetchTokens({
        client,
        address
      }))
    }
  }, [address, blockCount, isFocused])

  // load sell routes
  useEffect(() => {
    listFiatAccounts()
      .then((sellRoutes) => {
        // if no sell routes navigate to UserDetails screen to create
        if (sellRoutes === undefined || sellRoutes.length < 1) {
          navigation.navigate('UserDetails')
        }
        setFiatAccounts(sellRoutes)
      })
      .catch(logger.error)

    setIsOnPage(true)
    return () => {
      setIsOnPage(false)
    }
  }, [])

  useEffect(() => {
    const t = tokens.find((t) => t.id === token?.id)
    if (t !== undefined) {
      setToken({ ...t })
    }

    const totalBalance = tokens.reduce((total, token) => {
      return total.plus(new BigNumber(token.amount))
    }, new BigNumber(0))

    setHasBalance(totalBalance.isGreaterThan(0))
  }, [JSON.stringify(tokens)])

  const setAccount = (item: SellRoute): void => {
    setSelectedFiatAccount(item)
    setFee(item.fee)
  }

  const setFiatAccountListBottomSheet = useCallback((accounts: SellRoute[]) => {
    setBottomSheetScreen([
      {
        stackScreenName: 'FiatAccountList',
        component: BottomSheetFiatAccountList({
          fiatAccounts: accounts,
          headerLabel: translate('screens/SellScreen', 'Choose account for payout'),
          onCloseButtonPress: () => dismissModal(),
          onFiatAccountPress: async (item): Promise<void> => {
            if (item.iban !== undefined) {
              setAccount(item)
            }
            dismissModal()
          }
        }),
        option: {
          header: () => null
        }
      }])
  }, [fiatAccounts])

  const setFiatAccountCreateBottomSheet = useCallback((accounts: SellRoute[]) => { // TODO: remove accounts?
    setBottomSheetScreen([
      {
        stackScreenName: 'FiatAccountCreate',
        component: BottomSheetFiatAccountCreate({
          fiatAccounts: accounts,
          headerLabel: translate('screens/SellScreen', 'Add account for payout'),
          onCloseButtonPress: () => dismissModal(),
          onElementCreatePress: async (item): Promise<void> => {
            if (item.iban !== undefined) {
              fiatAccounts.push(item)
              setAccount(item)
            }
            dismissModal()
          }
        }),
        option: {
          header: () => null
        }
      }])
  }, [fiatAccounts])

  const setTokenListBottomSheet = useCallback(() => {
    setBottomSheetScreen([
      {
        stackScreenName: 'TokenList',
        component: BottomSheetTokenList({
          tokens: getBottomSheetToken(tokens),
          tokenType: TokenType.BottomSheetToken,
          headerLabel: translate('screens/SendScreen', 'Choose token to send'),
          onCloseButtonPress: () => dismissModal(),
          onTokenPress: async (item): Promise<void> => {
            const _token = tokens.find(t => t.id === item.tokenId)
            if (_token !== undefined) {
              setToken(_token)
              setValue('amount', '')
              await trigger('amount')
            }
            dismissModal()
          }
        }),
        option: {
          header: () => null
        }
      }])
  }, [])

  async function onSubmit (): Promise<void> {
    if (hasPendingJob || hasPendingBroadcastJob || token === undefined || selectedFiatAccount === undefined) {
      return
    }

    if (formState.isValid && (selectedFiatAccount?.deposit?.address?.length > 0)) {
      setIsSubmitting(true)
      await send({
        address: selectedFiatAccount.deposit.address,
        token,
        amount: new BigNumber(getValues('amount')),
        networkName: network.networkName
      }, dispatch, () => {
        onTransactionBroadcast(isOnPage, navigation.dispatch, 0, 'SellConfirmationScreen')
      }, logger)
      setIsSubmitting(false)
    }
  }

  return (
    <View style={tailwind('h-full')} ref={containerRef}>
      <ThemedScrollView contentContainerStyle={tailwind('pt-6 pb-8')} testID='sell_screen'>

        <ActionButton
          name='details'
          onPress={() => {
            navigation.navigate('UserDetails')
          }}
          pair={' '}
          label={translate('screens/SellScreen', 'add user')}
          style={tailwind('p-2 mb-2 h-10 mx-8 justify-center')}
          testID={'/* `pool_pair_add_{symbol}` */'}
          standalone
        />

        <TokenInput
          token={token}
          onPress={() => {
            setTokenListBottomSheet()
            expandModal()
          }}
          isDisabled={!hasBalance}
        />

        {token === undefined
          ? (
            <ThemedText style={tailwind('px-4')}>
              {translate('screens/SellScreen', 'Select a token you want to sell to get started')}
            </ThemedText>
          )
          : (
            <>
              <ActionButton
                name='add'
                onPress={() => {
                  setFiatAccountCreateBottomSheet(fiatAccounts)
                  expandModal()
                }}
                pair={' '}
                label={translate('screens/SellScreen', 'ADD payout account')}
                style={tailwind('p-2 mb-2 h-10 mx-10 justify-center')}
                testID={'/* `pool_pair_add_{symbol}` */'}
                standalone
              />

              {(fiatAccounts.length > 0) &&
                <>
                  <View style={tailwind('px-4')}>

                    <FiatAccountInput
                      onPress={() => {
                        setFiatAccountListBottomSheet(fiatAccounts)
                        expandModal()
                      }}
                      fiatAccount={selectedFiatAccount}
                      isDisabled={!(fiatAccounts.length > 0)}
                    />

                    <DfxKycInfo />

                    <AmountRow
                      control={control}
                      onAmountChange={async (amount) => {
                        setValue('amount', amount, { shouldDirty: true })
                        await trigger('amount')
                      }}
                      onClearButtonPress={async () => {
                        setValue('amount', '')
                        await trigger('amount')
                      }}
                      token={token}
                    />
                  </View>

                  <ThemedSectionTitle
                    text={translate('screens/SendScreen', 'TRANSACTION DETAILS')}
                  />

                  <FeeInfoRow
                    type='FIAT_FEE'
                    value={fee}
                    testID='transaction_fee'
                    suffix='%'
                  />

                  <ThemedText
                    testID='transaction_details_info_text'
                    light={tailwind('text-gray-600')}
                    dark={tailwind('text-dfxgray-300')}
                    style={tailwind('mt-2 mx-4 text-sm')}
                  >
                    {translate('screens/SendScreen', 'Review full transaction details in the next screen')}
                  </ThemedText>
                </>}
            </>
          )}

        <View style={tailwind('mt-6')}>
          <SubmitButtonGroup
            isDisabled={!formState.isValid /* TODO: (davidleomay) check if needed || isConversionRequired */ || selectedFiatAccount === undefined || hasPendingJob || hasPendingBroadcastJob || token === undefined}
            label={translate('screens/SellScreen', 'SELL')}
            processingLabel={translate('screens/SellScreen', 'SELL')}
            onSubmit={onSubmit}
            title='sell_sell'
            isProcessing={hasPendingJob || hasPendingBroadcastJob || isSubmitting}
            displayCancelBtn={false}
          />
        </View>

        {Platform.OS === 'web' && (
          <BottomSheetWebWithNav
            modalRef={containerRef}
            screenList={bottomSheetScreen}
            isModalDisplayed={isModalDisplayed}
            modalStyle={{
              position: 'absolute',
              height: '350px',
              width: '375px',
              zIndex: 50,
              bottom: '0'
            }}
          />
        )}

        {Platform.OS !== 'web' && (
          <BottomSheetWithNav
            modalRef={bottomSheetRef}
            screenList={bottomSheetScreen}
          />
        )}
      </ThemedScrollView>
    </View>
  )
}

function TokenInput (props: { token?: WalletToken, onPress: () => void, isDisabled: boolean }): JSX.Element {
  const hasNoBalanceForSelectedToken = props.token?.amount === undefined ? true : new BigNumber(props.token?.amount).lte(0)
  return (
    <View style={tailwind('px-4')}>
      <ThemedText
        testID='transaction_details_info_text'
        light={tailwind('text-gray-600')}
        dark={tailwind('text-dfxgray-300')}
        style={tailwind('text-xl font-semibold')}
      >
        {translate('screens/SellScreen', 'Sell token')}
      </ThemedText>
      {/* TODO */}
      <ThemedTouchableOpacity
        onPress={props.onPress}
        dark={tailwind('bg-dfxblue-800 border-dfxblue-900')}
        light={tailwind({
          'bg-gray-200 border-0': props.isDisabled,
          'border-gray-300 bg-white': !props.isDisabled
        })}
        style={tailwind('border rounded w-full flex flex-row justify-between h-12 items-center px-2', {
          'mb-10': props.token?.isLPS === false,
          'mb-2': props.token?.isLPS === true,
          'mb-6': props.token === undefined
        })}
        testID='select_token_input'
        disabled={props.isDisabled}
      >
        {props.token === undefined || props.isDisabled || hasNoBalanceForSelectedToken
          ? (
            <ThemedText
              dark={tailwind({
                'text-dfxgray-500': !props.isDisabled,
                'text-dfxblue-900': props.isDisabled
              })}
              style={tailwind('text-sm')}
              testID='select_token_placeholder'
            >
              {translate('screens/SellScreen', 'Select token')}
            </ThemedText>
          )
          : (
            <View style={tailwind('flex flex-row')}>
              <SymbolIcon symbol={props.token.displaySymbol} styleProps={tailwind('w-6 h-6')} />
              <ThemedText
                style={tailwind('ml-2 font-medium')}
                testID='selected_token'
              >
                {props.token.displaySymbol}
              </ThemedText>
            </View>
          )}
        <ThemedIcon
          iconType='MaterialIcons'
          name='unfold-more'
          size={24}
          dark={tailwind({
            'text-dfxred-500': !props.isDisabled,
            'text-transparent': props.isDisabled
          })}
          light={tailwind({
            'text-primary-500': !props.isDisabled,
            'text-gray-500': props.isDisabled
          })}
          style={tailwind('-mr-1.5 flex-shrink-0')}
        />
      </ThemedTouchableOpacity>
    </View>
  )
}

function FiatAccountInput (props: { fiatAccount?: SellRoute, onPress: () => void, isDisabled: boolean }): JSX.Element {
  return (
    <>
      <ThemedText
        testID='transaction_details_info_text'
        light={tailwind('text-gray-600')}
        dark={tailwind('text-dfxgray-300')}
        style={tailwind('flex-grow my-2')}
      >
        {translate('screens/SellScreen', 'Select account for payout')}
      </ThemedText>
      {/* TODO  -> came from SendScreen(fork) -> why? */}
      <ThemedTouchableOpacity
        onPress={props.onPress}
        dark={tailwind('bg-dfxblue-800 border-dfxblue-900')}
        light={tailwind({
          'bg-gray-200 border-0': props.isDisabled,
          'border-gray-300 bg-white': !props.isDisabled
        })}
        style={tailwind('border rounded w-full flex flex-row justify-between h-12 items-center px-2 mb-4')}
        testID='select_fiatAccount_input'
        disabled={props.isDisabled}
      >
        {props.fiatAccount === undefined || props.isDisabled
          ? (
            <ThemedText
              dark={tailwind({
                'text-dfxgray-500': !props.isDisabled,
                'text-dfxblue-900': props.isDisabled
              })}
              style={tailwind('text-sm')}
              testID='select_fiatAccount_placeholder'
            >
              {translate('screens/SellScreen', 'Select fiat account')}
            </ThemedText>
          )
          : (
            <View style={tailwind('flex flex-row')}>
              {/* <SymbolIcon symbol={props.fiat.displaySymbol} styleProps={tailwind('w-6 h-6')} /> */}
              {/* isValidAddress: (iban) => isValidIBAN('NL91ABNA0517164300') // TODO: implement */}
              <ThemedText
                style={tailwind('ml-2 font-medium')}
                testID='selected_fiatAccount'
              >
                {`${props.fiatAccount.fiat.name} / ${props.fiatAccount.iban}`}
              </ThemedText>
            </View>
          )}
        <ThemedIcon
          iconType='MaterialIcons'
          name='unfold-more'
          size={24}
          dark={tailwind({
            'text-dfxred-500': !props.isDisabled,
            'text-transparent': props.isDisabled
          })}
          light={tailwind({
            'text-primary-500': !props.isDisabled,
            'text-gray-500': props.isDisabled
          })}
          style={tailwind('-mr-1.5 flex-shrink-0')}
        />
      </ThemedTouchableOpacity>
    </>
  )
}

interface AmountForm {
  control: Control
  token: WalletToken
  onAmountChange: (amount: string) => void
  onClearButtonPress: () => void
}

function AmountRow ({
  token,
  control,
  onAmountChange,
  onClearButtonPress
}: AmountForm): JSX.Element {
  const reservedDFI = 0.1
  let maxAmount = token.symbol === 'DFI' ? new BigNumber(token.amount).minus(reservedDFI).toFixed(8) : token.amount
  maxAmount = BigNumber.max(maxAmount, 0).toFixed(8)
  const defaultValue = ''
  return (
    <>
      <Controller
        control={control}
        defaultValue={defaultValue}
        name='amount'
        render={({
          field: {
            onChange,
            value
          }
        }) => (
          <ThemedView
            dark={tailwind('bg-transparent')}
            light={tailwind('bg-transparent')}
            style={tailwind('flex-row w-full mt-8')}
          >
            <WalletTextInput
              autoCapitalize='none'
              onChange={onChange}
              onChangeText={onAmountChange}
              placeholder={translate('screens/SellScreen', 'Enter an amount')}
              style={tailwind('flex-grow w-2/5')}
              testID='amount_input'
              value={value}
              displayClearButton={value !== defaultValue}
              onClearButtonPress={onClearButtonPress}
              title={translate('screens/SellScreen', 'How much do you want to sell?')}
              titleTestID='title_sell'
              inputType='numeric'
            >
              <ThemedView
                dark={tailwind('bg-dfxblue-800')}
                light={tailwind('bg-white')}
                style={tailwind('flex-row items-center')}
              >
                <SetAmountButton
                  amount={new BigNumber(maxAmount)}
                  onPress={onAmountChange}
                  type={AmountButtonTypes.half}
                />

                <SetAmountButton
                  amount={new BigNumber(maxAmount)}
                  onPress={onAmountChange}
                  type={AmountButtonTypes.max}
                />
              </ThemedView>
            </WalletTextInput>

          </ThemedView>
        )}
        rules={{
          required: true,
          pattern: /^\d*\.?\d*$/,
          max: maxAmount,
          validate: {
            greaterThanZero: (value: string) => new BigNumber(value !== undefined && value !== '' ? value : 0).isGreaterThan(0)
          }
        }}
      />

      <InputHelperText
        testID='max_value'
        label={`${translate('screens/SellScreen', 'Available')}: `}
        content={maxAmount}
        suffix={` ${token.displaySymbol}`}
      />
    </>
  )
}

function getBottomSheetToken (tokens: WalletToken[]): BottomSheetToken[] {
  return tokens.filter(t => {
    return new BigNumber(t.amount).isGreaterThan(0) && t.id !== '0' && t.id !== '0_utxo'
  }).map(t => {
    const token: BottomSheetToken = {
      tokenId: t.id,
      available: new BigNumber(t.amount),
      token: {
        name: t.name,
        displaySymbol: t.displaySymbol,
        symbol: t.symbol,
        isLPS: t.isLPS
      }
    }
    return token
  })
}
