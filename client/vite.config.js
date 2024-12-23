import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import dotenv from "dotenv"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.VITE_KEY_DB": JSON.stringify(process.env.VITE_KEY_DB),
    "process.env.VITE_KEY_CONNECTION_STRING": JSON.stringify(process.env.VITE_KEY_CONNECTION_STRING),
    "process.env.VITE_KEY_USERNAME": JSON.stringify(process.env.VITE_KEY_USERNAME),
    "process.env.VITE_KEY_PASSWORD": JSON.stringify(process.env.VITE_KEY_PASSWORD),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  }
})
