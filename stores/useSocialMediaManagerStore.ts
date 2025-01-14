import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'
import createDeepMerge from '@fastify/deepmerge'


const deepMerge = createDeepMerge({ all: true })
import { type MessageFormat } from '@/components/types/RecordingState'

export type SocialMediaManagerState = {
  messages: MessageFormat[]
}

export type K = string
export type V = string

export type SocialMediaManagerActions = {
  messages: MessageFormat[]
  setMessage: (nextPosition: SocialMediaManagerState['messages']) => void
  // getMessage: (getPosition: SocialMediaManagerState['messages']) => MessageFormat
  // decrementCount: () => void
  // incrementCount: () => void
}

export type SocialMediaManagerStore = SocialMediaManagerState & SocialMediaManagerActions

export const initSocialMediaManagerStore = (): SocialMediaManagerState => {
  return { messages: [{sender: Math.random().toString(36), response: "", id: Math.random().toString(36)}]}
}

export const defaultInitState: SocialMediaManagerState = {
  messages: [{sender: Math.random().toString(36), response: "", id: Math.random().toString(36)}],
}

export const socialMediaManagerStore = createStore<SocialMediaManagerStore>()(
    persist(
      (set) => ({
        messages: [{ sender: "test", response: "0", id: "1"}],
        setMessage: (messages) => set({ messages }),
        // getMessage: (id) => messages.find(test => test.id === id),
      }),
      {
        name: 'position-storage',
        merge: (persisted, current) => deepMerge(current, persisted) as never,
      },
    ),
)