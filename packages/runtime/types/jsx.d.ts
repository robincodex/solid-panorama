declare namespace JSX {
    type Element =
        | PanelBase
        | ArrayElement
        | FunctionElement
        | (string & {})
        | number
        | boolean
        | null
        | undefined;
    interface ArrayElement extends Array<Element> {}
    interface FunctionElement {
        (): Element;
    }
}
