---
id: monkeypillar
title: Monkeypillar
description: A decorative environmental prop that spawns in the Caves and exhibits periodic idle animations with random movement animations.
tags: [environment, decoration, animation]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c1726c71
system_scope: environment
---

# Monkeypillar

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `monkeypillar` is a non-interactive environmental prop used to add visual variety to cave environments. It does not possess gameplay logic beyond animation and lighting, and is purely decorative. It is not an entity component but rather a `Prefab` definition with embedded setup logic for animations, lighting, and state persistence across world saves/loads.

## Usage example
While not directly instantiated via component API, the `monkeypillar` prefab is used by world generation systems (e.g., room layouts or task sets) as a static scenery element. Modders typically reference it in map files like `static_layouts/cave/monkeypillar.lua` or via `TheWorld:PushEvent("spawnmonkeypillar", {pos = ...})` if custom spawning logic is implemented.

```lua
-- Example of spawning via world gen (conceptual, not actual API)
inst = SpawnPrefab("monkeypillar")
if inst then
    inst.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** None directly — uses low-level entity services (`Transform`, `AnimState`, `Light`, `SoundEmitter`, `Network`) and the `inspectable` component.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `pillar_id` | string or number | `nil` (set to random `"1"`–`"4"` on spawn) | Identifies the pillar's variant; used to select idle/move animation set. |
| `_moveanim_trigger` | boolean | `false` | Internal flag indicating if a move animation should play on next `animover` event. |
| `_moveanim_task` | Task | `nil` | Reference to the scheduled delay task for triggering animation transitions. |

## Main functions
### `setpillartype(inst, index)`
*   **Description:** Sets or randomizes the `pillar_id` and initializes the animation. Must be called on master after load or spawn.
*   **Parameters:** 
    *   `inst` (Entity instance) — the monkeypillar entity.
    *   `index` (number or string, optional) — if provided, forces the pillar ID; otherwise a random ID between 1 and 4 is assigned.
*   **Returns:** Nothing.
*   **Error states:** No error handling — assumes valid `inst` and animation bank.

### `queue_moveanim_task(inst)`
*   **Description:** Schedules the next animation transition (idle → idle_move) after a randomized delay between 15 and 25 seconds.
*   **Parameters:** 
    *   `inst` (Entity instance) — the monkeypillar entity.
*   **Returns:** Nothing.

### `OnAnimOver(inst)`
*   **Description:** Callback for the `animover` event; triggers transition between idle and move animations based on `_moveanim_trigger`.
*   **Parameters:** 
    *   `inst` (Entity instance) — the monkeypillar entity.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Serializes the `pillar_id` for world save persistence.
*   **Parameters:** 
    *   `inst` (Entity instance) — the monkeypillar entity.
    *   `data` (table) — the save data table to populate.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores the `pillar_id` from saved data after world load.
*   **Parameters:** 
    *   `inst` (Entity instance) — the monkeypillar entity.
    *   `data` (table) — the loaded save data (may be `nil`).
*   **Returns:** Nothing.

### `OnEntitySleep(inst)`
*   **Description:** Cancels pending animation tasks when the entity sleeps (e.g., player leaves area).
*   **Parameters:** 
    *   `inst` (Entity instance) — the monkeypillar entity.
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Restarts the animation task queue when the entity wakes (e.g., player returns to area).
*   **Parameters:** 
    *   `inst` (Entity instance) — the monkeypillar entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — triggers `OnAnimOver` to handle animation sequencing.
- **Pushes:** None.

### Additional notes
- Animations are selected via `idle{pillar_id}` (e.g., `idle3`) and `idle{pillar_id}_move` (e.g., `idle3_move`).
- Lighting is configured with low intensity (`0.6`) and a warm-grey color (`rgb: 125/255`) to blend with cave ambience.
- `MakeSnowCoveredPristine` and `MakeSnowCovered` suggest compatibility with snow-covered prefabs, though `monkeypillar` appears exclusively in caves and likely inherits unused logic.
- The `inspectable` component allows players to interact with the pillar (e.g., via UI inspection), though no custom inspect text is defined.