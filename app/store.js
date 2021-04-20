import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice'
import partyReducer from '../features/party/partySlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    party: partyReducer
  }
})
