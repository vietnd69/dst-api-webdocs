---
id: boatrace_spectator_dragonling
title: Boatrace Spectator Dragonling
description: A flying companion entity that follows the race indicator during boat races, reacting to leaks and checkpoints in the environment.
tags: [companion, flying, race, ai, reactor]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b817c851
system_scope: entity
---

# Boatrace Spectator Dragonling

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`boatrace_spectator_dragonling` is aprefab that instantiates a flying dragon companion used exclusively in boat races. It follows a race indicator entity, monitors for boat leaks on walkable platforms, and reacts visually (via state graph transitions) when leaks or checkpoints are discovered. The entity is non-persistent, AI-driven, and interacts primarily through the `entitytracker`, `inspectable`, `knownlocations`, `timer`, and `locomotor` components. It uses a custom brain and stategraph (`SGboatrace_spectator_dragonling`) to orchestrate behavior such as flying in, reacting to leaks (`emote_collision`), and celebrating checkpoints (`emote_checkpoint`).

## Usage example
```lua
-- The prefab is created automatically by the game during a boat race
local inst = Prefab("boatrace_spectator_dragonling", fn, assets)
-- In practice, this entity is spawned via the race scenario logic,
-- and it listens for the "new_boatrace_indicator" event to begin follow behavior.
```

## Dependencies & tags
**Components used:** `entitytracker`, `inspectable`, `knownlocations`, `timer`, `locomotor`, `physics`, `animstate`, `soundemitter`, `transform`, `dynamicshadow`, `network`  
**Tags added:** `flying`, `ignorewalkableplatformdrowning`, `companion`, `notraptrigger`, `noauradamage`, `small_livestock`, `NOBLOCK`, `nomagic`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_seen_leaks` | table | `{}` | Tracks which leak entities have already triggered a reaction to avoid repeated state entries. |

## Main functions
### `look_for_reactions(inst)`
*   **Description:** Periodically scans for entities with active leaks (`boatleak.has_leaks == true`) on the same walkable platform as the dragonling’s indicator boat. If a leak is found and not yet seen, triggers the `"emote_collision"` state.
*   **Parameters:** `inst` (entity instance) — the dragonling instance.
*   **Returns:** Nothing.
*   **Error states:** Exits early if `indicator`, `indicator.parent` (boat), or `walkableplatform` component is missing.

### `new_boatrace_indicator(inst, indicator)`
*   **Description:** Sets up tracking for the provided race indicator entity, registers event listeners for its removal and checkpoint events, starts leak monitoring periodic task, and transitions to `"fly_in"` state.
*   **Parameters:**  
    *   `inst` (entity instance) — the dragonling instance.  
    *   `indicator` (entity instance) — the race indicator entity to follow.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `new_boatrace_indicator` — triggers `new_boatrace_indicator()` to begin tracking and behavior.  
  - `onremove` (on indicator) — triggers `_on_indicator_removed` to handle indicator removal.  
  - `checkpoint_found` (on indicator) — triggers `_on_indicator_found_checkpoint` to initiate checkpoint celebration.  
  - `on_collide` (on boat) — implicitly referenced in removal callback; no active listener registration present in source.  
- **Pushes:** None identified in source.

