import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("visionchart-theme") || "forest",
  setTheme : (theme) => {
    localStorage.setItem("visionchart-theme",theme)
    set({theme})
  },
}))