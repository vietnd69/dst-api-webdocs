---
id: mound
title: Mound
description: A buried grave structure that produces loot upon excavation, periodically spawns ghosts during full moons, and supports special Halloween event behaviors.
tags: [world, entity, loot, environment, halloween]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4508c355
system_scope: world
---

# Mound

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`mound` is a static world entity representing a buried grave. It functions as a loot-generating feature that becomes accessible when dug up using the `DIG` action. The mound uses the `workable` component for excavation, `childspawner` to spawn ghosts periodically (especially under full moons), `hauntable` to respond to haunt interactions, and `lootdropper` to release items. It also integrates with DST's full moon cycles and Halloween-specific event systems.

The entity registers listeners on the world state (`isfullmoon`) to toggle ghost spawning behavior and persists its dug state via `OnSave`/`OnLoad`.

## Usage example
```lua
-- Spawn a mound at world position
local mound = SpawnPrefab("mound")
mound.Transform:SetPosition(x, y, z)

-- Once dug (e.g., via player action), it drops loot and may spawn ghosts:
-- - Loot: nightmarefuel, trinkets, gems, cooking recipe cards, pumpkin carvers, scrapbook pages, ornaments
-- - Ghosts: occasionally during excavation, especially on full moons
-- - Halloween bats: 3 bats may spawn over time if luck rolls succeed
```

## Dependencies & tags
**Components used:** `inspectable`, `workable`, `lootdropper`, `hauntable`, `childspawner`, `sanity`, `spooked`, `specialeventsetup`, `health`, `age`
**Tags:** Adds `grave`, `buried`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ghost` | entity reference | `nil` | Reference to the spawned ghost entity, if any. |
| `ghost_of_a_chance` | number | `0.1` | Base probability (10%) of spawning a ghost when dug. |
| `scrapbook_anim` | string | `"gravedirt"` | Animation name used for scrapbook representation. |
| `components.workable` | Workable component | `nil` (removed after digging) | Workable state management. |
| `components.childspawner` | ChildSpawner component | Initialized | Controls ghost spawning behavior. |

## Main functions
### `onfinishcallback(inst, worker)`
*   **Description:** Executed when the mound is fully dug. Plays the `"dug"` animation, removes the `workable` component, applies sanity penalty to the worker, and handles loot spawning and ghost/bat/orament spawning logic.
*   **Parameters:**  
    - `inst` (entity) — The mound entity.  
    - `worker` (entity or `nil`) — The entity that performed the digging action. May be `nil` in some cases.  
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; relies on component existence checks (`worker.components.sanity ~= nil`, etc.). Ghost/spawn logic uses luck rolls to probabilistically determine outcomes.

### `ReturnChildren(inst)`
*   **Description:** Removes all children currently outside the mound (i.e., spawned ghosts), either by calling `"detachchild"` and `Remove()` on sleeping ones, or by killing active ones.
*   **Parameters:**  
    - `inst` (entity) — The mound entity.  
*   **Returns:** Nothing.

### `spawnghost(inst, chance, worker)`
*   **Description:** Attempts to spawn a ghost at a slight offset from the mound. Uses `TryLuckRoll` with `LuckFormulas.ChildSpawnerRareChild`.
*   **Parameters:**  
    - `inst` (entity) — The mound entity.  
    - `chance` (number or `nil`) — Override spawn chance; defaults to `nil`, falling back to `inst.ghost_of_a_chance`.  
    - `worker` (entity) — Used for luck roll calculation.  
*   **Returns:** `true` if ghost spawned successfully, `false` otherwise.

### `onfullmoon(inst, isfullmoon)`
*   **Description:** Callback triggered by world full moon state changes. Enables ghost spawning via `StartSpawning`/`StopRegen` on full moons, disables it and clears children on non-full moons.
*   **Parameters:**  
    - `inst` (entity) — The mound entity.  
    - `isfullmoon` (boolean) — Current full moon state.  
*   **Returns:** Nothing.

### `OnHaunt(inst, haunter)`
*   **Description:** Callback for haunt interactions. Always returns `true` (indicating a successful haunt), but original ghost-spawning logic is commented out.
*   **Parameters:**  
    - `inst` (entity) — The mound entity.  
    - `haunter` (entity) — The haunting entity.  
*   **Returns:** `true`.

### `GetStatus(inst)`
*   **Description:** Returns `"DUG"` if the `workable` component has been removed (i.e., after excavation), otherwise returns `nil`.
*   **Parameters:**  
    - `inst` (entity) — The mound entity.  
*   **Returns:** `string` `"DUG"` if dug, or `nil`.

### `OnSave(inst, data)`
*   **Description:** Serializes state for persistence. Sets `data.dug = true` if `workable` component is absent.
*   **Parameters:**  
    - `inst` (entity) — The mound entity.  
    - `data` (table) — Save data table.  
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores state on load. Removes `workable` and sets animation to `"dug"` if `data.dug` is `true` or `workable` is missing.
*   **Parameters:**  
    - `inst` (entity) — The mound entity.  
    - `data` (table or `nil`) — Loaded save data.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
    - `"onremove"` — Sets `inst.ghost = nil` to prevent dangling references when the ghost is removed.  
    - World state `"isfullmoon"` — Triggers `onfullmoon(inst, TheWorld.state.isfullmoon)` to manage spawning behavior.  
- **Pushes:**  
    - `"on_loot_dropped"` — Indirectly via `lootdropper:SpawnLootPrefab` (fired by loot entity).  
    - `"loot_prefab_spawned"` — Indirectly via `lootdropper:SpawnLootPrefab` (fired by mound).  
    - `"sanitydelta"` — Indirectly via `sanity:DoDelta`.  
    - `"gosane"/"goinsane"/"goenlightened"` — Indirectly via sanity change.  
    - `"detachchild"` — Pushed to child ghosts before removal.  
