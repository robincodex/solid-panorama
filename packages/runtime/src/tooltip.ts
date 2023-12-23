export function setTooltipText(node: Panel, text: string | undefined) {
    if (!text) {
        node.ClearPanelEvent('onmouseover');
        node.ClearPanelEvent('onmouseout');
        return;
    }
    node.SetPanelEvent('onmouseover', () => {
        $.DispatchEvent('DOTAShowTextTooltip', node, text);
    });
    node.SetPanelEvent('onmouseout', () => {
        $.DispatchEvent('DOTAHideTextTooltip', node);
    });
}

export function setCustomTooltip(
    node: Panel,
    args: [string, string] | undefined
) {
    if (!args) {
        node.ClearPanelEvent('onmouseover');
        node.ClearPanelEvent('onmouseout');
        return;
    }
    let path = args[1];
    if (!path.startsWith('file://')) {
        path = `file://{resources}/layout/custom_game/${path.replace(
            '.xml',
            ''
        )}.xml`;
    }

    node.SetPanelEvent('onmouseover', () => {
        const params = node.GetAttributeString('__CustomTooltipParams__', '');
        $.DispatchEvent(
            'UIShowCustomLayoutParametersTooltip',
            node,
            args[0],
            path,
            params
        );
    });
    node.SetPanelEvent('onmouseout', () => {
        $.DispatchEvent('UIHideCustomLayoutTooltip', args[0]);
    });
}

export function setCustomTooltipParams(
    node: Panel,
    params: Record<string, string | number> | undefined
) {
    if (!params) {
        node.SetAttributeString('__CustomTooltipParams__', '');
        return;
    }
    let paramsString = Object.entries(params)
        .map(v => `${v[0]}=${v[1]}`)
        .join('&');
    node.SetAttributeString('__CustomTooltipParams__', paramsString);
}
