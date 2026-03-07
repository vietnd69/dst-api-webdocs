---
id: magician_chest
title: Magician Chest
description: Serves as a shadow dimension storage container for the Magician character, enabling item storage with burnable and hauntable properties.
tags: [storage, structure, shadow]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4836adb0
system_scope: inventory
---

# Magician Chest

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `magician_chest` prefab implements a deployable storage structure that links to the shadow dimension container, allowing the Magician to store and retrieve items remotely. It integrates with multiple components including `container_proxy`, `lootdropper`, `workable`, `burnable`, and `hauntable` to provide full gameplay functionality such as opening/closing animations, hammering behavior, burn damage resistance, and haunt mechanics.

## Usage example
```lua
-- Typical usage within the game's entity system
local inst = Prefab("magician_chest", fn, assets, prefabs)
-- The prefab is instantiated by the engine during world loading
-- Components like container_proxy are auto-configured to link to TheWorld:GetPocketDimensionContainer("shadow")
-- Hammering triggers OnHammered, which extinguishes fire and drops loot
```

## Dependencies & tags
**Components used:** `container_proxy`, `lootdropper`, `workable`, `burnable`, `hauntable`, `inspectable`, `propagator`, `fueled`, `smolder`, `moisture`, `snowcover`
**Tags:** Adds `structure`; does *not* add `chest` (commented out in source).

## Properties
No public properties.

## Main functions
### `OnOpen(inst)`
*   **Description:** Plays open animation and relevant sounds when the chest is opened; skipped if the chest is burnt.
*   **Parameters:** `inst` (Entity) - the chest entity.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `inst:HasTag("burnt")`.

### `OnClose(inst)`
*   **Description:** Plays close animation and terminates looped sounds when the chest is closed; always terminates looped sounds regardless of burn state.
*   **Parameters:** `inst` (Entity) - the chest entity.
*   **Returns:** Nothing.

### `OnHammered(inst, worker)`
*   **Description:** Called when hammering completes; extinguishes fire (if burning), drops loot, spawns collapse FX, and removes the entity.
*   **Parameters:** 
    * `inst` (Entity) - the chest entity.
    * `worker` (Entity) - the entity performing hammering (not used beyond null check).
*   **Returns:** Nothing.

### `OnHit(inst, worker)`
*   **Description:** Plays hit animation and closes the chest on partial hammering; skipped if already burnt.
*   **Parameters:** 
    * `inst` (Entity) - the chest entity.
    * `worker` (Entity) - the entity performing hammering.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `inst:HasTag("burnt")`.

### `OnBuilt(inst)`
*   **Description:** Plays placement animation and sound after the chest is built.
*   **Parameters:** `inst` (Entity) - the chest entity.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Saves burn state (burnt or burning) to the save data table.
*   **Parameters:** 
    * `inst` (Entity) - the chest entity.
    * `data` (table) - the save data table to populate.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores burnt state on load by invoking the `onburnt` callback.
*   **Parameters:** 
    * `inst` (Entity) - the chest entity.
    * `data` (table?) - saved data (may be `nil`).
*   **Returns:** Nothing.
*   **Error states:** Only triggers `onburnt` if `data ~= nil` and `data.burnt == true`.

### `AttachShadowContainer(inst)`
*   **Description:** Links the chest’s `container_proxy` to the shadow dimension container via `TheWorld:GetPocketDimensionContainer("shadow")`.
*   **Parameters:** `inst` (Entity) - the chest entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` - calls `OnBuilt`.
- **Pushes:** No events directly; relies on component events (`container` events triggered by `container_proxy`, `workable` callbacks, etc.).