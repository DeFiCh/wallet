import { View } from '@components'
import { ThemedTouchableOpacity, ThemedText, ThemedView, ThemedIcon } from '@components/themed'
import { LoanVaultActive, LoanVaultState } from '@defichain/whale-api-client/dist/api/loan'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { useThemeContext } from '@shared-contexts/ThemeProvider'
import { LoanVault } from '@store/loans'
import { tailwind } from '@tailwind'
import { translate } from '@translations'
import React, { memo } from 'react'
import { Platform, TouchableOpacity } from 'react-native'
import { CollateralizationRatio } from './CollateralizationRatio'

interface BottomSheetVaultListProps {
  headerLabel: string
  onCloseButtonPress: () => void
  onVaultPress?: (vault: LoanVaultActive) => void
  navigateToScreen?: {
    screenName: string
    onButtonPress: () => void
  }
  vaults: LoanVault[]
}

export const BottomSheetVaultList = ({
  headerLabel,
  onCloseButtonPress,
  onVaultPress,
  vaults
}: BottomSheetVaultListProps): React.MemoExoticComponent<() => JSX.Element> => memo(() => {
  const { isLight } = useThemeContext()

  return (
    <BottomSheetFlatList
      data={vaults}
      renderItem={({ item }: { item: LoanVault}): JSX.Element => (
        <ThemedTouchableOpacity
          disabled={!(item.state === LoanVaultState.ACTIVE || item.state === LoanVaultState.MAY_LIQUIDATE)}
          onPress={() => {
            if (onVaultPress !== undefined && item.state !== LoanVaultState.IN_LIQUIDATION) {
              onVaultPress(item)
            }
          }}
          style={tailwind('px-4 py-3.5 flex flex-row items-center justify-between')}
        >
          <View style={tailwind('flex flex-row w-6/12 flex-1 mr-12')}>
            <View style={tailwind('flex flex-row items-center')}>
              <ThemedText
                ellipsizeMode='middle'
                numberOfLines={1}
                style={tailwind('w-4/12 flex-grow mr-2')}
              >
                {item.vaultId}
              </ThemedText>
              {/* <VaultStatusTag status={VaultStatus.Healthy} // TODO: add status tag /> */}
            </View>
          </View>
          <View style={tailwind('flex items-end')}>
            <ThemedText
              light={tailwind('text-gray-400')}
              dark={tailwind('text-gray-500')}
              style={tailwind('text-xs')}
            >
              {translate('components/BottomSheetVaultList', 'Collateral ratio')}
            </ThemedText>
            <CollateralizationRatio
              value={item.state === LoanVaultState.IN_LIQUIDATION ? '' : item.collateralRatio}
              minColRatio={item.state === LoanVaultState.IN_LIQUIDATION ? '' : item.loanScheme.minColRatio}
            />
          </View>
        </ThemedTouchableOpacity>
      )}
      ListHeaderComponent={
        <ThemedView
          light={tailwind('bg-white border-gray-200')}
          dark={tailwind('bg-gray-800 border-gray-700')}
          style={tailwind('flex flex-row justify-between items-center px-4 py-2 border-b', { 'py-3.5 border-t -mb-px': Platform.OS === 'android' })}
        >
          <ThemedText
            style={tailwind('text-lg font-medium')}
          >
            {headerLabel}
          </ThemedText>
          <TouchableOpacity onPress={onCloseButtonPress}>
            <ThemedIcon iconType='MaterialIcons' name='close' size={20} />
          </TouchableOpacity>
        </ThemedView>
      }
      stickyHeaderIndices={[0]}
      keyExtractor={(item) => item.vaultId}
      style={tailwind({ 'bg-gray-800': !isLight, 'bg-white': isLight })}
    />
  )
})
