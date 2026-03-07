---
id: gargoyles
title: Gargoyles
description: Creates petrifiable and reanimatable monster statues that crumble when mined and spawn moon variants upon reanimation.
tags: [combat, boss, environment, ai, loot]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5dcb4662
system_scope: environment
---

# Gargoyles

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `gargoyles.lua` file defines the prefab construction logic for statues (gargoyles) that represent various monsters in their petrified forms. These statues can be mined to deal damage; when fully mined, they crumble and drop loot. When triggered by external events (e.g., moonbase proximity), they may reanimate as living moon versions of the original monster (e.g., `moonhound`, `moonpig`). The system uses custom animation banks and builds, integrates with the `workable` component for mining, and manages lifecycle states (petrified, crumbling, reanimating, dead) using task scheduling and event listeners.

The prefabs are generated procedurally from a set of configurable templates (`data`), supporting variations in animation, petrification behavior, and naming (e.g., named gargoyles like `werepig` propagate their name to the reanimated creature via the `named` component).

## Usage example
```lua
-- Spawn a gargoyle prefab (e.g., hound in attack pose)
local gargoyle = SpawnPrefab("gargoyle_houndatk")

-- Trigger petrification manually (if it were in a living state)
gargoyle:Petrify()

-- Trigger reanimation near a moonbase
local moonbase = GetActiveMoonbase()
if moonbase and moonbase:IsValid() then
    gargoyle:Reanimate(moonbase)
end
```

## Dependencies & tags
**Components used:**  
- `lootdropper` (initializes loot tables, handles crumble/damage-based loot drops)  
- `workable` (defines mining interaction via `MINE` action, manages work progress)  
- `named` (optional; for *werepig* gargoyles, preserves name on reanimation)  
- `inspectable`  
- `savedrotation`  

**Tags added:**  
- `gargoyle` (added to all instances)  
- `_named` (temporary; removed before adding `named` component for *werepig* variants)  
- `NOCLICK` (added during crumble/reanimate transitions to prevent player interaction)  
- `FX` (added to local-only FX entities)

## Properties
No public properties are initialized as direct instance variables in the constructor. Entity behavior is controlled via component methods and internal state (`inst._petrifytask`, `inst._reanimatetask`). The `data` table (defined later in file) is consumed at runtime to configure prefabs, not attached to individual instances.

## Main functions
### `Petrify(inst)`
* **Description:** Transforms a living monster gargoyle into its petrified statue form. If already petrified and sleeping, it skips re-petrification and restores workability. If not sleeping and not currently petrifying, initiates the petrification sequence (animation + delayed state change).
* **Parameters:**  
  - `inst` (entity) — the gargoyle instance.
* **Returns:** Nothing.
* **Error states:** No explicit failure conditions; cancels existing petrify/reanimate tasks if already in transition.

### `Reanimate(inst, moonbase)`
* **Description:** Initiates reanimation of a petrified gargoyle into its living moon form, provided a valid `moonbase` is nearby. If the gargoyle has low mining progress, it crumbles directly instead. Otherwise, starts a sequence of struggle animations before reanimating and removing the gargoyle, then spawning the creature prefab.
* **Parameters:**  
  - `inst` (entity) — the gargoyle instance.  
  - `moonbase` (entity or nil) — the nearby moonbase source; used to track entity ownership.
* **Returns:** Nothing.
* **Error states:** No effect if `_reanimatetask` is already active; if `moonbase` is invalid or missing, the gargoyle may still crumble based on work progress.

### `crumble(inst)`
* **Description (internal helper):** Handles final stage of destruction. Cancels pending tasks, plays crumble animation, plays sound, drops loot, removes physics colliders, tags with `NOCLICK`, marks `persists = false`, and schedules full removal (`ErodeAway`) after a delay.
* **Parameters:**  
  - `inst` (entity) — the gargoyle instance.
* **Returns:** Nothing.

### `OnReanimate(inst, moonbase)`
* **Description (internal helper):** Executed at end of reanimation transition. Removes the gargoyle, spawns the petrified-prefab creature at the same transform, optionally restores its name (if named), tracks the moonbase via `entitytracker`, and sends the new creature into a `reanimate` stategraph state (potentially as dead if petrified from death pose).
* **Parameters:**  
  - `inst` (entity) — the gargoyle instance being removed.  
  - `moonbase` (entity or nil) — the moonbase associated with reanimation.
* **Returns:** Nothing.

### `Struggle(inst, moonbase, count)`
* **Description (internal helper):** Triggers struggle animation loop before reanimation begins. Iteratively schedules itself to run multiple times, then calls `OnReanimate` on final iteration.
* **Parameters:**  
  - `inst` (entity) — the gargoyle instance.  
  - `moonbase` (entity) — the moonbase source.  
  - `count` (number or nil) — remaining struggle iterations.
* **Returns:** Nothing.

### `onwork(inst, worker, workleft)`
* **Description (internal callback for `workable`):** Handler called after each mining action. Triggers crumble if `workleft <= 0`; otherwise selects animation variant based on remaining work.
* **Parameters:**  
  - `inst` (entity) — the gargoyle instance.  
  - `worker` (entity) — the player/mob performing mining.  
  - `workleft` (number) — remaining work units.
* **Returns:** Nothing.

### `onworkload(inst)`
* **Description (internal callback for `workable`):** Initializes animation state on component load (e.g., from save), matching the current `workleft` to the appropriate animation variant.
* **Parameters:**  
  - `inst` (entity) — the gargoyle instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `animover` (on FX entities) — triggers `inst.Remove()` when animation completes.  
- **Pushes:**  
  - None directly (relies on component-level events like `onwork` from `workable`, but no explicit `PushEvent` calls are present in this file).