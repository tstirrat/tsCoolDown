import "@wartoshika/wow-declarations";

export const CONFIG_DEFAULTS = {
  x: 200,
  y: 200
};
export const BACKDROP: WoWAPI.Backdrop = {
  bgFile: 'Interface\\Tooltips\\UI-Tooltip-Background',
  edgeFile: 'Interface\\Tooltips\\UI-Tooltip-Border',
  tile: true,
  tileSize: 12,
  edgeSize: 12,
  insets: {left: 2, right: 2, top: 2, bottom: 2}
};
export const COOLDOWN_FONT: JSX.Font =
    ['Interface\\AddOns\\tsCoolDown\\Fonts\\coolDownFont.ttf', 22];
export const ANCHOR_FONT: JSX.Font =
    ['Interface\\AddOns\\tsCoolDown\\Fonts\\coolDownFont.ttf', 18];
export const COLOR_BLACK: JSX.Color4 = [0, 0, 0, 1];
export const COLOR_WHITE: JSX.Color4 = [255, 255, 255, 1];

export const ICON_SIZE = 32;
export const BAR_WIDTH = 80;
export const BAR_HEIGHT = ICON_SIZE;


export const BAR_SIZE: JSX.Size = [BAR_WIDTH, BAR_HEIGHT];

export const COOLDOWN_WIDTH = BAR_WIDTH + ICON_SIZE;
export const COOLDOWN_FULL_SIZE: JSX.Size = [COOLDOWN_WIDTH, BAR_HEIGHT];
