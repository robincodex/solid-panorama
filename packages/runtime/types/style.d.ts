declare type PanelStyle = Partial<
    Omit<
        VCSSStyleDeclaration,
        | 'x'
        | 'y'
        | 'z'
        | 'width'
        | 'height'
        | 'minHeight'
        | 'maxHeight'
        | 'minWidth'
        | 'maxWidth'
        | 'border-radius'
        | 'borderRadius'
        | 'fontSize'
        | 'lineHeight'
        | 'margin'
        | 'marginBottom'
        | 'marginLeft'
        | 'marginRight'
        | 'marginTop'
        | 'padding'
        | 'paddingBottom'
        | 'paddingLeft'
        | 'paddingRight'
        | 'paddingTop'
    >
> & {
    x: string | number | null;
    y: string | number | null;
    z: string | number | null;
    width: string | number | null;
    height: string | number | null;
    minHeight: string | number | null;
    maxHeight: string | number | null;
    minWidth: string | number | null;
    maxWidth: string | number | null;
    'border-radius': string | number | null;
    borderRadius: string | number | null;
    fontSize: string | number | null;
    lineHeight: string | number | null;
    margin: string | number | null;
    marginBottom: string | number | null;
    marginLeft: string | number | null;
    marginRight: string | number | null;
    marginTop: string | number | null;
    padding: string | number | null;
    paddingBottom: string | number | null;
    paddingLeft: string | number | null;
    paddingRight: string | number | null;
    paddingTop: string | number | null;
};
