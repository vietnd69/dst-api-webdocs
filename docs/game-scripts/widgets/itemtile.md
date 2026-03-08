---
id: itemtile
title: Itemtile
description: Renders an interactive inventory item tile in the UI, displaying item image, stack count, usage/perishability meters, and special visual effects based on item state and tags.
tags: [ui, inventory, item]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: cf5a59df
system_scope: ui
---

# Itemtile

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ItemTile` is a UI widget that visually represents an inventory item (`invitem`) in the game interface. It handles rendering the item image (including layered icons and overlays), quantity display, usage meters (perishable, finite uses, fuel, armor, rechargeable), wetness and acid sizzling effects, and dynamic tooltip updates based on player input and game state. It integrates closely with the `inventoryitem`, `stackable`, `perishable`, `finiteuses`, `fueled`, `armor`, and `rechargeable` components, and responds to events to keep its display synchronized with the item's state. It is primarily used in the HUD, crafting, and container UIs.

## Usage example
```lua
local invitem = some_entity
local tile = ItemTile(invitem)
widget:AddChild(tile)
tile:SetBaseScale(1)
tile:Refresh()
```

## Dependencies & tags
**Components used:**  
`armor`, `edible`, `finiteuses`, `fueled`, `perishable`, `rechargeable`, `uianim`, `stackable`, `inventoryitem`, `equippable`, `playeractionpicker`, `player_classified`  

**Tags:**  
Checks for: `rechargeable`, `rechargeable_bonus`, `fresh`, `stale`, `spoiled`, `edible_fresh`, `edible_stale`, `edible_spoiled`, `show_spoiled`, `show_spoiled_meter`, `hide_percentage`, `show_broken_ui`, `fueldepleted`, `NIGHTMARE_fueled`, `magiciantool`, `shadowlevel`, `luckyitem`, `unluckyitem`, `luckysource`, `unluckysource`.  
Adds `show_spoiled` dynamically for edible food items if not already present.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `item` | `Entity` | `nil` | The inventory item entity this tile represents. |
| `basescale` | number | `1` | Base scale factor for the tile; applied before animations. |
| `isactivetile` | boolean | `false` | If true, prevents wetness and sizzling effects from updating (used during active drag/move). |
| `ispreviewing` | boolean | `false` | If true, suppresses some server sync animations to avoid double-pop effects. |
| `ignore_stacksize_anim` | boolean | `nil` | When true, skips scale animation on stack size changes. |
| `movinganim` | `UIAnim` or `Image` | `nil` | Temporary image used during drag/move animations. |
| `onquantitychangedfn` | function | `nil` | Optional callback for overriding quantity display logic. |
| `updatingflags` | table | `{}` | Tracks active update loops (`charge`, `shadow`). |
| `rechargepct` | number | `1` | Current recharge percentage. |
| `rechargetime` | number | `math.huge` | Total time for full recharge in seconds. |

## Main functions
### `Refresh()`
* **Description:** Resets the tile state, updates quantity, and refreshes usage/perish meters based on the item’s components (armor, perishable, finiteuses, fueled, rechargeable). Called automatically after construction and when the container is refreshed.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetBaseScale(sc)`
* **Description:** Sets the base scale factor and applies it to the tile.
* **Parameters:** `sc` (number) — new base scale value.
* **Returns:** Nothing.

### `SetQuantity(quantity)`
* **Description:** Updates the numeric stack count display. Shows `"999+"` if quantity exceeds 999. Does not affect the item's actual stack size.
* **Parameters:** `quantity` (number) — the stack count to display.
* **Returns:** Nothing.

### `SetPercent(percent)`
* **Description:** Displays a usage meter (e.g., durability) as a percentage (e.g., `"75%"`). Respects the `hide_percentage` tag. Also handles `show_broken_ui` toggling the background/spoilage meter.
* **Parameters:** `percent` (number) — a value between `0` and `1`.
* **Returns:** Nothing.

### `SetPerishPercent(percent)`
* **Description:** Updates the spoilage meter visual based on food freshness state (`fresh`, `stale`, `spoiled`). Uses color overrides for transition zones (e.g., `~50%` green for `fresh`, `~20%` yellow for `stale`).
* **Parameters:** `percent` (number) — a value between `0` (fresh) and `1` (spoiled).
* **Returns:** Nothing.

### `SetChargePercent(percent)`
* **Description:** Updates the recharge meter visual and controls the recharge UI state: shows animation and progress, hides when fully charged (`>= 0.9999`), and starts/stops the charge update loop based on `rechargetime`.
* **Parameters:** `percent` (number) — a value between `0` and `1`.
* **Returns:** Nothing.

### `SetChargeTime(t)`
* **Description:** Sets the recharge duration (seconds). Triggers or stops the charge update loop depending on whether `t` is finite and current charge is incomplete.
* **Parameters:** `t` (number) — recharge time in seconds (`math.huge` if not recharging).
* **Returns:** Nothing.

### `StartUpdatingCharge()` / `StopUpdatingCharge()`
* **Description:** Start or stop a frame-by-frame charge progress update loop, which increments `rechargepct` over time. Used for real-time cooldown/charge bars.
* **Parameters:** None.
* **Returns:** Nothing.

### `StartDrag()`
* **Description:** Prepares the tile for dragging: hides spoilage, wetness, sizzling, shadow, and recharge meters, and disables item image clickability.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateTooltip()`
* **Description:** Builds and sets the item's tooltip string, including item name, adjectives, and context-sensitive action hints (e.g., inspect, trade, stack, swap, primary/secondary actions) based on current player state and held items.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetDescriptionString()`
* **Description:** Returns the tooltip text string without setting it. Handles gamepad/controller action hints and interaction logic.
* **Parameters:** None.
* **Returns:** `string` — fully formatted tooltip text.

### `HasSpoilage()`
* **Description:** Determines if the item supports spoilage meter display based on tags and `FOODTYPE`. Caches result in `self.hasspoilage`.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if the item has a visible spoilage meter.

### `ToggleShadowFX()`
* **Description:** Creates or removes the shadow magic particle effect (`inventory_fx_shadow`) based on item tags and player state. Supports NIGHTMARE_fueled timers.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetIsEquip(isequip)`
* **Description:** Dynamically toggles shadow FX when equipping/unequipping an item, depending on player shadow magic status and item tag.
* **Parameters:** `isequip` (boolean) — whether the item is being equipped.
* **Returns:** Nothing.

### `HandleAcidSizzlingFX(isacidsizzling)`
* **Description:** Creates or removes the acid sizzling FX (`inventory_fx_acidsizzle`) based on item state or explicit parameter.
* **Parameters:** `isacidsizzling` (boolean, optional) — if `nil`, checks `self.item:IsAcidSizzling()`.
* **Returns:** Nothing.

### `HandleBuffFX(invitem, fromchanged, data)`
* **Description:** Handles special buff effects for specific items (`panflute`, `desiccant`, lucky/unlucky items) by playing UI animations. Updates based on `item_buff_changed` event.
* **Parameters:**  
  `invitem` (`Entity`) — the item instance.  
  `fromchanged` (boolean) — whether triggered by a state change event.  
  `data` (table) — event data, including effect type and instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `imagechange` — updates item image and background (e.g., layered icons, colorization).  
  - `clientsideinventoryflagschanged` — updates image when client-side flags change.  
  - `inventoryitem_updatetooltip` — refreshes tooltip on focus.  
  - `serverpauseddirty` — defers tooltip refresh after unpausing.  
  - `refreshcrafting` — refreshes tooltip when crafting UI updates.  
  - `inventoryitem_updatespecifictooltip` — refreshes specific-item tooltip.  
  - `item_buff_changed` — triggers buff FX (`panflute`, `desiccant`, lucky items).  
  - `stacksizechange` — updates quantity and triggers scale animations (drag, preview, or sync).  
  - `percentusedchange` — updates usage/armor meter.  
  - `perishchange` — updates spoilage meter or percentage meter.  
  - `rechargechange` — updates recharge percentage meter.  
  - `rechargetimechange` — updates recharge duration.  
  - `wetnesschange` — shows/hides wetness meter (unless `isactivetile`).  
  - `acidsizzlingchange` — toggles acid sizzling FX.  
  - `stacksizepreview` — updates quantity and scale during client-side stack preview.  
  - `hide_spoilage` — removes spoilage meter assets on spoilage completion.  
  - `animover` (on charge/special FX) — cleans up and resets effects.  
- **Pushes:** None (does not emit its own events).