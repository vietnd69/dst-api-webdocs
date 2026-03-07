---
id: monkeytail
title: Monkeytail
description: A harvestable plant that produces reeds, regenerates over time, and supports being dug up with a shovel.
tags: [plant, harvest, regen, dig]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 79f3d099
system_scope: world
---

# Monkeytail

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `monkeytail` prefab represents a harvestable flora item in DST. It functions as a regenerative crop that yields `cutreeds` when picked and supports being dug up (with `dug_monkeytail` loot) using a shovel. It integrates with multiple core systems: `pickable` (harvest cycles), `witherable` (disease state), `lootdropper` (loot spawning), `workable` (shovel interaction), `fuel` (burnable resource), and `inspectable`. It is tagged `plant`, `silviculture`, and `witherable`.

## Usage example
```lua
-- To spawn a monkeytail at position:
local monkeytail = SpawnPrefab("monkeytail")
if monkeytail ~= nil then
    monkeytail.Transform:SetPosition(x, y, z)
end

-- To dig up a monkeytail (typically invoked via WorkAction.DIG):
if monkeytail.components.workable ~= nil then
    monkeytail.components.workable:Work(math.huge) -- work finishes immediately if workable
end
```

## Dependencies & tags
**Components used:** `pickable`, `witherable`, `lootdropper`, `inspectable`, `fuel`, `workable`  
**Tags added/checked:** `plant`, `silviculture`, `witherable`, `waxable`

## Properties
No public properties are exposed directly on this prefab itself. It uses component properties (e.g., `inst.components.pickable.cycles_left`).

## Main functions
### `dig_up(inst, worker)`
*   **Description:** Handles full removal of the monkeytail entity when dug up. Spawns `cutreeds` (product) and `dug_monkeytail` (dig loot), checking for withered state. Called by the `workable` component when digging completes.
*   **Parameters:**  
    `inst` (entity) – the monkeytail instance.  
    `worker` (entity or nil) – the entity performing the dig action.  
*   **Returns:** Nothing. Entity is removed after spawning loot.

### `onregenfn(inst)`
*   **Description:** Animation handler triggered when the monkeytail regenerates after being picked. Plays `grow` then loops `idle` animation.
*   **Parameters:**  
    `inst` (entity) – the monkeytail instance.  
*   **Returns:** Nothing.

### `makeemptyfn(inst)`
*   **Description:** Animation handler called when the monkeytail becomes empty (picks exhausted) or transitions from withered state. Plays `picked` or `dead_to_empty` depending on state.
*   **Parameters:**  
    `inst` (entity) – the monkeytail instance.  
*   **Returns:** Nothing.

### `makebarrenfn(inst, wasempty)`
*   **Description:** Animation handler called when `pickable:MakeBarren()` is invoked (e.g., during harvest or transplant). Plays `idle_dead`, `full_to_dead`, or `empty_to_dead` based on current state.
*   **Parameters:**  
    `inst` (entity) – the monkeytail instance.  
    `wasempty` (boolean) – whether the plant was already empty before making barren.  
*   **Returns:** Nothing.

### `onpickedfn(inst)`
*   **Description:** Animation and sound handler executed when the monkeytail is picked. Plays `picking` and transitions to `picked` or `idle_dead`.
*   **Parameters:**  
    `inst` (entity) – the monkeytail instance.  
*   **Returns:** Nothing.

### `ontransplantfn(inst)`
*   **Description:** Called when the monkeytail is transplanted. Immediately makes it barren via `pickable:MakeBarren()`, indicating it cannot be picked again.
*   **Parameters:**  
    `inst` (entity) – the monkeytail instance.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (uses callbacks in `pickable` component, not direct event listeners).
- **Pushes:** None directly; relies on component events (e.g., `pickable` fires internal events during harvest/regen, `lootdropper` fires `on_loot_dropped` and `loot_prefab_spawned`).