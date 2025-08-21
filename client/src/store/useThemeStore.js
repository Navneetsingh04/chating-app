import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("VisionChat-theme") || "forest",
  setTheme : (theme) => {
    localStorage.setItem("VisionChat-theme",theme)
    set({theme})
  },
}))