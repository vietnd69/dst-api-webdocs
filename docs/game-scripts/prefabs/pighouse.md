---
id: pighouse
title: Pighouse
description: Manages a structure that spawns and shelters pigmen, with state-dependent lighting, sound, and damage behavior.
tags: [structure, spawner, lighting, event]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 61e483a3
system_scope: structure
---

# Pighouse

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`pighouse` is a prefabricated structure that functions as a shelter and spawner for pigmen. It uses the `spawner`, `workable`, `burnable`, `playerprox`, and `inspectable` components to manage spawning logic, structural integrity, lighting states, and player-triggered sounds/animations. Its behavior changes based on occupancy, lighting, time of day (especially in caves), and whether it is burnt. Non-master clients manage visual window entities (`_window`, `_windowsnow`) with per-frame updates.

## Usage example
```lua
-- The pighouse prefab is instantiated via its standard constructor; typical mod usage includes
-- extending its behavior via component hooks. Example extension:
local inst = SpawnPrefab("pighouse")
inst.Transform:SetPosition(x, y, z)
inst.components.spawner.onoccupied = function(inst, child)
    -- Custom logic when a pig enters
    print("Pig entered:", child and child.prefab)
end
```

## Dependencies & tags
**Components used:** `burnable`, `drownable`, `health`, `inspectable`, `lootdropper`, `playerprox`, `spawner`, `werebeast`, `workable`  
**Tags added:** `structure`, `pig_house`

## Properties
No public properties defined in the constructor. Internal instance state (`inst.lightson`, `inst.doortask`, `inst.inittask`, `inst._window`, `inst._windowsnow`) is managed implicitly.

## Main functions
### `LightsOn(inst)`
*   **Description:** Activates the pighouse’s light and switches the idle animation to the lit variant. Plays the light-on sound and updates window entities.
*   **Parameters:** `inst` (entity) — the pighouse instance.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if the pighouse is `burnt` or lights are already on.

### `LightsOff(inst)`
*   **Description:** Deactivates the pighouse’s light, reverts to the idle animation, and hides window entities.
*   **Parameters:** `inst` (entity) — the pighouse instance.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if the pighouse is `burnt` or lights are already off.

### `onoccupied(inst, child)`
*   **Description:** Called by the `spawner` component when a pigman enters and occupies the pighouse. Plays entry sounds, toggles lights off, and sets up `transformwere`/`transformnormal` listeners on the child.
*   **Parameters:**  
    `inst` (entity) — the pighouse instance.  
    `child` (entity, optional) — the pigman that entered.
*   **Returns:** Nothing.

### `onvacate(inst, child)`
*   **Description:** Called by the `spawner` component when a pigman leaves. Restores lights, plays exit sound, cancels door delay tasks, resets the child’s health and werebeast state, and fires `onvacatehome` on the child.
*   **Parameters:**  
    `inst` (entity) — the pighouse instance.  
    `child` (entity, optional) — the pigman that vacated.
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Called when the pighouse is hammered. Extinguishes fire if burning, releases the occupied pigman, drops loot, spawns a debris FX, and destroys the pighouse.
*   **Parameters:**  
    `inst` (entity) — the pighouse instance.  
    `worker` (entity) — the entity performing the hammer action.
*   **Returns:** Nothing.

### `onhit(inst, worker)`
*   **Description:** Handles visual feedback when the pighouse is hit (not fully destroyed). Plays the hit animation and pushes animations to restore idle/lit state.
*   **Parameters:**  
    `inst` (entity) — the pighouse instance.  
    `worker` (entity) — the entity performing the hit action.
*   **Returns:** Nothing.

### `OnStartDay(inst)`
*   **Description:** Called when a cave day begins (only in The Caves). If occupied and not burnt, schedules a delayed task to release the pigman and potentially re-evaluate lighting based on ambient light level.
*   **Parameters:** `inst` (entity) — the pighouse instance.
*   **Returns:** Nothing.

### `onnear(inst)`
*   **Description:** Callback for `playerprox` when a player comes within `near` distance. Turns lights off if occupied.
*   **Parameters:** `inst` (entity) — the pighouse instance.
*   **Returns:** Nothing.

### `onfar(inst)`
*   **Description:** Callback for `playerprox` when a player moves beyond `far` distance. Turns lights on if occupied.
*   **Parameters:** `inst` (entity) — the pighouse instance.
*   **Returns:** Nothing.

### `getstatus(inst)`
*   **Description:** Implements the `inspectable.getstatus` callback. Returns a status string based on burn and occupancy state: `"BURNT"`, `"FULL"` (occupied + lights on), `"LIGHTSOUT"` (occupied + lights off), or `nil`.
*   **Parameters:** `inst` (entity) — the pighouse instance.
*   **Returns:** String or `nil`.

### `onoccupieddoortask(inst)`
*   **Description:** Task callback that runs after a short delay when a pig enters. Ensures lights turn back on if the player is now far enough away.
*   **Parameters:** `inst` (entity) — the pighouse instance.
*   **Returns:** Nothing.

### `spawncheckday(inst)`
*   **Description:** Called shortly after construction to check if the pighouse is occupied. If it is and it's a cave day or burning, it releases the pigman immediately. Otherwise, it forces a `playerprox` update to evaluate lighting.
*   **Parameters:** `inst` (entity) — the pighouse instance.
*   **Returns:** Nothing.

### `oninit(inst)`
*   **Description:** Initialization handler that may immediately spawn the pigman (if no spawn is pending and no child is owned). Defers actual logic to `spawncheckday` with a randomized delay.
*   **Parameters:** `inst` (entity) — the pighouse instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `burntup` — calls `onburntup` to clean up windows and tasks; `onignite` — releases the pigman; `onbuilt` — calls `onbuilt` to play placement animation; `transformwere`/`transformnormal` — plays pig-in-hut vs. werepig-in-hut sounds on child transformation; `death`, `ontrapped`, `detachchild`, `onremove` — handled via spawner’s automatic child hook management.
- **Pushes:** None directly (all event pushes originate from attached components or world state callbacks).
