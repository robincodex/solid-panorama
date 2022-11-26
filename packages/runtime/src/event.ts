import { noop } from './utils';

export function setDragEvent(
    node: Panel,
    event: string,
    callback: ((...args: any[]) => void) | undefined
): void {
    event = event.slice(2);
    if (!callback) {
        $.RegisterEventHandler(event, node, noop);
        return;
    }
    if (event === 'DragStart') {
        node.SetDraggable(true);
    }
    $.RegisterEventHandler(event, node, callback);
}
