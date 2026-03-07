---
id: seafaring_prototyper
title: Seafaring Prototyper
description: A deployable structure that provides prototyping capabilities for the Seafaring content, with workable and burnable behavior.
tags: [crafting, structure, workable, burnable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 54c50722
system_scope: crafting
---

# Seafaring Prototyper

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `seafaring_prototyper` prefab implements a deployable crafting station for the Seafaring content. It combines the `prototyper` component (to enable blueprint-based crafting), `workable` component (for hammering interactions), `burnable` and `propagator` components (for fire behavior), and `hauntable` component (for Haunt mechanics). When built, it plays a placement animation and sound; when activated, it toggles its operational state and emits looping sound and animation. The entity can be hammered to dismantle and drop loot, and it extinguishes if lit when hammered.

## Usage example
```lua
-- Typical use via prefab system (no manual component handling required)
local seafaring_station = SpawnPrefab("seafaring_prototyper")
seafaring_station.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `burnable`, `hauntable`, `lootdropper`, `prototyper`, `workable`, `inspectable`, `soundemitter`, `animstate`, `minimapentity`, `transform`
**Tags:** Adds `structure`, `prototyper`; checks `burnt`, `burning` (via `burnable`)

## Properties
No public properties exposed directly. Component properties are managed by internal callbacks and component logic:
- `inst.components.prototyper.on` (boolean) — managed internally via `onturnon`/`onturnoff`/`onactivate`.
- `inst.components.burnable.burning` — handled by `burnable` and `MakeLargeBurnable`.

## Main functions
### `onhammered(inst, worker)`
*   **Description:** Callback invoked when the prototyper is hammered to destruction. Extinguishes fire if burning, drops loot, spawns a small collapse FX, and removes the entity.
*   **Parameters:** `inst` (entity) — the prototyper instance; `worker` (entity, optional) — the entity performing the hammering.
*   **Returns:** Nothing.

### `onhit(inst)`
*   **Description:** Callback invoked during hammering progress. Plays the "hit" animation and toggles ambient loop animation/sound based on whether the prototyper is active.
*   **Parameters:** `inst` (entity) — the prototyper instance.
*   **Returns:** Nothing.
*   **Error states:** No effect if the entity has the `burnt` tag.

### `onturnoff(inst)`
*   **Description:** Callback invoked when the prototyper is turned off. Stops the looping animation and sound if not burnt.
*   **Parameters:** `inst` (entity) — the prototyper instance.
*   **Returns:** Nothing.
*   **Error states:** No effect if the entity has the `burnt` tag.

### `onturnon(inst)`
*   **Description:** Callback invoked when the prototyper is turned on. Restarts or ensures the `proximity_loop` animation and looping sound (if not burnt).
*   **Parameters:** `inst` (entity) — the prototyper instance.
*   **Returns:** Nothing.
*   **Error states:** No effect if the entity has the `burnt` tag.

### `onactivate(inst)`
*   **Description:** Callback invoked when the prototyper is activated (e.g., via inventory or context action). Plays the "use" animation followed by loop and emits a use sound (if not burnt).
*   **Parameters:** `inst` (entity) — the prototyper instance.
*   **Returns:** Nothing.
*   **Error states:** No effect if the entity has the `burnt` tag.

### `onbuilt(inst)`
*   **Description:** Callback invoked when the prototyper is placed. Plays the "place" animation, transitions to idle, and emits a placement sound.
*   **Parameters:** `inst` (entity) — the prototyper instance.
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Save callback. Records whether the prototyper is currently burning or in a burnt state.
*   **Parameters:** `inst` (entity); `data` (table) — save data table to populate.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Load callback. If saved as burnt, triggers the `onburnt` handler of the `burnable` component to restore burnt state.
*   **Parameters:** `inst` (entity); `data` (table or nil) — loaded save data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` — fires `onbuilt` callback when entity is placed.
- **Pushes:** No events directly via `inst:PushEvent()`. Relies on component events (e.g., `burnable` fires `onextinguish`, `hauntable` fires `onhaunted`, etc.).
