---
id: mandrake_planted
title: Mandrake Planted
description: A planted mandrake prefab that serves as the initial ground state before becoming active, and supports regrowth after being burned or replanted.
tags: [plant, regrowth, interact, event]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8673584a
system_scope: entity
---

# Mandrake Planted

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`mandrake_planted` is the initial planted state of the mandrake plant prefab. It is a static entity that resides on the ground and can be picked to transition to the `mandrake_active` state. It integrates with the `pickable` component to handle picking and regrowth logic, and supports regrowth upon being burned. The prefab includes animation, sound, burnable, and propagator properties, and is designed to transition between states (`mandrake_planted` → `mandrake_active` on pick, and `mandrake_active` → `mandrake_inactive` on death).

## Usage example
```lua
-- Typical usage occurs automatically via prefab spawning; manual instantiation example:
local inst = SpawnPrefab("mandrake_planted")
if inst and inst.components.pickable then
    -- Trigger regrowth manually (e.g., after manual reset or custom logic)
    inst.components.pickable:Regen()
end
```

## Dependencies & tags
**Components used:** `pickable`, `inspectable`, `burnable`, `propagator`, `small_propagator`, `small_burnable`, `regrowth`, `soundemitter`, `animstate`, `transform`, `network`
**Tags:** Adds `donotautopick`.

## Properties
No public properties.

## Main functions
### `replant(inst)`
*   **Description:** Resets the planted mandrake to the "planted" visual state (animation and sounds). Used internally to restore the planted form after being replanted from active state.
*   **Parameters:** `inst` (Entity) — the mandrake_planted instance.
*   **Returns:** Nothing.

### `onpicked(inst, picker)`
*   **Description:** Handles the transition from `mandrake_planted` to `mandrake_active`. Spawns `mandrake_active` at the same position and delegates picking behavior.
*   **Parameters:**
    *   `inst` (Entity) — the current `mandrake_planted` instance.
    *   `picker` (Entity) — the entity that picked the mandrake (typically a player).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onburnt` — triggers `inst.OnStartRegrowth` to enable regrowth after burning.
- **Does not listen to:** `onremove` — explicitly removes the callback to prevent regrowth upon removal.