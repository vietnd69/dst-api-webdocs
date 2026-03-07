---
id: charlie_npc
title: Charlie Npc
description: Represents the non-player character Charlie during the nightmare phase, handling spawning, casting animation, and despawning behavior.
tags: [boss, ai, event, npc]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: facad8a9
system_scope: entity
---

# Charlie Npc

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`charlie_npc` is a prefab component that defines the behavior of Charlie, a special NPC appearing during the nightmare phase. It manages visual and audio cues during spawn, casting preparation, and departure — including dynamic shadow toggling, animation sequencing, and sound playback. It integrates with the `charliecutscene` component on a related entity (`inst.atrium`) to signal completion of Charlie's presence via the `Finish()` method.

## Usage example
```lua
local charlie = Prefab("charlie_npc")
local inst = CreateEntity()
inst:AddPrefab("charlie_npc")
-- Initial spawn and animations are handled automatically upon prefab instantiation.
-- Subsequent behavior (e.g., StartCasting, Despawn) is triggered externally via inst.StartCasting()
```

## Dependencies & tags
**Components used:** None directly instantiated (only references `inst.atrium.components.charliecutscene`).  
**Tags:** Adds `"character"` and `"charlie_npc"`.

## Properties
No public properties are defined in the constructor.

## Main functions
### `StartCasting(cast_time)`
*   **Description:** Initiates Charlie’s casting animation sequence and starts looping cast sound. Typically called before Charlie opens a rift.
*   **Parameters:** `cast_time` (number) — duration (in frames) for the casting animation.
*   **Returns:** Nothing.

### `Despawn()`
*   **Description:** Starts Charlie’s departure sequence: stops cast sound, plays post-animation, disables dynamic shadow, and schedules removal.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StartCastingWithDelay(delay, cast_time)`
*   **Description:** Schedules `StartCasting` and `Despawn` to run after specified frame delays. Used to coordinate multi-step actions (e.g., waiting before casting begins).
*   **Parameters:** 
    * `delay` (number) — frames to wait before starting cast.
    * `cast_time` (number) — frames for casting duration.
*   **Returns:** Nothing.

## Events & listeners
- **Pushes:** `"charliecutscene"` (via `charliecutscene:Finish()`) — signals completion of Charlie’s interaction with the world.  
- **Listens to:** None defined directly.

## Events & listeners (Entity-wide)
- **Listens to:** `OnRemoveEntity` — internal handler triggers `OnRemove()` to clean up sounds and call `charliecutscene:Finish()` if applicable.

## Notes
- `inst.persists = false` ensures the entity is not saved across game sessions.
- The `DisplayNameFn` dynamically changes Charlie’s name based on whether the observing player is known (e.g., Winona, Waxwell) or not (fallback to alternate name).
- Dynamic shadow is initially disabled and re-enabled ~22 frames post-spawn (`EnableDynamicShadow`).
- Sound handles use constants `AMB_SOUND_NAME = "ambsound"` and `CAST_SOUND_NAME = "castloopsound"` for reliable cleanup.