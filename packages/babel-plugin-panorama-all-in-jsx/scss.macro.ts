// @ts-check
import {createMacro} from 'babel-plugin-macros'

export default createMacro(function({references, state, babel}) {
    console.log(state)
    for(const node of references.default) {
        console.log(node)
    }
})