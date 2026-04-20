import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    const publicUrl = env.PUBLIC_URL || '/'

    const base =
        publicUrl === '/'
            ? '/'
            : `/${publicUrl.replace(/^\/|\/$/g, '')}/`

    return {
        plugins: [react()],
        base,
    }
})