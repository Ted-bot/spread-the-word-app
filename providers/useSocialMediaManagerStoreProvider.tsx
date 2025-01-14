// 'use client'

// import { type ReactNode, createContext, useRef, useContext } from 'react'
// import { useStore } from 'zustand'

// // import defaultInitState from '../stores/useSocialMediaManagerStore';
// import {
//     type SocialMediaManagerStore, 
//     defaultInitState,
//     createSocialMediaManagerStore,
//     initSocialMediaManagerStore, 
// } from '@/stores/useSocialMediaManagerStore'

// export type SocialMediaManagerStoreApi = ReturnType<typeof createSocialMediaManagerStore>

// export const SocialMediaManagerStoreContext = createContext<SocialMediaManagerStoreApi | undefined>(
//   undefined,
// )

// export interface SocialMediaManagerStoreProviderProps {
//   children: ReactNode
// }

// export const SocialMediaManagerStoreProvider = ({
//   children,
// }: SocialMediaManagerStoreProviderProps) => {
//   const storeRef = useRef<SocialMediaManagerStoreApi>(null)
//   if (!storeRef.current) {
//     storeRef.current = createSocialMediaManagerStore(initSocialMediaManagerStore())
//   }

//   return (
//     <SocialMediaManagerStoreContext.Provider value={storeRef.current}>
//       {children}
//     </SocialMediaManagerStoreContext.Provider>
//   )
// }

// export const useSocialMediaManagerStore = <T,>(
//   selector: (store: SocialMediaManagerStore) => T,
// ): T => {
//   const counterStoreContext = useContext(SocialMediaManagerStoreContext)

//   if (!counterStoreContext) {
//     throw new Error(`useSocialMediaManagerStore must be used within SocialMediaManagerStoreProvider`)
//   }

//   return useStore(counterStoreContext, selector)
// }