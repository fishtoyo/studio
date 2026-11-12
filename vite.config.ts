import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 目前發佈在 https://fishtoyo.github.io/studio/
// 之後綁定自訂網域時，把 base 改成 '/'
export default defineConfig({
  base: '/studio/',
  plugins: [react()],
})
