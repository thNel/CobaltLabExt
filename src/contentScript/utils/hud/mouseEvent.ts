type MouseEventType =
  'click'
  | 'dblclick'
  | 'mousedown'
  | 'mouseenter'
  | 'mouseleave'
  | 'mousemove'
  | 'mouseout'
  | 'mouseover'
  | 'mouseup';

export const triggerMouseEvent = (node: Element, eventType: MouseEventType) => {
  const clickEvent = new MouseEvent(eventType, {bubbles: true, cancelable: true});
  node.dispatchEvent(clickEvent);
}