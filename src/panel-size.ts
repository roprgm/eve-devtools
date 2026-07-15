export const defaultPanelWidth = 380;
export const minimumPanelWidth = 280;
export const minimumPageWidth = 320;

export function canDock(viewportWidth: number): boolean {
  return viewportWidth >= minimumPanelWidth + minimumPageWidth;
}

export function maximumPanelWidth(viewportWidth: number): number {
  return Math.max(minimumPanelWidth, viewportWidth - minimumPageWidth);
}

export function panelWidth(storedWidth: number, viewportWidth: number): number {
  if (!canDock(viewportWidth)) {
    return viewportWidth;
  }
  return Math.min(
    maximumPanelWidth(viewportWidth),
    Math.max(minimumPanelWidth, storedWidth),
  );
}
