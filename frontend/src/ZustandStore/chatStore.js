import { create } from 'zustand'
import axios from 'axios'

const BASE_URL = 'http://localhost:4000/api/chat'

export const useChatStore = create((set, get) => ({
  sessions: [],
  messages: [],
  currentSessionId: null,
  loading: false,
  error: null,

  sendMessage: async ({ sessionId, user_input, class_num, subject, chapter }) => {
    set({ loading: true, error: null })
    
    try {

      const response = await axios.post(`${BASE_URL}/message`, {
        sessionId,
        user_input,
        class_num,
        subject,
        chapter,
      })

      const newMessage = response.data?.data
      if (newMessage) {
        set((state) => ({
          messages: [...state.messages, newMessage]
        }))
      }

    } 
    catch (err) {
      set({ error: err.message || 'Failed to send message' })
    } 
    finally {
      set({ loading: false })
    }
  },

  fetchSessions: async () => {
    set({ loading: true, error: null })

    try {
      const response = await axios.get(`${BASE_URL}/sessions`)

      set({ sessions: response.data?.data || [] })
    }
    catch (err) {
      set({ error: err.message || 'Failed to fetch sessions' })
    } 
    finally {
      set({ loading: false })
    }
  },

  fetchMessagesBySessionId: async (sessionId) => {
    set({ loading: true, error: null })
    try {
      const response = await axios.get(`${BASE_URL}/messages/${sessionId}`)

      set({ 
        messages: response.data?.data || [],
        currentSessionId: sessionId
      })
    } 
    catch (err) {
      set({ error: err.message || 'Failed to fetch messages' })
    } 
    finally {
      set({ loading: false })
    }
  },

  
}))
