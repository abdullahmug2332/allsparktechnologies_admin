// src/redux/toggleSlice.ts
import { createSlice } from '@reduxjs/toolkit'

// ✅ Define the type for state
interface ToggleState {
  value: boolean
}

const initialState: ToggleState = {
  value: true,
}

const toggleSlice = createSlice({
  name: 'toggle',
  initialState,
  reducers: {
    toggleValue: (state) => {
      state.value = !state.value
    },
  },
})

export const { toggleValue } = toggleSlice.actions
export default toggleSlice.reducer
