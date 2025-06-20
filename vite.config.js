import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Otimizações para APK/Mobile
    target: 'es2015',
    minify: 'terser',
    cssMinify: true,
    sourcemap: false,
    
    // Code splitting para reduzir chunk inicial
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          charts: ['chart.js', 'react-chartjs-2', 'recharts'],
          utils: ['date-fns', 'clsx', 'class-variance-authority']
        }
      }
    },
    
    // Otimizações de performance
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log em produção
        drop_debugger: true
      }
    },
    
    // Limite de chunk aumentado para evitar warnings
    chunkSizeWarningLimit: 1000
  },
  
  // Configurações para desenvolvimento mobile
  server: {
    host: '0.0.0.0', // Permite acesso de dispositivos na rede
    port: 5174,
    strictPort: false // Permite que o Vite encontre uma porta livre automaticamente
  },
  
  // Otimizações para PWA
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
  }
})
