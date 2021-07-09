import typescript from '@rollup/plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import cleaner from 'rollup-plugin-cleaner';

export default {
    input: './src/index.ts',
    plugins: [
        cleaner({
            targets: [
                './dist'
            ]
        }),
        typescript({
            "declaration": true,
            "outDir": "./dist",
        }),
        resolve({ extensions: ['.js', '.ts'] }),
        commonjs({ extensions: ['.js', '.ts'] })
    ],
    output: {
        dir: './dist',
        format: 'es',
        name: 'easyroute'
    }
}
