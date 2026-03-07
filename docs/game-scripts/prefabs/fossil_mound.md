---
id: fossil_mound
title: Fossil Mound
description: Serves as an interactive structure that spawns a Stalker when fully repaired and traded with a Shadow Heart under specific conditions.
tags: [structure, trader, loot, repair, stalker]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c9a411e5
system_scope: entity
---

# Fossil Mound

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `fossil_mound` prefab represents a recoverable structure built from fossil fragments. It functions as a multi-stage repairable and tradable entity: players must first hammer it to reduce its size (revealing the fossil), then repair it using Fossil material, and finally trade it with a Shadow Heart during nighttime—subject to location-based constraints—to respawn a Stalker variant (forest, cave, or atrium). It leverages several core components: `workable`, `repairable`, `lootdropper`, `trader`, and `inspectable`, and integrates with `areaaware` and `entitytracker` for context-aware trading logic.

## Usage example
```lua
local inst = SpawnPrefab("fossil_stalker")
-- Defaults to moundsize=1, form=1 (correct). To set up for Stalker revival:
inst.moundsize = 8
inst.form = 2  -- Example of a "wrong" form for humorous Stalker
inst.components.trader:Enable()  -- Required for trading
```

## Dependencies & tags
**Components used:**  
`inspectable`, `lootdropper`, `workable`, `repairable`, `trader`, `areaaware`, `entitytracker`, `sanity`  
**Tags:** Adds `structure` to the instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `moundsize` | number | `1` | Current size of the mound (1 to `MAX_MOUND_SIZE` = 8). Controls repair progress and loot count. |
| `form` | number | `1` | Stalker form variant: `1` (correct/normal), `2` (funny), `3` (funny). Set when mound reaches `MOUND_WRONG_START_SIZE` (5). |

## Main functions
### `UpdateFossileMound(inst, size, checkforwrong)`
*   **Description:** Updates the visual state, workable progress, and trading state based on `moundsize` and `form`. Also adjusts animation and enables/disables trading when full size is reached.
*   **Parameters:**  
    `inst` (Entity) – the fossil mound instance.  
    `size` (number) – the new mound size (clamped to `[1, MAX_MOUND_SIZE]`).  
    `checkforwrong` (boolean) – if `true`, may randomize `form` when size crosses `MOUND_WRONG_START_SIZE` (5).
*   **Returns:** Nothing.

### `ItemTradeTest(inst, item, giver)`
*   **Description:** Validates whether the current trade conditions for reviving a Stalker are met. Enforces checks for Shadow Heart item, nighttime, location (Atrium-specific constraints), and correct Stalker form.
*   **Parameters:**  
    `inst` (Entity) – the fossil mound instance.  
    `item` (Entity or nil) – the offered item (must be `"shadowheart"`).  
    `giver` (Entity or nil) – the trader entity (must have `areaaware` component).  
*   **Returns:**  
    `true` if trade is allowed, else `false, "REASON"` (e.g., `"WRONGSHADOWFORM"`, `"CANTSHADOWREVIVE"`).

### `OnAccept(inst, giver, item)`
*   **Description:** Executes the Stalker revival logic: spawns the appropriate Stalker type, positions it over the mound, triggers resurrection state, and penalizes sanity.
*   **Parameters:**  
    `inst` (Entity) – the fossil mound instance (removed during execution).  
    `giver` (Entity) – the player performing the trade.  
    `item` (Entity) – the Shadow Heart (consumed).  
*   **Returns:** Nothing.

### `onworked(inst)`
*   **Description:** Handles hammering: spawns collapse FX, drops loot based on current `moundsize`, and destroys the mound.
*   **Parameters:**  
    `inst` (Entity) – the fossil mound instance.  
*   **Returns:** Nothing.

### `onrepaired(inst)`
*   **Description:** Increments mound size and updates visual state after repair. Plays repair sound.
*   **Parameters:**  
    `inst` (Entity) – the fossil mound instance.  
*   **Returns:** Nothing.

### `getstatus(inst)`
*   **Description:** Returns display status for scrapbook/inspect UI: `"COMPLETE"` if full size and correct form, `"FUNNY"` if full size but wrong form, `nil` otherwise.
*   **Parameters:**  
    `inst` (Entity) – the fossil mound instance.  
*   **Returns:** `string?` – `"COMPLETE"`, `"FUNNY"`, or `nil`.

### `onsave(inst, data)`
*   **Description:** Serializes `moundsize` and `form` if >1, for save compatibility.
*   **Parameters:**  
    `inst` (Entity) – the fossil mound instance.  
    `data` (table) – the save data table.  
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Deserializes saved state, including backward compatibility for `data.wrong`.
*   **Parameters:**  
    `inst` (Entity) – the fossil mound instance.  
    `data` (table?) – saved data (may be `nil`).  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
    `inst.OnSave` → calls `onsave(inst, data)`  
    `inst.OnLoad` → calls `onload(inst, data)`  
- **Pushes:**  
    Via `inst.components.lootdropper:DropLoot(...)`: `entity_droploot`  
    Via `inst.components.sanity:DoDelta(...)`: `sanitydelta`, `goinsane`/`gosane`, etc.  
    Via `inst:Remove()`: `onremove`  
    *(No direct `ListenForEvent` calls are present.)*