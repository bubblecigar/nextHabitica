import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Axios from 'axios'

const fetchPartyMembers = createAsyncThunk(
  'party/fetchPartyMembers',
  async () => {
    const response = await Axios.post('/api/test')
    return response.data
  }
)
const addPartyMember = createAsyncThunk(
  'party/addPartyMember',
  async () => {
    const response = await Axios.post('/api/party/add')
    return response.data
  }
)

export { fetchPartyMembers, addPartyMember }

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
    },
    [addPartyMember.fulfilled]: (state, action) => {
      state.members = [...state.members, action.payload]
    }
  }
})
// Action creators are generated for each case reducer function
export const { actions } = partySlice.actions

export default partySlice.reducer
