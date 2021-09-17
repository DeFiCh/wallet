import { Logging } from '@api'
import * as LocalAuthentication from 'expo-local-authentication'
import { AuthenticationType, LocalAuthenticationOptions, SecurityLevel } from 'expo-local-authentication'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { PrivacyLockPersistence } from '../api/wallet/privacy_lock'

export interface PrivacyLockContextI {
  // user's hardware condition, external
  fetchHardwareStatus: () => void // not likely needed, in case user change device's security setting
  hasHardware: boolean
  hardwareSecurityLevel: SecurityLevel
  supportedTypes: AuthenticationType[]
  isDeviceProtected: boolean
  isAuthenticating: boolean
  setIsAuthenticating: (isAuthenticating: boolean) => void

  // API
  isEnabled: boolean
  prompt: (options?: LocalAuthenticationOptions) => Promise<void>
  setEnabled: (enabled: boolean, options?: LocalAuthenticationOptions) => Promise<void>
  togglePrivacyLock: (options?: LocalAuthenticationOptions) => Promise<void>
}

const PrivacyLockContext = createContext<PrivacyLockContextI>(undefined as any)

export function usePrivacyLockContext (): PrivacyLockContextI {
  return useContext(PrivacyLockContext)
}

export function PrivacyLockContextProvider (props: React.PropsWithChildren<any>): JSX.Element | null {
  const [hasHardware, setHasHardware] = useState<boolean>(false)
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>(SecurityLevel.NONE)
  const [biometricHardwares, setBiometricHardwares] = useState<AuthenticationType[]>([])
  const [isDeviceProtected, setIsDeviceProtected] = useState<boolean>(false)
  const [isPrivacyLock, setIsPrivacyLock] = useState<boolean>()
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false)

  const fetchHardwareStatus = (): void => {
    LocalAuthentication.hasHardwareAsync()
      .then(async hasHardware => {
        if (!hasHardware) {
          setIsDeviceProtected(false)
        }

        const security = await LocalAuthentication.getEnrolledLevelAsync()
        setSecurityLevel(security)
        setBiometricHardwares(await LocalAuthentication.supportedAuthenticationTypesAsync())
        setIsDeviceProtected(security !== SecurityLevel.NONE)
        setHasHardware(hasHardware) // last, also used as flag indicated hardware check completed
      })
      .catch(error => {
        Logging.error(error)
        setHasHardware(false)
      })
  }

  useEffect(() => {
    fetchHardwareStatus()
    PrivacyLockPersistence.isEnabled()
      .then(enabled => setIsPrivacyLock(enabled))
      .catch(error => {
        Logging.error(error)
        setIsPrivacyLock(false)
      })
  }, [/* only load from persistence layer once */])

  const context: PrivacyLockContextI = {
    fetchHardwareStatus,
    hasHardware,
    hardwareSecurityLevel: securityLevel,
    supportedTypes: biometricHardwares,
    isDeviceProtected,
    isEnabled: isPrivacyLock === true,
    isAuthenticating,
    setIsAuthenticating,
    prompt: async (options) => {
      if (!isDeviceProtected || !(isPrivacyLock !== undefined && isPrivacyLock)) {
        return
      }
      setIsAuthenticating(true)
      await _authenticate(options)
    },
    setEnabled: async (enabled, options) => {
      if (isPrivacyLock as boolean === enabled) {
        return
      }
      await _authenticate(options)
      await PrivacyLockPersistence.set(enabled)
      setIsPrivacyLock(enabled)
    },
    togglePrivacyLock: async () => {
      if (isPrivacyLock === undefined) {
        return
      }
      return await context.setEnabled(!isPrivacyLock)
    }
  }

  if (isPrivacyLock === undefined) {
    return null
  }
  return (
    <PrivacyLockContext.Provider value={context}>
      {props.children}
    </PrivacyLockContext.Provider>
  )
}

async function _authenticate (options?: LocalAuthenticationOptions): Promise<void> {
  const result = await LocalAuthentication.authenticateAsync(options)
  if (!result.success) {
    throw new Error(result.error)
  }
}
