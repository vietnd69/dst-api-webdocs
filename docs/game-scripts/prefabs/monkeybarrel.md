---
id: monkeybarrel
title: Monkeybarrel
description: A structure that spawns and manages monkeys, drops loot when broken, and responds to world events like acid rain and earthquakes by召回 or pausing spawns.
tags: [combat, structure, ai]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 42eb6923
system_scope: entity
---

# Monkeybarrel

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `monkeybarrel` is a structure prefab that functions as a monkey spawnpoint in the game world. It uses the `childspawner` component to manage periodic monkey spawns, the `lootdropper` component to define loot tables for when it is destroyed, and integrates with several world event systems (e.g., acid rain, earthquakes, haunts) to dynamically control monkey behavior. It is typically placed in cave entrances or ruins and interacts closely with monkey NPCs and environmental hazards.

## Usage example
```lua
-- Typical usage within a prefab definition (already embedded in the fn() function):
local inst = CreateEntity()
inst:AddComponent("childspawner")
inst:AddComponent("lootdropper")
inst:AddComponent("workable")
inst:AddComponent("hauntable")

-- The full setup is handled automatically by the Prefab("monkeybarrel", fn, ...) definition.
```

## Dependencies & tags
**Components used:** `childspawner`, `lootdropper`, `workable`, `hauntable`, `inspectable`, `burnable`, `propagator`  
**Tags added:** `cavedweller`  
**Tags checked:** `playerghost`, `INLIMBO`, `character`, `monster` (for haunt target selection)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `shake` | Task or nil | `nil` | Periodic task that plays barrel rattling animation and sound. Cancelled on hammer hit. |
| `task` | Task or nil | `nil` | Delayed task for resuming spawning after safe conditions (e.g., after `safetospawn` event). |
| `childspawner.childname` | string | `"monkey"` | Prefab name of child entities spawned by this barrel. |
| `childspawner.ongohome` | function | `ongohome` | Callback invoked when a spawned monkey returns home. Drops inventory. |
| `childspawner:SetSpawnedFn(shake)` | function | `shake` | Callback invoked immediately after each monkey is spawned. Triggers sound/animation. |

## Main functions
### `onhammered(inst)`
*   **Description:** Triggered when the barrel is hammered to destruction. Cancels ongoing shaker task, drops loot, spawns `collapse_small` FX, and removes the entity.
*   **Parameters:** `inst` (entity reference) — the monkey barrel instance.
*   **Returns:** Nothing.

### `onhit(inst, worker)`
*   **Description:** Triggered when the barrel is hit (but not destroyed). Releases all current children toward the worker, plays "hit" animation, and schedules a new shake task.
*   **Parameters:** 
    - `inst` (entity reference) — the monkey barrel instance.
    - `worker` (entity reference) — the entity performing the hit (e.g., player or monster).
*   **Returns:** Nothing.

### `PushSafetospawn(inst)`
*   **Description:** Private helper that fires the `"safetospawn"` event to allow spawning to resume after a danger event (e.g., earthquake, acid rain).
*   **Parameters:** `inst` (entity reference).
*   **Returns:** Nothing.

### `ReturnChildren(inst)`
*   **Description:** Instructs all currently spawned monkeys outside the barrel to return home via `homeseeker:GoHome()`, then schedules a `"safetospawn"` event if none is already pending.
*   **Parameters:** `inst` (entity reference).
*   **Returns:** Nothing.

### `OnIgniteFn(inst)`
*   **Description:** Handles barrel ignition. Stops shaker task, plays "shake" animation, and releases all children immediately (to flee fire).
*   **Parameters:** `inst` (entity reference).
*   **Returns:** Nothing.

### `ongohome(inst, child)`
*   **Description:** Callback for `childspawner.ongohome`. Drops all inventory items from the returning monkey.
*   **Parameters:** 
    - `inst` (entity reference) — the monkey barrel.
    - `child` (entity reference) — the returning monkey.
*   **Returns:** Nothing.

### `onsafetospawn(inst)`
*   **Description:** Handles the `"safetospawn"` event. If acid rain is not active, resumes spawning via `childspawner:StartSpawning()`. Otherwise, reschedules the `"safetospawn"` event.
*   **Parameters:** `inst` (entity reference).
*   **Returns:** Nothing.

### `onacidrainresponse(inst)`
*   **Description:** Delays checking world state; if acid rain is ongoing, pushes the `"monkeydanger"` event to stop spawning and recall monkeys.
*   **Parameters:** `inst` (entity reference).
*   **Returns:** Nothing.

### `OnHaunt(inst)`
*   **Description:** Handles haunt behavior. Has a chance to release monkeys toward a nearby valid target (`character` or `monster`, excluding ghosts and limbo). Returns `true` on successful haunt.
*   **Parameters:** `inst` (entity reference).
*   **Returns:** `boolean` — `true` if haunt succeeded (i.e., at least one monkey was released), otherwise `false`.
*   **Error states:** Returns early with `false` if `childspawner` is missing, cannot spawn, or `math.random()` exceeds `TUNING.HAUNT_CHANCE_HALF`.

### `enqueueShake(inst)`
*   **Description:** Schedules a recurring task that periodically plays the barrel's rattling animation and sound.
*   **Parameters:** `inst` (entity reference).
*   **Returns:** Nothing.

### `shake(inst)`
*   **Description:** Called by `enqueueShake`. Plays a random movement animation and sound.
*   **Parameters:** `inst` (entity reference).
*   **Returns:** Nothing.

### `onruinsrespawn(inst, respawner)`
*   **Description:** Handles respawning after RuinsRespawner logic. Plays a spawn animation and FX if the respawner is not asleep.
*   **Parameters:** 
    - `inst` (entity reference) — the monkey barrel.
    - `respawner` (RuinsRespawner instance).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `"warnquake"` (on `TheWorld.net`) — triggers `ondanger`, stopping spawning and calling `ReturnChildren`.
  - `"monkeydanger"` — same as above.
  - `"safetospawn"` — triggers `onsafetospawn`.
  - `"onignite"` — triggers `OnIgniteFn`.
- **Pushes:** No events directly; triggers world or internal events (e.g., `"monkeydanger"`, `"safetospawn"`) via `inst:PushEvent(...)` or via listeners that call back into `inst:PushEvent`.
- **World State Watch:** `"isacidraining"` — schedules delayed `onacidrainresponse`.