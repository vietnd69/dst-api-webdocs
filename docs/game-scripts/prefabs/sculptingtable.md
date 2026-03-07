---
id: sculptingtable
title: Sculptingtable
description: A crafting and sculpting station that accepts raw sculpting materials or sketches, allows item prototyping, and supports tool-based interaction such as hammering.
tags: [crafting, inventory, world, environment, loot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 070ffaf7
system_scope: crafting
---

# Sculptingtable

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `sculptingtable` prefab functions as a multi-purpose crafting and sculpting station in DST. It supports two primary inputs: sculptable materials (e.g., marble, cutstone, moonglass) and sketches. When a sculptable material is placed, it becomes pickable and can be sculpted into a finished item using the `CreateItem` function. Sketches are permanently learned via the `craftingstation` component. The table integrates with `prototyper`, `trader`, `lootdropper`, `workable`, `burnable`, and `pickable` components to enable crafting, tool use (e.g., hammering), hauntable interactions, and dynamic state changes (e.g., burning, idle vs. proximity states). It also handles event-specific logic (e.g., Chess Moon knockoffs) and serialization via `OnSave`/`OnLoad`.

## Usage example
```lua
local table = SpawnPrefab("sculptingtable")
table.Transform:SetPosition(x, y, z)

-- Place a sculptable material
table.components.pickable.caninteractwith = true
table.components.pickable.product = "marble"
table.components.prototyper.trees.SCULPTING = TECH.SCULPTING_ONE.SCULPTING

-- Accept and learn a sketch
local sketch = SpawnPrefab("my_sketch")
sketch:GetComponent("sketch"):SetPrefabAndRecipe("my_sculpture", "my_recipe")
table.components.trader:OnAccept(table, sketch) -- internally calls ongivenitem

-- Sculpt an item (e.g., "statue")
table:CreateItem("statue")
```

## Dependencies & tags
**Components used:** `burnable`, `craftingstation`, `hauntable`, `inspectable`, `inventory`, `lootdropper`, `pickable`, `prototyper`, `trader`, `workable`  
**Tags:** Adds `structure`, `trader`, `alltrader`, `prototyper`, and conditionally `chess_moonevent`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_speechstatus` | string | `"EMPTY"` | Current state string used for scrapbook display; not serialized. |
| `CreateItem(item)` | function | `nil` | Public helper method to spawn a new sculpted item using the currently held material. |
| `OnSave(inst, data)` | function | `nil` | Custom save handler storing burn status and held item. |
| `OnLoad(inst, data)` | function | `nil` | Custom load handler restoring state and triggering onburnt if applicable. |
| `OnEntityWake` / `OnEntitySleep` | function | `CheckChessMoonEventKnockOff` | Hook for Chess Moon events (non-Cave worlds only). |
| `MiniMapEntity` | table | — | Icon is set to `"sculpting_station.png"` and priority `5`. |

## Main functions
### `AddSketch(inst, sketch)`
*   **Description:** Adds a learned sketch to the table’s crafting station and updates animation/sound based on prototyper state.
*   **Parameters:** `sketch` (Prefab instance with sketch component) — the sketch being placed.
*   **Returns:** Nothing.
*   **Error states:** N/A.

### ` CalcSymbolFile(itemname)`
*   **Description:** Returns the animation swap file name for the given sculptable material (e.g., `"marble"`) or `"swap_"..itemname` for unknown types.
*   **Parameters:** `itemname` (string) — name of the material.
*   **Returns:** string — swap file identifier.

### `CalcItemSymbol(itemname)`
*   **Description:** Returns the symbol ID for the material’s icon (e.g., `"marble01"`), or `"swap_body"` for unknown types.
*   **Parameters:** `itemname` (string).
*   **Returns:** string.

### `CalcSculptingSymbol(itemname)`
*   **Description:** Always returns `"cutstone01"` for known materials; otherwise `"swap_body"`.
*   **Parameters:** `itemname` (string).
*   **Returns:** string.

### `CalcSculptingTech(itemname)`
*   **Description:** Returns `TECH.SCULPTING_ONE.SCULPTING` or `TECH.SCULPTING_TWO.SCULPTING` depending on whether the material is in `sculptable_materials`.
*   **Parameters:** `itemname` (string).
*   **Returns:** string — tech key.

### `dropitems(inst)`
*   **Description:** Spawns loot for the held pickable product and all learned crafting items if interaction is allowed.
*   **Parameters:** `inst` — the sculpting table instance.
*   **Returns:** Nothing.
*   **Error states:** Drops nothing if `caninteractwith` is `false`.

### `onhammered(inst, worker)`
*   **Description:** Handles hammer interaction: drops loot, spawns collapse FX, and destroys the table.
*   **Parameters:** `inst`, `worker` — the player/tool user.
*   **Returns:** Nothing.

### `onhit(inst)`
*   **Description:** Plays the `"hit"` animation and re-animates based on prototyper state (proximity_loop if on, idle otherwise).
*   **Parameters:** `inst`.
*   **Returns:** Nothing.
*   **Error states:** Skips if `burnt` tag is present.

### `onbuilt(inst)`
*   **Description:** Plays `"place"` animation and emits craft sound upon placement.
*   **Parameters:** `inst`.
*   **Returns:** Nothing.

### `onitemtaken(inst, picker, loot)`
*   **Description:** Finalizes the pickup of a sculpted item: resets interaction flag, equip loot if applicable, clears override symbols, and updates prototyper tech.
*   **Parameters:** `inst`, `picker`, `loot`.
*   **Returns:** Nothing.
*   **Error states:** Removes `chess_moonevent` tag unconditionally.

### `giveitem(inst, itemname)`
*   **Description:** Sets up the pickable item (material) with long regen time, pauses picking, sets override symbols, and configures prototyper tech.
*   **Parameters:** `itemname` (string) — material name or sculpted item name.
*   **Returns:** Nothing.
*   **Error states:** May add `chess_moonevent` tag for certain chess pieces.

### `ongivenitem(inst, giver, item)`
*   **Description:** Routing dispatcher for `trader.onaccept`: routes sketches to `AddSketch`, others to `giveitem`.
*   **Parameters:** `inst`, `giver`, `item`.
*   **Returns:** Nothing.

### `abletoaccepttest(inst, item)`
*   **Description:** Validates whether an item can be accepted as input (sketch or material).
*   **Parameters:** `inst`, `item`.
*   **Returns:** `true` or `false`, plus reason string (`"DUPLICATE"`, `"SLOTFULL"`, `"NOTSCULPTABLE"`).
*   **Error states:** Blocks duplicate sketches or full slots.

### `onignite(inst)`
*   **Description:** Disables the trader component and calls `DefaultBurnFn`.
*   **Parameters:** `inst`.
*   **Returns:** Nothing.

### `onextinguish(inst)`
*   **Description:** Re-enables the trader component and calls `DefaultExtinguishFn`.
*   **Parameters:** `inst`.
*   **Returns:** Nothing.

### `onburnt(inst)`
*   **Description:** Handles post-burn cleanup: drops remaining product/items, forgets learned items, removes trader component, and calls `DefaultBurntStructureFn`.
*   **Parameters:** `inst`.
*   **Returns:** Nothing.

### `onremoveingredients(inst, doer, recipename)`
*   **Description:** Calls `onitemtaken` after ingredients are removed (e.g., crafting).
*   **Parameters:** `inst`, `doer`, `recipename`.
*   **Returns:** Nothing.

### `onturnon(inst)`
*   **Description:** Starts proximity loop animation and sound if not burnt.
*   **Parameters:** `inst`.
*   **Returns:** Nothing.

### `onturnoff(inst)`
*   **Description:** Ends proximity animation and kills loop sound if not burnt.
*   **Parameters:** `inst`.
*   **Returns:** Nothing.

### `CreateItem(inst, item)`
*   **Description:** Spawns a new sculpted item using the held material as base ingredient (if present and valid), then calls `giveitem` to replace it with the sculpted material variant.
*   **Parameters:** `inst`, `item` (string) — the base name of the new sculpted item (e.g., `"statue"`).
*   **Returns:** Nothing.
*   **Error states:** Does nothing if no material is currently held (`caninteractwith` is `false`).

### `getstatus(inst)`
*   **Description:** Returns state string for UI (`"BURNT"`, `"EMPTY"`, `"BLOCK"`, `"SCULPTURE"`).
*   **Parameters:** `inst`.
*   **Returns:** string.

### `onsave(inst, data)`
*   **Description:** Records burn status and held item into the save `data` table.
*   **Parameters:** `inst`, `data` (table).
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Restores item and burn state during load; triggers `onburnt` if burnt.
*   **Parameters:** `inst`, `data`.
*   **Returns:** Nothing.

### `DoChessMoonEventKnockOff(inst)`
*   **Description:** For Chess Moon events, knocks off and drops the held item if present.
*   **Parameters:** `inst`.
*   **Returns:** Nothing.

### `CheckChessMoonEventKnockOff(inst)`
*   **Description:** Wrapper for event listener that checks for full/new moon and calls `DoChessMoonEventKnockOff`.
*   **Parameters:** `inst`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` — calls `onbuilt`; `ondeconstructstructure` — calls `dropitems`; `shadowchessroar` (non-Cave) — calls `DoChessMoonEventKnockOff`.
- **WatchWorldState:** `"isfullmoon"`, `"isnewmoon"` (non-Cave) — triggers `CheckChessMoonEventKnockOff`.
- **Pushes:** None directly. (Event observers like `on_loot_dropped` are invoked indirectly via `lootdropper`.)
- **Component hooks:** `burnable.onignite`, `burnable.onextinguish`, `burnable.onburnt`, `workable.onwork`, `workable.onfinish`, `pickable.onpickedfn`, `prototyper.onturnon`, `prototyper.onturnoff`, `trader.onaccept`, `trader.abletoaccepttest`, `inspectable.getstatus`.