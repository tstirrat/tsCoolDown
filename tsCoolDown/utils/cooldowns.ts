/** @noSelfInFile */

import "@wartoshika/wow-declarations";
import { throttle } from './time';
import { stringify } from './debug';

export enum Type {
  SPELL = 'SPELL',
  INVENTORY = 'INV',
  CHARACTER = 'CHAR'
}

export interface Timer {
  type: Type;
  start: number;
  duration: number;
  textures: WoWAPI.TexturePath[];
  end: number;
}

const timers: Timer[] = [];

function insert(
  type: Type,
  start: number,
  duration: number,
  texture: WoWAPI.TexturePath
) {
  // console.log('insert', type, start, texture);
  const end = start + duration;
  const timerIndex = timers.findIndex(
    timer =>
      timer.type === type &&
      timer.start === start &&
      timer.duration === duration
  );

  // add new timer
  if (timerIndex === -1) {
    const newTimer: Timer = {
      type,
      start,
      duration,
      textures: [texture],
      end,
    };
    const nextExpiringIndex = timers.findIndex(timer => timer.end > end);
    // console.log('insert index', i + 1);
    if (nextExpiringIndex === -1) {
      timers.push(newTimer);
    } else {
      timers.splice(nextExpiringIndex, 0, newTimer);
    }
    // console.log('new timer', stringify(newTimer));
    return true;
  }

  // add texture, if not there
  if (timers[timerIndex].textures.findIndex(t => t === texture) === -1) {
    timers[timerIndex].textures.push(texture);
    // console.log('add texture to existing timer', texture);
    return true;
  }

  // existing timer and texture
  return false;
}

function removeExpired() {
  const now = GetTime();
  let didRemove = false;

  if (timers.length && timers[0]) {
    // console.log(now);
    // console.log('[ ' + timers.map(t => t.end).join(', ') + ' ]');
    while (timers[0] && timers[0].end <= now) {
      timers.shift();
      didRemove = true;
    }
  }
  return didRemove;
}

const bookTypes = [
  BOOKTYPE_SPELL
  // BOOKTYPE_PET
];

function scanSpellbook() {
  bookTypes.forEach(book => {
    let spellID = 1;
    let spell = GetSpellBookItemName(spellID, book);

    while (spell) {
      const [start, duration, hasCooldown] = GetSpellCooldown(spellID, book);
      if (hasCooldown === 1 && start > 0 && duration > 2) {
        insert(Type.SPELL, start, duration, GetSpellTexture(spellID, book));
      }

      spellID++;
      spell = GetSpellBookItemName(spellID, book);
    }
  });
}

function scanTrinkets() {
  for (let i = 0; i <= 1; i++) {
    const slotID = GetInventorySlotInfo(`Trinket${i}Slot`);
    const [start, duration, hasCooldown] = GetInventoryItemCooldown(
      'player',
      slotID
    );
    if (hasCooldown === 1 && start > 0 && duration > 2) {
      insert(
        Type.CHARACTER,
        start,
        duration,
        GetInventoryItemTexture('player', slotID)
      );
    }
  }
}

const textureOverride: Record<number, WoWAPI.TexturePath> = {
  // Healing Potions
  [118]: 'Interface\\Icons\\INV_Potion_54',
  [858]: 'Interface\\Icons\\INV_Potion_54',
  [929]: 'Interface\\Icons\\INV_Potion_54',
  [1710]: 'Interface\\Icons\\INV_Potion_54',
  [3928]: 'Interface\\Icons\\INV_Potion_54',
  [4596]: 'Interface\\Icons\\INV_Potion_54',
  [13446]: 'Interface\\Icons\\INV_Potion_54',
  [17348]: 'Interface\\Icons\\INV_Potion_54',
  [17349]: 'Interface\\Icons\\INV_Potion_54',
  [18839]: 'Interface\\Icons\\INV_Potion_54',
  [22829]: 'Interface\\Icons\\INV_Potion_54',

  // Mana Potions
  [2455]: 'Interface\\Icons\\INV_Potion_76',
  [3385]: 'Interface\\Icons\\INV_Potion_76',
  [3827]: 'Interface\\Icons\\INV_Potion_76',
  [6149]: 'Interface\\Icons\\INV_Potion_76',
  [13443]: 'Interface\\Icons\\INV_Potion_76',
  [13444]: 'Interface\\Icons\\INV_Potion_76',
  [17351]: 'Interface\\Icons\\INV_Potion_76',
  [17352]: 'Interface\\Icons\\INV_Potion_76',
  [18841]: 'Interface\\Icons\\INV_Potion_76',
  [22832]: 'Interface\\Icons\\INV_Potion_76',

  // Mana Stones
  [5513]: 'Interface\\Icons\\INV_Misc_Gem_Ruby_01',
  [5514]: 'Interface\\Icons\\INV_Misc_Gem_Ruby_01',
  [8007]: 'Interface\\Icons\\INV_Misc_Gem_Ruby_01',
  [8008]: 'Interface\\Icons\\INV_Misc_Gem_Ruby_01'
};

function scanIntentory() {
  for (let bagIndex = 0; bagIndex <= 4; bagIndex++) {
    for (
      let i = 1;
      i <= GetContainerNumSlots(bagIndex as WoWAPI.CONTAINER_ID);
      i++
    ) {
      const itemLink = GetContainerItemLink(bagIndex, i);
      if (itemLink) {
        const [start, duration] = GetContainerItemCooldown(
          bagIndex as WoWAPI.CONTAINER_ID,
          i
        );
        if (start > 0) {
          const [itemID, , , , , type] = GetItemInfo(itemLink);
          if (type === 'Consumable' && duration > 2) {
            const [texture] = GetContainerItemInfo(
              bagIndex as WoWAPI.CONTAINER_ID,
              i
            );
            insert(
              Type.INVENTORY,
              start,
              duration,
              textureOverride[itemID] || texture
            );
          }
        }
      }
    }
  }
}

let toDo: Function[] = [];

const eventMap: Record<string, Function[]> = {
  PLAYER_ENTERING_WORLD: [scanSpellbook, scanTrinkets, scanIntentory],
  UPDATE_SHAPESHIFT_FORMS: [scanSpellbook],
  SPELLS_CHANGED: [scanSpellbook],
  // 'ACTIONBAR_UPDATE_COOLDOWN': [Spells, Inventory, Containers],
  SPELL_UPDATE_COOLDOWN: [scanSpellbook, scanTrinkets],
  BAG_UPDATE_COOLDOWN: [scanIntentory],
  CURRENT_SPELL_CAST_CHANGED: [scanSpellbook],
  UNIT_INVENTORY_CHANGED: [scanTrinkets]
};

function determineScanLocations(_: WoWAPI.Frame, event: WoWAPI.Event) {
  toDo = eventMap[event] || [];
}

const doScans = throttle(function doScans_inner() {
  let didScan = false;
  toDo.forEach(scan => {
    didScan = true;
    scan();
  });
  toDo = [];
  const didRemove = removeExpired();
  return didScan || didRemove;
}, 0.2);


function attachScanEvents(
  frame: WoWAPI.Frame,
  callback: (this: void, timers: Timer[]) => void
) {
  frame.SetScript('OnUpdate', function onUpdate_main(frame, elapsed) {
    const didUpdate = doScans(frame, elapsed);
    if (didUpdate) {
      assert(timers, 'timers should exist');
      assert(typeof timers.length === 'number', 'timers should be an array');

      // timers.map((t, i) => console.log(i, stringify(t)));
      // console.log('didUpdate', timers, timers.length);
      callback(timers);
    }
  });

  Object.keys(eventMap).forEach(event => {
    frame.RegisterEvent(event as WoWAPI.Event);
  });
  frame.SetScript('OnEvent', determineScanLocations);
}

let eventFrame: WoWAPI.Frame;

export function subscribe(callback: (this: void, timers: Timer[]) => void) {
  if (!eventFrame) {
    eventFrame = CreateFrame('Frame', 'tsCoolDown_eventFrame', UIParent);
  }

  assert(eventFrame, 'register requires a frame');
  assert(callback, 'register requires a callback');

  eventFrame.RegisterEvent('ADDON_LOADED');
  eventFrame.SetScript('OnEvent', function() {
    eventFrame.UnregisterAllEvents();
    attachScanEvents(eventFrame, callback);
  });
}

type HasCooldown = 0 | 1;
declare const BOOKTYPE_SPELL = 'spell';
declare const BOOKTYPE_PET = 'pet';

declare function GetSpellBookItemName(spellID: number, type: string): string;
declare function GetSpellTexture(spellID: number, type: string): string;
/** @tupleReturn */
declare function GetSpellCooldown(
  spellID: number,
  type: string
): [number, number, HasCooldown];
declare function GetContainerNumSlots(bagIndex: number): number;
declare function GetContainerItemLink(
  bagIndex: number,
  invIndex: number
): string;
/** @tupleReturn */
declare function GetContainerItemCooldown(
  bagIndex: number,
  invIndex: number
): [number, number, HasCooldown];

/** @tupleReturn */
declare function GetItemInfo(
  itemID: string
): [number, unknown, unknown, unknown, string, string];

declare function GetContainerItemInfo(
  bagIndex: number,
  invIndex: number
): string;

declare function GetInventoryItemTexture(unit: string, slotID: number): string;
declare function GetInventorySlotInfo(slotName: string): number;

/** @tupleReturn */
declare function GetInventoryItemCooldown(
  unit: string,
  slotID: number
): [number, number, HasCooldown];

declare namespace C_Timer {
  function After(time: number, callback: () => void): void;
}
