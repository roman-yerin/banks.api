import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import { dts } from "rollup-plugin-dts"
import alias from "@rollup/plugin-alias"
import tsConfigPaths from "rollup-plugin-tsconfig-paths"


const name = "banks.api"

const bundle = config => ({
    ...config,
    input: 'src/index.ts',
    output: {
        dir: 'dist',
        sourcemap: true,
    },
})

const conf = [
    bundle({
        plugins: [
            tsConfigPaths(),
            typescript(),
            resolve(),
            ],
        output: [
            {
                file: `${name}.js`,
                format: 'es',
                sourcemap: true,
            }
        ],
    }),
    bundle({
        plugins: [resolve(), dts()],
        output: {
            file: `${name}.d.ts`,
            format: 'es',
        },
    }),
]

console.log(conf)
export default conf