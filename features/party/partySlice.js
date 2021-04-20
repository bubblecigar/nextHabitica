import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Axios from 'axios'

const fetchPartyMembers = createAsyncThunk(
  'party/fetchPartyMembers',
  async () => {
    const response = await Axios.post('/api/test')
    return response.data
  }
)

export { fetchPartyMembers }

export const partySlice = createSlice({
  name: 'party',
  initialState: {
    members: []
  },
  reducers: { },
  extraReducers: {
    [fetchPartyMembers.fulfilled]: (state, action) => {
      console.log('action:', action)
      state.members = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { getAll } = partySlice.actions

export default partySlice.reducer
