---
id: itemtile
title: Itemtile
description: A UI widget that displays inventory items with dynamic overlays for spoilage, wetness, charge, stack size, and various status effects.
tags: [widget, ui, inventory]
sidebar_position: 10

last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: widgets
source_hash: 49c5980d
system_scope: ui
---

# Itemtile

> Based on game build **722832** | Last updated: 2026-04-27

## Overview
`ItemTile` is a UI widget extending `Widget` that renders inventory items in containers, HUD slots, and crafting menus. It composes multiple child widgets (image, text labels, UIAnims) to display item state including stack quantity, durability percent, spoilage meter, wetness indicator, recharge status, and special effect overlays (shadow magic, acid sizzle, luck buffs). The widget listens to numerous inventory item events to stay synchronized with server state and handles client-side preview animations for stack manipulation.

## Usage example
```lua
local ItemTile = require("widgets/itemtile")

-- Inside a screen's _ctor:
self.itemtile = self:AddChild(ItemTile(invitem))
self.itemtile:SetPosition(100, 200, 0)
self.itemtile:SetBaseScale(0.8)

-- Respond to drag events:
self.itemtile:StartDrag()
-- After drop:
self.itemtile.dragging = nil
```

## Dependencies & tags
**External dependencies:**
- `constants` -- global game constants (FOODTYPE, HUD_ATLAS, etc.)
- `widgets/text` -- Text child widget for quantity/percent labels
- `widgets/image` -- Image child widget for item icons and backgrounds
- `widgets/widget` -- Widget base class
- `widgets/uianim` -- UIAnim child widget for animated meters and effects

**Components used:**
- `armor` -- reads `GetPercent()` for durability display (master only)
- `edible` -- checks for spoilage meter eligibility
- `finiteuses` -- reads `GetPercent()` for uses remaining
- `fueled` -- reads `GetPercent()` for fuel level
- `perishable` -- reads `GetPercent()` for freshness decay
- `playeractionpicker` -- queries available actions for tooltip hints
- `rechargeable` -- reads `GetPercent()` and `GetRechargeTime()` for charge display

**Tags:**
- `show_broken_ui` -- shows broken item background overlay
- `show_spoiled` -- forces spoilage meter display
- `fresh` / `stale` / `spoiled` -- determines spoilage meter color
- `rechargeable` -- enables recharge meter overlay
- `rechargeable_bonus` -- colors recharge meter green instead of blue
- `show_spoilage` -- enables spoilage visibility
- `edible_*` -- food type tags checked for spoilage eligibility
- `magiciantool` -- enables shadow magic effect overlay
- `shadowlevel` / `NIGHTMARE_fueled` -- shadow magic fuel tracking
- `fueldepleted` -- hides shadow FX when fuel exhausted
- `luckyitem` / `unluckyitem` / `luckysource` / `unluckysource` -- luck buff effects

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `item` | entity | --- | The inventory item entity this tile represents. |
| `ismastersim` | boolean | --- | Cached `TheWorld.ismastersim` for master/client branching. |
| `isactivetile` | boolean | `false` | Flag used to prevent animation conflicts during stack preview. |
| `ispreviewing` | boolean | `false` | Set during client-side stack size preview animations. |
| `movinganim` | UIAnim | `nil` | Temporary anim widget for item move-to animations. |
| `ignore_stacksize_anim` | boolean | `nil` | When set, skips stack change animation scaling. |
| `onquantitychangedfn` | function | `nil` | Optional callback for custom quantity display handling. |
| `updatingflags` | table | `{}` | Tracks active update loops (charge, shadow fuel). |
| `basescale` | number | `1` | Base scale factor for the tile, used in animations. |
| `bg` | Image | `nil` | Spoiled item background overlay (conditional). |
| `spoilage` | UIAnim | `nil` | Spoilage meter animation widget (conditional). |
| `wetness` | UIAnim | `nil` | Wetness indicator meter (always created, shown conditionally). |
| `rechargepct` | number | `1` | Cached recharge percentage for animation interpolation. |
| `rechargetime` | number | `math.huge` | Cached recharge time in seconds. |
| `rechargeframe` | UIAnim | `nil` | Recharge meter frame overlay (conditional). |
| `recharge` | UIAnim | `nil` | Recharge meter fill animation (conditional). |
| `imagebg` | Image | `nil` | Custom background image for item icon (conditional). |
| `image` | Image | --- | Main item icon image widget. |
| `quantity` | Text | `nil` | Stack size number label (created on first `SetQuantity`). |
| `percent` | Text | `nil` | Durability/fuel percent label (created on first `SetPercent`). |
| `shadowfx` | UIAnim | `nil` | Shadow magic effect overlay (conditional). |
| `acidsizzling` | UIAnim | `nil` | Acid sizzle effect overlay (conditional). |
| `freecastpanflute` | UIAnim | `nil` | Pan flute buff effect overlay (conditional). |
| `playwaterfx` | UIAnim | `nil` | Desiccant water absorption effect (conditional). |
| `playluckyfx` | UIAnim | `nil` | Luck/unluck effect overlay (conditional). |
| `dragging` | boolean | `nil` | Set to `true` during drag operations. |
| `hasspoilage` | boolean | `nil` | Cached result from `HasSpoilage()` check. |
| `showequipshadowfx` | boolean | `nil` | Tracks whether shadow equip FX should display. |
| `is_spoilage_shown` | boolean | `nil` | Tracks manual spoilage visibility state. |
| `updateshadowdelay` | number | `nil` | Accumulator for shadow fuel check throttling. |
| `readonlycontainer` | boolean | `nil` | If set, suppresses certain tooltip action hints. |

## Main functions
### `_ctor(invitem)`
* **Description:** Initialises the widget, calls `Widget._ctor(self, "ItemTile")`, creates all child widgets (image, meters, overlays) based on item tags and components, and registers event listeners for inventory state changes.
* **Parameters:** `invitem` -- entity instance with `replica.inventoryitem` component
* **Returns:** nil
* **Error states:** Prints warning and returns early if `invitem.replica.inventoryitem` is nil (no guard prevents nil dereference on subsequent access if construction continues).

### `Refresh()`
* **Description:** Resets preview flags, syncs stack quantity from replica, and on master sim reads component state (armor, perishable, finiteuses, fueled, rechargeable) to update percent displays. On client, deserialises usage data. Calls optional `item.itemtile_Refresh` hook if defined.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `SetBaseScale(sc)`
* **Description:** Sets the base scale factor and immediately applies it via `SetScale()`.
* **Parameters:** `sc` -- number scale multiplier
* **Returns:** nil
* **Error states:** None.

### `OnControl(control, down)`
* **Description:** Override of Widget:OnControl(). Calls `UpdateTooltip()` on any control input.
* **Parameters:**
  - `control` -- control enum value
  - `down` -- boolean press state
* **Returns:** `false` (event not consumed)
* **Error states:** None.

### `UpdateTooltip()`
* **Description:** Generates tooltip string via `GetDescriptionString()` and applies it via `SetTooltip()`. Sets tooltip colour based on item wetness.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if `self.item` is nil or invalid when called via `OnControl()` or `OnGainFocus()` (no item validity guard in `UpdateTooltip` itself).

### `GetDescriptionString()`
* **Description:** Builds tooltip text including item name, adjective, and context-sensitive action hints (inspect, stack, trade, use, swap) based on input state, active item, and container restrictions.
* **Parameters:** None
* **Returns:** string tooltip text
* **Error states:** Errors if `ThePlayer` is nil (accessed without guard). Errors if `player.components.playeractionpicker` is nil (no guard before `GetInventoryActions` call).

### `OnGainFocus()`
* **Description:** Override of Widget:OnGainFocus(). Calls `UpdateTooltip()` to refresh tooltip on focus.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `SetOnQuantityChangedFn(fn)`
* **Description:** Sets a callback function for custom quantity display handling. If callback returns `true`, default quantity label creation is skipped.
* **Parameters:** `fn` -- function(quantity) returning boolean
* **Returns:** nil
* **Error states:** None.

### `SetQuantity(quantity)`
* **Description:** Updates the stack size number label. Creates `self.quantity` Text widget on first call. Adjusts font size and position for quantities over 999 (displays "999+").
* **Parameters:** `quantity` -- integer stack size
* **Returns:** nil
* **Error states:** None

### `SetPerishPercent(percent)`
* **Description:** Updates spoilage meter animation percent. Overrides meter/frame symbols based on percent thresholds and item tags (fresh at ~50%, stale at ~20%). Clamps display to 0.99 max to avoid 100% frame.
* **Parameters:** `percent` -- number 0-1 freshness remaining
* **Returns:** nil
* **Error states:** None

### `SetPercent(percent)`
* **Description:** Displays durability/fuel percentage as a text label. Creates `self.percent` Text widget on first call. Hides spoilage/bg overlays if percent > 0 and item has `show_broken_ui` tag.
* **Parameters:** `percent` -- number 0-1 remaining
* **Returns:** nil
* **Error states:** None

### `SetChargePercent(percent)`
* **Description:** Updates recharge meter animation. Plays completion animation (`frame_pst`) when reaching 100%. Sets up one-shot `animover` listener to reset colours after animation. Manages `rechargeframe` visibility based on charge state.
* **Parameters:** `percent` -- number 0-1 charge remaining
* **Returns:** nil
* **Error states:** None

### `SetChargeTime(t)`
* **Description:** Sets cached recharge time and starts/stops charge update loop based on whether time is finite and charge is incomplete.
* **Parameters:** `t` -- number seconds to full charge
* **Returns:** nil
* **Error states:** None.

### `StartDrag()`
* **Description:** Sets `dragging = true` and hides all overlay widgets (spoilage, wetness, acid, bg, recharge) during drag. Disables image clickability.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `ShowSpoilage()`
* **Description:** Shows spoilage meter and background if not dragging. Sets `is_spoilage_shown` flag.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `HideSpoilage()`
* **Description:** Hides spoilage meter and background. Clears `is_spoilage_shown` flag.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `HasSpoilage()`
* **Description:** Returns cached `hasspoilage` value or computes it by checking item tags (`show_spoilage`, `fresh`, `stale`, `spoiled`) and edible food type tags against `FOODTYPE` table.
* **Parameters:** None
* **Returns:** boolean
* **Error states:** None

### `StartUpdatingCharge()`
* **Description:** Adds "charge" flag to `updatingflags` and starts `OnUpdate` loop if first flag.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `StopUpdatingCharge()`
* **Description:** Removes "charge" flag from `updatingflags` and stops `OnUpdate` loop if no flags remain.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `StartUpdatingShadowFuel()`
* **Description:** Adds "shadow" flag to `updatingflags`, resets `updateshadowdelay`, and starts `OnUpdate` loop.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `StopUpdatingShadowFuel()`
* **Description:** Removes "shadow" flag from `updatingflags`, clears `updateshadowdelay`, and stops `OnUpdate` loop if no flags remain.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `OnUpdate(dt)`
* **Description:** **Update loop.** Interpolates charge percent over time if "charge" flag set. Throttles shadow fuel checks to every 0.2s if "shadow" flag set. Returns early if server paused.
* **Parameters:** `dt` -- number delta time in seconds
* **Returns:** nil
* **Error states:** None

### `CheckShadowFXFuel()`
* **Description:** Shows or hides shadow FX based on `fueldepleted` tag presence.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `ToggleShadowFX()`
* **Description:** Creates or kills shadow FX overlay based on `showequipshadowfx` flag or `magiciantool` tag. Starts/stops shadow fuel update loop for `NIGHTMARE_fueled` items.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `SetIsEquip(isequip)`
* **Description:** Updates `showequipshadowfx` based on player `shadowmagic` tag and item `shadowlevel` tag. Calls `ToggleShadowFX()` if state changed.
* **Parameters:** `isequip` -- boolean equip state
* **Returns:** nil
* **Error states:** Errors if `ThePlayer:HasTag` called when `ThePlayer` is nil (no guard).

### `HandleAcidSizzlingFX(isacidsizzling)`
* **Description:** Creates or kills acid sizzle effect overlay. If `isacidsizzling` is nil, queries `item:IsAcidSizzling()`.
* **Parameters:** `isacidsizzling` -- boolean or nil to auto-detect
* **Returns:** nil
* **Error states:** None

### `HandleBuffFX(invitem, fromchanged, data)`
* **Description:** Creates/kills buff effect overlays for pan flute (free cast), desiccant (water absorption), and luck/unluck items. Reads `ThePlayer.player_classified` netvars for pan flute state. Uses `data.effect` to determine which luck FX to play. Note: Race condition exists for panflute free cast effect - animover callback may fire after widget killed if `RandomizeLoop()` path is used without proper cleanup.
* **Parameters:**
  - `invitem` -- entity instance
  - `fromchanged` -- boolean indicating event-triggered update
  - `data` -- table with `effect` and `inst` fields for luck/desiccant events
* **Returns:** nil
* **Error states:** None

### `sSetImageFromItem(im, item)` (static)
* **Description:** Static helper function shared via `ItemTile.sSetImageFromItem` for external use. Sets image texture on Image widget from item's inventory image, supporting layered images.
* **Parameters:**
  - `im` -- Image widget instance
  - `item` -- entity instance with inventory image data
* **Returns:** Image widget instance
* **Error states:** None

## Events & listeners
**Listens to:**
- `show_spoilage` (on invitem) -- calls `ShowSpoilage()`
- `hide_spoilage` (on invitem) -- calls `HideSpoilage()`
- `imagechange` (on invitem) -- refreshes item icon and background
- `clientsideinventoryflagschanged` (on ThePlayer) -- refreshes icon for client-side overrides
- `inventoryitem_updatetooltip` (on invitem) -- updates tooltip if focused
- `serverpauseddirty` (on TheWorld) -- schedules tooltip update
- `refreshcrafting` (on ThePlayer) -- updates tooltip if focused
- `inventoryitem_updatespecifictooltip` (on ThePlayer) -- updates tooltip if prefab matches
- `item_buff_changed` (on ThePlayer) -- calls `HandleBuffFX()`
- `stacksizechange` (on invitem) -- updates quantity, plays move-to animation if `src_pos` provided
- `percentusedchange` (on invitem) -- calls `SetPercent()`
- `perishchange` (on invitem) -- calls `SetPerishPercent()` or `SetPercent()` based on tags
- `rechargechange` (on invitem) -- calls `SetChargePercent()`
- `rechargetimechange` (on invitem) -- calls `SetChargeTime()`
- `wetnesschange` (on invitem) -- shows/hides wetness meter
- `acidsizzlingchange` (on invitem) -- calls `HandleAcidSizzlingFX()`
- `stacksizepreview` (on invitem, client only) -- handles client-side stack preview animations

**Pushes:** None identified.