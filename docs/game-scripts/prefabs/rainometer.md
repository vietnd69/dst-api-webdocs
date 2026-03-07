---
id: rainometer
title: Rainometer
description: A structure component that tracks local rain levels via animation and responds to player interaction and environmental effects like fire.
tags: [structure, environment, weather, fire]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5744470e
system_scope: environment
---

# Rainometer

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `rainometer` is a structure prefab that visually indicates local precipitation levels by animating a meter based on `TheWorld.state.pop`. It is built as an interactable structure that can be hammered to retrieve components and extinguish any active fire. It integrates with the `burnable`, `lootdropper`, and `workable` components to manage state changes, looting, and hammering behavior. The component tracks its burnt state across saves and properly handles extinguishment and animation updates during rain cycles.

## Usage example
The `rainometer` is instantiated via the game's prefab system and should not be manually constructed. A typical usage scenario occurs when placed by the player:
```lua
-- Automatically handled when placed from inventory
local inst = CreateEntity()
inst:AddComponent("inspectable")
inst:AddComponent("lootdropper")
inst:AddComponent("workable")
-- etc., as set up in the fn() constructor
```

## Dependencies & tags
**Components used:** `burnable`, `lootdropper`, `workable`, `inspectable`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`, `propagator`, `hauntable`
**Tags:** Adds `structure`; checks `burnt`, `burning`.

## Properties
No public properties are directly exposed by this component’s logic.

## Main functions
### `onhammered(inst, worker)`
*   **Description:** Callback triggered when the rainometer is hammered. Extinguishes fire if present, drops loot, spawns a `collapse_small` FX, and removes the entity.
*   **Parameters:**
    *   `inst` (Entity) – The rainometer entity instance.
    *   `worker` (Entity or nil) – The entity performing the hammering.
*   **Returns:** Nothing.
*   **Error states:** No error states; always proceeds with cleanup.

### `DoCheckRain(inst)`
*   **Description:** Updates the meter animation percentage to reflect current rain level (`TheWorld.state.pop`) unless the entity is already burnt.
*   **Parameters:**
    *   `inst` (Entity) – The rainometer entity instance.
*   **Returns:** Nothing.

### `StartCheckRain(inst)`
*   **Description:** Starts a periodic task (every 1 second) that calls `DoCheckRain` to refresh the meter animation, unless a task already exists or the entity is burnt.
*   **Parameters:**
    *   `inst` (Entity) – The rainometer entity instance.
*   **Returns:** Nothing.

### `onhit(inst)`
*   **Description:** Stops the rain-check task and plays the `hit` animation when the entity is hammered during operation.
*   **Parameters:**
    *   `inst` (Entity) – The rainometer entity instance.
*   **Returns:** Nothing.

### `onbuilt(inst)`
*   **Description:** Callback fired when the rainometer is built. Cancels any pending task, plays `place` animation, and emits a crafting sound. The animation completion triggers `animover` to restart the rain-check task.
*   **Parameters:**
    *   `inst` (Entity) – The rainometer entity instance.
*   **Returns:** Nothing.

### `makeburnt(inst)`
*   **Description:** Cancels the rain-check task when the entity enters the burnt state.
*   **Parameters:**
    *   `inst` (Entity) – The rainometer entity instance.
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Serializes burnt state into save data if the entity is burnt or currently burning.
*   **Parameters:**
    *   `inst` (Entity) – The rainometer entity instance.
    *   `data` (table) – Save data table to populate.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Restores burnt state on load by invoking `onburnt` callback if saved as burnt.
*   **Parameters:**
    *   `inst` (Entity) – The rainometer entity instance.
    *   `data` (table) – Loaded save data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` – triggers `onbuilt` handler.
- **Listens to:** `animover` – triggers `StartCheckRain`.
- **Listens to:** `burntup` – triggers `makeburnt`.
- **Pushes:** None directly.
