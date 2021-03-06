import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueComponents from 'unplugin-vue-components/vite'
import eslintPlugin from 'vite-plugin-eslint'
import viteSvgIcons from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

    return defineConfig({
        base: './',
        resolve: {
            alias: [
                { find: '@', replacement: '/src' },
            ],
        },
        server: {
            port: process.env.VITE_APP_PORT,
            host: '0.0.0.0',
        },
        plugins: [
            vue(),
            vueComponents({
                directoryAsNamespace: true,
            }),
            // eslintPlugin(),
            viteSvgIcons({
                iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
                symbolId: '[name]',
            }),
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "./src/style/mixins/mixin";',
                },
            },
        },
    })
}
