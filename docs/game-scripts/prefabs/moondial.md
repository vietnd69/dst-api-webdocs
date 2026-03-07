---
id: moondial
title: Moondial
description: A world-anchored structure that reflects the current moon phase visually and functionally, enabling gestalt transformation under specific moon conditions.
tags: [structure, moon, transformation, environment]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e3963f70
system_scope: environment
---

# Moondial

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `moondial` is a structure prefab that visually indicates the current moon phase and enables gestalt transformation (via `Abigail`) under precise lunar conditions. It uses `workable` for dismantling, `inspectable` to report contextual status, and `ghostgestalter` to mediate player-initiated gestalt changes. Its behavior is tightly coupled to world state (`moonphase`, `isalterawake`) and uses the `SGmoondial` stategraph for animation.

## Usage example
```lua
local inst = SpawnPrefab("moondial")
inst.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `workable`, `inspectable`, `lootdropper`, `ghostgestalter`  
**Tags:** Adds `structure` to the entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `is_glassed` | boolean | `false` (initially) | `true` when the Altar is active and the Moondial is "glassed"; controls loot and state transitions. |
| `icon` | entity reference (globalmapicon) | `nil` (created lazily) | Map icon entity attached to track position for the minimap. |

## Main functions
### `domutatefn(inst, doer)`
*   **Description:** Handles the mutagenesis logic for gestalt transformation when a player attempts to interact with the Moondial. Validates world context (not in caves), night time, ghost summon status, and moon phase. May change the ghost’s gestalt state as a side effect.
*   **Parameters:** `inst` (entity), `doer` (player entity performing the action).
*   **Returns:** `true` if mutation succeeds; otherwise `false, reason` (string reason code: `"CAVE"`, `"NOGHOST"`, `"NOTNIGHT"`, `"NONEWMOON"`, `"NOFULLMOON"`).
*   **Error states:** Returns `false` and a string reason if conditions are unmet. May mutate `ghost:ChangeToGestalt()` state in-place on success.

### `getstatus(inst, viewer)`
*   **Description:** Returns a string key describing the Moondial’s current functional context from the viewer’s perspective.
*   **Parameters:** `inst` (the Moondial), `viewer` (the inspecting entity, typically a player).
*   **Returns:** `"CAVE"`, `"GLASSED"`, `"WEREBEAVER"`, `"GENERIC"`, `"NIGHT_NEW"`, `"NIGHT_FULL"`, `"NIGHT_WAX"`, or `"NIGHT_WANE"` based on world state and viewer.
*   **Error states:** Returns one of the known status keys under all world states; no `nil` result.

## Events & listeners
- **Listens to:**  
  `moonphase` – via `inst:WatchWorldState("moonphase", onmoonphasechagned)`  
  `isalterawake` – via `inst:WatchWorldState("isalterawake", onalterawake)`  
- **Pushes:**  
  No explicit `PushEvent` calls in the provided code.  
- **Callbacks:**  
  `onhammered` – called by `workable` when hammering completes; drops loot and removes the instance.  
  `glassed_loot_fn` – sets loot to `"moonglass"` when `is_glassed` is true.