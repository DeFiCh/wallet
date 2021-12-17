import { LoanToken } from '@defichain/whale-api-client/dist/api/loan'
import { EnvironmentNetwork } from '../../../../../../shared/environment'
import {
  checkCollateralDetailValues,
  checkVaultDetailCollateralAmounts,
  checkVaultDetailValues
} from '../../../../support/loanCommands'
import { VaultStatus } from '../../../../../app/screens/AppNavigator/screens/Loans/VaultStatusTypes'
import BigNumber from 'bignumber.js'

context('Wallet - Loans', () => {
  before(function () {
    cy.createEmptyWallet(true)
    cy.sendDFItoWallet().wait(6000)
  })

  it('should display correct loans from API', function () {
    cy.getByTestID('bottom_tab_loans').click()
    cy.getByTestID('button_create_vault').click()
    cy.getByTestID('loan_scheme_option_0').click()
    cy.getByTestID('create_vault_submit_button').click()
    cy.getByTestID('button_confirm_create_vault').click().wait(4000)
    cy.closeOceanInterface()
    cy.intercept('**/loans/tokens?size=200').as('loans')
    cy.wait(['@loans']).then((intercept: any) => {
      const data: any[] = intercept.response.body.data
      cy.getByTestID('loans_tabs_BROWSE_LOANS').click()
      data.forEach((loan: LoanToken, i) => {
        // const price = loan.activePrice?.active?.amount ?? 0
        cy.getByTestID(`loan_card_${i}_display_symbol`).contains(loan.token.displaySymbol)
        cy.getByTestID(`loan_card_${i}_interest_rate`).contains(`${loan.interest}%`)
        // TODO update to fix volatility
        /* cy.getByTestID(`loan_card_${i}_loan_amount`)
          .contains(price > 0 ? `$${Number(new BigNumber(price).toFixed(2)).toLocaleString()}` : '-') */
      })
    })
  })
})

context('Wallet - Loans Feature Gated', () => {
  it('should not have loans tab if loan feature is blocked', function () {
    cy.intercept('**/settings/flags', {
      body: []
    })
    cy.createEmptyWallet(true)
    cy.getByTestID('bottom_tab_loans').should('not.exist')
  })

  it('should not have loans tab if feature flag api does not contains loan', function () {
    cy.intercept('**/settings/flags', {
      body: [
        {
          id: 'foo',
          name: 'bar',
          stage: 'alpha',
          version: '>=0.0.0',
          description: 'foo',
          networks: [EnvironmentNetwork.RemotePlayground, EnvironmentNetwork.LocalPlayground],
          platforms: ['ios', 'android', 'web']
        }
      ]
    })
    cy.createEmptyWallet(true)
    cy.getByTestID('bottom_tab_loans').should('not.exist')
  })

  it('should not have loans tab if feature flag api failed', function () {
    cy.intercept('**/settings/flags', {
      statusCode: 404,
      body: '404 Not Found!',
      headers: {
        'x-not-found': 'true'
      }
    })
    cy.createEmptyWallet(true)
    cy.getByTestID('bottom_tab_loans').should('not.exist')
  })

  it('should not have loans tab if loan feature is beta and not activated by user', function () {
    cy.intercept('**/settings/flags', {
      body: [
        {
          id: 'loan',
          name: 'Loan',
          stage: 'beta',
          version: '>=0.0.0',
          description: 'Loan',
          networks: [EnvironmentNetwork.RemotePlayground, EnvironmentNetwork.LocalPlayground],
          platforms: ['ios', 'android', 'web']
        }
      ]
    })
    cy.createEmptyWallet(true)
    cy.getByTestID('bottom_tab_loans').should('not.exist')
  })

  it('should have loans tab if loan feature is beta is activated by user', function () {
    cy.intercept('**/settings/flags', {
      body: [
        {
          id: 'loan',
          name: 'Loan',
          stage: 'beta',
          version: '>=0.0.0',
          description: 'Loan',
          networks: [EnvironmentNetwork.RemotePlayground, EnvironmentNetwork.LocalPlayground],
          platforms: ['ios', 'android', 'web']
        }
      ]
    })
    cy.createEmptyWallet(true)
    cy.getByTestID('bottom_tab_balances').click()
    cy.getByTestID('header_settings').click()
    cy.getByTestID('setting_navigate_About').click()
    cy.getByTestID('try_beta_features').click()
    cy.getByTestID('feature_loan_row').should('exist')
    cy.getByTestID('feature_loan_switch').click().should(() => {
      expect(localStorage.getItem('WALLET.ENABLED_FEATURES')).to.eq('["loan"]')
    })
    cy.getByTestID('bottom_tab_loans').should('exist')
    cy.getByTestID('feature_loan_switch').click().should(() => {
      expect(localStorage.getItem('WALLET.ENABLED_FEATURES')).to.eq('[]')
    })
  })

  it('should have loans tab if loan feature is public', function () {
    cy.intercept('**/settings/flags', {
      body: [
        {
          id: 'loan',
          name: 'Loan',
          stage: 'public',
          version: '>=0.0.0',
          description: 'Loan',
          networks: [EnvironmentNetwork.RemotePlayground, EnvironmentNetwork.LocalPlayground],
          platforms: ['ios', 'android', 'web']
        }
      ]
    })
    cy.createEmptyWallet(true)
    cy.getByTestID('bottom_tab_loans').should('exist')
  })
})

context('Wallet - Loans - Take Loans', () => {
  let vaultId = ''
  const walletTheme = { isDark: false }
  before(function () {
    cy.createEmptyWallet(true)
    cy.sendDFItoWallet().sendDFITokentoWallet().sendTokenToWallet(['BTC']).wait(6000)
    cy.setWalletTheme(walletTheme)
    cy.getByTestID('bottom_tab_loans').click()
    cy.getByTestID('empty_vault').should('exist')
    cy.createVault(0)
    cy.getByTestID('vault_card_0_manage_loans_button').should('not.exist')
    cy.getByTestID('vault_card_0_vault_id').then(($txt: any) => {
      vaultId = $txt[0].textContent
    })
    cy.getByTestID('vault_card_0_edit_collaterals_button').click()
    cy.addCollateral('10', 'DFI')
    cy.addCollateral('10', 'dBTC')
  })

  it('should add collateral', function () {
    cy.go('back')
    cy.wait(2000)
    cy.getByTestID('vault_card_0_status').contains('READY')
    cy.getByTestID('vault_card_0_collateral_token_group_DFI').should('exist')
    cy.getByTestID('vault_card_0_collateral_token_group_dBTC').should('exist')
    cy.getByTestID('vault_card_0_total_collateral').contains('$1,500.00')
  })

  it('should add loan', function () {
    let annualInterest: string
    cy.getByTestID('vault_card_0_manage_loans_button').click()
    checkVaultDetailValues('READY', vaultId, '$1,500.00', '$0.00', '5')
    cy.getByTestID('button_browse_loans').click()
    cy.getByTestID('loan_card_DUSD').click()
    cy.getByTestID('form_input_borrow').type('1000').blur()
    cy.wait(3000)
    cy.getByTestID('text_input_usd_value').should('have.value', '1000.00')
    cy.getByTestID('form_input_borrow_error').contains('This amount may place the vault in liquidation')
    cy.getByTestID('text_resulting_col_ratio').contains('150.00%')
    cy.getByTestID('borrow_loan_submit_button').should('have.attr', 'aria-disabled')
    cy.getByTestID('form_input_borrow').clear().type('100').blur()
    cy.wait(3000)
    cy.getByTestID('text_input_usd_value').should('have.value', '100.00')
    cy.getByTestID('text_resulting_col_ratio').contains('1,500.00%')
    cy.getByTestID('text_estimated_annual_interest').then(($txt: any) => {
      annualInterest = $txt[0].textContent.replace(' DUSD', '').replace(',', '')
    })
    cy.getByTestID('text_total_loan_with_annual_interest').then(($txt: any) => {
      const totalLoanWithAnnualInterest = $txt[0].textContent.replace(' DUSD', '').replace(',', '')
      expect(new BigNumber(totalLoanWithAnnualInterest).toFixed(8)).to.be.equal(new BigNumber('1000').plus(annualInterest).toFixed(8))
    })
    cy.getByTestID('borrow_loan_submit_button').click()
    cy.getByTestID('text_borrow_amount').contains('100.00000000')
    cy.getByTestID('text_borrow_amount_suffix').contains('DUSD')
    cy.getByTestID('text_transaction_type').contains('Borrow loan token')
    cy.getByTestID('tokens_to_borrow').contains('100.00000000')
    cy.getByTestID('tokens_to_borrow_suffix').contains('DUSD')
    cy.getByTestID('text_vault_id').contains(vaultId)
    cy.getByTestID('text_collateral_amount').contains('$1,500.00')
    cy.getByTestID('text_current_collateral_ratio').contains('N/A')
    cy.getByTestID('text_resulting_col_ratio').contains('1,500.00')
    cy.getByTestID('button_confirm_borrow_loan').click().wait(3000)
    cy.getByTestID('txn_authorization_description')
      .contains('Borrowing 100.00000000 DUSD')
    cy.closeOceanInterface()
  })

  it('should verify vault card', function () {
    cy.checkVaultTag('ACTIVE', VaultStatus.Healthy, 'vault_card_0_status', walletTheme.isDark)
    cy.getByTestID('vault_card_0_col_ratio').contains('1,500%')
    cy.getByTestID('vault_card_0_min_ratio').contains('150%')
    cy.getByTestID('vault_card_0_total_loan').contains('$100')
    cy.getByTestID('vault_card_0_loan_symbol_DUSD').should('exist')
    cy.getByTestID('vault_card_0_total_collateral').contains('$1,500.00')
  })

  it('should verify vault details page', function () {
    cy.getByTestID('vault_card_0').click()
    checkVaultDetailValues('ACTIVE', vaultId, '$1,500.00', '$100', '5')
    cy.getByTestID('vault_id_section_col_ratio').contains('1,500%')
    cy.getByTestID('vault_id_section_min_ratio').contains('150%')
  })

  it('should verify collaterals tab', function () {
    checkVaultDetailCollateralAmounts('10.00000000', 'DFI', '66.67%')
    checkVaultDetailCollateralAmounts('10.00000000', 'dBTC', '33.33%')
  })

  it('should verify vault details tab', function () {
    cy.getByTestID('collateral_tab_DETAILS').click()
    cy.getByTestID('text_min_col_ratio').contains('150')
    cy.getByTestID('text_vault_interest_ratio').contains('5.00')
    cy.getByTestID('text_col_ratio').contains('1,500.00%')
    cy.getByTestID('text_collateral_value').contains('$1,500.00')
    cy.getByTestID('text_active_loans').contains('1')
    cy.getByTestID('text_total_loan_value').contains('$100')
  })

  it('should verify loan tab', function () {
    cy.getByTestID('collateral_tab_LOANS').click()
    cy.getByTestID('loan_card_DUSD').contains('DUSD')
    cy.getByTestID('loan_card_DUSD_outstanding_balance').contains('100')
    cy.getByTestID('loan_card_DUSD_payback_loan').should('exist')
    cy.getByTestID('loan_card_DUSD_borrow_more').click()
  })

  it('should borrow more loan', function () {
    let annualInterest: string
    cy.getByTestID('loan_symbol').contains('DUSD')
    cy.getByTestID('loan_outstanding_balance').contains('100')
    cy.getByTestID('vault_id').contains(vaultId)
    cy.checkVaultTag('ACTIVE', VaultStatus.Healthy, 'vault_status_tag', walletTheme.isDark)
    cy.getByTestID('loan_col_ratio').contains('1,500.00%')
    cy.getByTestID('loan_min_col').contains('150.00%')
    cy.getByTestID('loan_add_input').type('1000').blur()
    cy.getByTestID('loan_add_input_error').contains('This amount may place the vault in liquidation')
    cy.getByTestID('text_input_usd_value').should('have.value', '1000.00')
    cy.getByTestID('text_resulting_col_ratio').contains('136')
    cy.getByTestID('borrow_more_button').should('have.attr', 'aria-disabled')
    cy.getByTestID('text_estimated_annual_interest').then(($txt: any) => {
      annualInterest = $txt[0].textContent.replace(' DUSD', '').replace(',', '')
    })
    cy.getByTestID('text_total_loan_with_annual_interest').then(($txt: any) => {
      const totalLoanWithAnnualInterest = $txt[0].textContent.replace(' DUSD', '').replace(',', '')
      expect(new BigNumber(totalLoanWithAnnualInterest).toFixed(8)).to.be.equal(new BigNumber('1000').plus(annualInterest).toFixed(8))
    })
    cy.getByTestID('text_total_loan_with_annual_interest_suffix').contains('DUSD')
    cy.getByTestID('loan_add_input').clear().type('648').blur()
    cy.getByTestID('text_resulting_col_ratio').contains('200')
    cy.getByTestID('borrow_more_button').click()
    // check confirm page
    cy.getByTestID('text_borrow_amount').contains('648.00000000')
    cy.getByTestID('text_borrow_amount_suffix').contains('DUSD')
    cy.getByTestID('text_transaction_type').contains('Borrow loan token')
    cy.getByTestID('tokens_to_borrow').contains('648.00000000')
    cy.getByTestID('tokens_to_borrow_suffix').contains('DUSD')
    cy.getByTestID('text_vault_id').contains(vaultId)
    cy.getByTestID('text_collateral_amount').contains('$1,500.00')
    cy.getByTestID('text_resulting_col_ratio').contains('200')
    cy.getByTestID('button_confirm_borrow_loan').click().wait(3000)
    cy.getByTestID('txn_authorization_description').contains('Borrowing 648.00000000 DUSD')
    cy.closeOceanInterface()
  })

  it('should verify vault card after adding loans', function () {
    cy.checkVaultTag('ACTIVE', VaultStatus.AtRisk, 'vault_card_0_status', walletTheme.isDark)
    cy.getByTestID('vault_card_0_col_ratio').contains('201%')
    cy.getByTestID('vault_card_0_min_ratio').contains('150%')
    cy.getByTestID('vault_card_0_total_loan').contains('$748')
    cy.getByTestID('vault_card_0_loan_symbol_DUSD').should('exist')
    cy.getByTestID('vault_card_0_total_collateral').contains('$1,500.00')
  })

  it('should verify collaterals page', function () {
    cy.getByTestID('vault_card_0_edit_collaterals_button').click()
    checkCollateralDetailValues('ACTIVE', '$1,500.00', '$748.00', '201.00', '%', '150.00', '5.00')
  })
})
