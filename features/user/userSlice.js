import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: 1,
    name: 'bubblecigar'
  },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload || Math.random().toString()
    }
  }
})

// Action creators are generated for each case reducer function
export const { setName } = userSlice.actions

export default userSlice.reducer
