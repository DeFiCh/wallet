import { NavigationProp, useNavigation } from '@react-navigation/native'
import { BalanceParamList } from '@screens/AppNavigator/screens/Balances/BalancesNavigator'
import { DFITokenSelector, DFIUtxoSelector, unifiedDFISelector, WalletToken } from '@store/wallet'
import { tailwind } from '@tailwind'
import { IconButton } from '@components/IconButton'
import { ThemedIcon, ThemedView } from '@components/themed'
import { View } from '@components'
import { getNativeIcon } from '@components/icons/assets'
import { useSelector } from 'react-redux'
import { RootState } from '@store'
import { InfoTextLink } from '@components/InfoTextLink'
import { TokenNameText } from '@screens/AppNavigator/screens/Balances/components/TokenNameText'
import { TokenAmountText } from '@screens/AppNavigator/screens/Balances/components/TokenAmountText'
import { useTokenPrice } from '@screens/AppNavigator/screens/Balances/hooks/TokenPrice'
import { useDisplayBalancesContext } from '@contexts/DisplayBalancesContext'
import { TextSkeletonLoader } from '@components/TextSkeletonLoader'
import BigNumber from 'bignumber.js'
import { TokenBreakdownPercentage } from './TokenBreakdownPercentage'
import React, { useState } from 'react'
import { LockedBalance, useTokenLockedBalance } from '../hooks/TokenLockedBalance'
import { TokenBreakdownDetails } from './TokenBreakdownDetails'
import { TouchableOpacity } from 'react-native'

interface DFIBalaceCardProps {
  denominationCurrency: string
}

export function DFIBalanceCard ({ denominationCurrency }: DFIBalaceCardProps): JSX.Element {
  const DFIToken = useSelector((state: RootState) => DFITokenSelector(state.wallet))
  const DFIUtxo = useSelector((state: RootState) => DFIUtxoSelector(state.wallet))
  const DFIUnified = useSelector((state: RootState) => unifiedDFISelector(state.wallet))
  const { hasFetchedToken } = useSelector((state: RootState) => state.wallet)
  const { getTokenPrice } = useTokenPrice(denominationCurrency) // input based on selected denomination from portfolio tab
  const { isBalancesDisplayed } = useDisplayBalancesContext()
  const lockedToken = useTokenLockedBalance({ symbol: 'DFI', denominationCurrency }) as LockedBalance ?? { amount: new BigNumber(0), tokenValue: new BigNumber(0) }
  const usdAmount = getTokenPrice(DFIUnified.symbol, lockedToken.amount.plus(DFIUnified.amount), DFIUnified.isLPS)
  const availableValue = getTokenPrice(DFIUnified.symbol, new BigNumber(DFIUnified.amount))
  const DFIIcon = getNativeIcon('_UTXO')
  const [isBreakdownExpanded, setIsBreakdownExpanded] = useState(false)
  const onBreakdownPress = (): void => {
    setIsBreakdownExpanded(!isBreakdownExpanded)
  }

  return (
    <ThemedView
      light={tailwind('bg-white border-gray-100')}
      dark={tailwind('bg-dfxblue-800')}
      style={tailwind('mx-4 mb-1.5 rounded-lg flex-1')}
      testID='dfi_balance_card'
    >
      <View style={tailwind('flex-col flex-1')}>
        <View style={tailwind('m-4 mb-1')}>
          <View style={tailwind('flex-row')}>
            <View style={tailwind('flex-row items-center flex-grow')}>

              <DFIIcon width={32} height={32} />
              <TokenNameText displaySymbol='DFI' name='DeFiChain' testID='total_dfi_label' />
            </View>

            {
              hasFetchedToken
                ? (
                  <TokenAmountText
                    tokenAmount={lockedToken.amount.plus(DFIUnified.amount).toFixed(8)}
                    usdAmount={usdAmount}
                    testID='dfi_total_balance'
                    isBalancesDisplayed={isBalancesDisplayed}
                    denominationCurrency={denominationCurrency}
                  />
                )
                : (
                  <View style={tailwind('pt-1')}>
                    <View style={tailwind('mb-1.5')}>
                      <TextSkeletonLoader
                        iContentLoaderProps={{
                          width: '150',
                          height: '16',
                          testID: 'dfi_balance_skeleton_loader'
                        }}
                        textHorizontalOffset='30'
                        textWidth='120'
                      />
                    </View>
                    <View>
                      <TextSkeletonLoader
                        iContentLoaderProps={{
                          width: '150',
                          height: '12',
                          testID: 'dfi_USD_balance_skeleton_loader'
                        }}
                        textHorizontalOffset='30'
                        textWidth='120'
                      />
                    </View>
                  </View>
                )
            }
          </View>

          <View style={tailwind('flex flex-row justify-center')}>
            <TouchableOpacity
              onPress={onBreakdownPress}
              style={tailwind('ml-4')}
              testID='details_dfi'
            >
              <ThemedIcon
                light={tailwind('text-primary-500')}
                dark={tailwind('text-dfxred-500')}
                iconType='MaterialIcons'
                name={!isBreakdownExpanded ? 'expand-more' : 'expand-less'}
                size={28}
              />
            </TouchableOpacity>
          </View>

          {isBreakdownExpanded && (
            <ThemedView
              light={tailwind('border-t border-gray-100')}
              dark={tailwind('border-t border-dfxblue-900')}
              style={tailwind('mt-1 pt-2 mb-2')}
            >
              <TokenBreakdownPercentage
                symbol='DFI'
                availableAmount={new BigNumber(DFIUnified.amount)}
                onBreakdownPress={onBreakdownPress}
                isBreakdownExpanded={isBreakdownExpanded}
                lockedAmount={lockedToken.amount}
                testID='dfi'
              />
              <TokenBreakdownDetails
                hasFetchedToken={hasFetchedToken}
                lockedAmount={lockedToken.amount}
                lockedValue={lockedToken.tokenValue}
                availableAmount={new BigNumber(DFIUnified.amount)}
                availableValue={availableValue}
                testID='dfi'
                dfiUtxo={DFIUtxo}
                dfiToken={DFIToken}
                denominationCurrency={denominationCurrency}
              />
              <DFIBreakdownAction dfiUnified={DFIUnified} />
            </ThemedView>
          )}
        </View>
      </View>
    </ThemedView>
  )
}

function DFIBreakdownAction ({ dfiUnified }: { dfiUnified: WalletToken }): JSX.Element {
  const navigation = useNavigation<NavigationProp<BalanceParamList>>()

  return (
    <View style={tailwind('flex-row mt-4')}>
      <InfoTextLink
        onPress={() => navigation.navigate('TokensVsUtxo')}
        text='Learn more about DFI'
        containerStyle={tailwind('w-9/12')}
        testId='token_vs_utxo_info'
      />
      <View style={tailwind('flex-row flex-grow justify-end')}>
        <IconButton
          iconName='swap-vert'
          iconSize={24}
          iconType='MaterialIcons'
          onPress={() => navigation.navigate({
            name: 'Convert',
            params: { mode: 'utxosToAccount' },
            merge: true
          })}
          testID='convert_dfi_button'
          style={tailwind('mr-2')}
        />
        <IconButton
          iconName='arrow-upward'
          iconSize={24}
          iconType='MaterialIcons'
          onPress={() => navigation.navigate({
            name: 'Send',
            params: { token: dfiUnified },
            merge: true
          })}
          testID='send_dfi_button'
        />
      </View>
    </View>
  )
}
