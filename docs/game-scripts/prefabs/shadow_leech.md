---
id: shadow_leech
title: Shadow Leech
description: A hostile shadow creature prefab that spawns in response to the Daywalker, tracks it via EntityTracker, and applies a sanity aura based on observer perception.
tags: [combat, ai, hostile, sanity, shadow]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f2f370bd
system_scope: entity
---

# Shadow Leech

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`shadow_leech` is a hostile prefab representing a summoned shadow entity used in DST's nightmare/daywalker event systems. It is dynamically spawned in relation to a Daywalker entity, tracks it via the `entitytracker` component, and applies a negative sanity aura that affects observers only when they are insane (`IsCrazy`). The prefab integrates closely with the `health`, `combat`, `locomotor`, `lootdropper`, and `sanityaura` components. It also supports client-side visual transparency updates via `transparentonsanity` and uses a custom brain (`shadow_leechbrain`) for AI behavior.

## Usage example
```lua
-- Example: Spawn a shadow leech in response to a Daywalker event
local leech = TheWorld:SpawnPrefab("shadow_leech")
if leech ~= nil and leech.components ~= nil then
    -- Begin tracking and follow the daywalker
    leech:OnSpawnFor(daywalker_inst, 2.0)  -- with 2-second spawn delay
    
    -- Alternatively: fling leech away from daywalker on destruction
    -- leech:OnFlungFrom(daywalker_inst, 1.5, true)
end
```

## Dependencies & tags
**Components used:**  
`transform`, `animstate`, `soundemitter`, `follower`, `network`, `physics`, `entitytracker`, `sanityaura`, `health`, `combat`, `lootdropper`, `locomotor`, `transparentonsanity`

**Tags added:** `shadowcreature`, `monster`, `hostile`, `shadow`, `notraptrigger`, `shadow_aligned`, `NOBLOCK`

## Properties
No public properties are defined or initialized in the constructor. All configuration is done via method calls (e.g., `SetMaxHealth`, `SetLoot`) and function references (e.g., `ToggleBrain`, `OnSpawnFor`).

## Main functions
Not applicable — this is a prefab definition file. Core functionality resides in the `fn()` return function and attached function references (`inst.ToggleBrain`, `inst.OnSpawnFor`, `inst.OnFlungFrom`, `inst.OnLoadPostPass`), which are documented below as instance-level methods exposed on the prefab instance.

### `inst.ToggleBrain(enable)`
* **Description:** Assigns or removes the `shadow_leechbrain` based on the `enable` flag.
* **Parameters:** `enable` (boolean) — if `true`, sets the brain to `shadow_leechbrain`; otherwise, clears the brain (`nil`).
* **Returns:** Nothing.
* **Error states:** No built-in validation; expected use is during lifecycle events (e.g., death or reset).

### `inst.OnSpawnFor(daywalker, delay)`
* **Description:** Initializes the leech’s spawn behavior: tracks the provided `daywalker`, faces the daywalker, and enters the `"spawn_delay"` state for the specified duration.
* **Parameters:**  
  `daywalker` (Entity) — the Daywalker entity to track.  
  `delay` (number) — seconds to wait before fully entering gameplay state.
* **Returns:** Nothing.
* **Error states:** Assumes `daywalker` has a valid `entitytracker` and `Transform`; silently fails if not (but no explicit checks are performed).

### `inst.OnFlungFrom(daywalker, speedmult, randomdir)`
* **Description:** Reverses and propels the leech away from the `daywalker` upon detachment or death, using physics teleportation.
* **Parameters:**  
  `daywalker` (Entity) — source of the fling.  
  `speedmult` (number, optional) — multiplier for fling distance (default `1`).  
  `randomdir` (boolean) — if `true`, uses random rotation; otherwise, minor angular offset around `daywalker`’s direction.
* **Returns:** Nothing.
* **Error states:** Assumes `daywalker` has `Transform:GetWorldPosition()` and `Transform:GetRotation()`; assumes leech is not blocked by physics collisions.

### `inst.OnLoadPostPass(ents, data)`
* **Description:** Restores tracking of the Daywalker after world load, by retrieving it from `entitytracker` and re-invoking `StartTrackingLeech`.
* **Parameters:** `ents`, `data` — legacy parameters, unused in current implementation.
* **Returns:** Nothing.
* **Error states:** No-op if `daywalker` is not found or lacks `StartTrackingLeech`.

## Events & listeners
None identified — no `inst:ListenForEvent` calls or `inst:PushEvent` usages are present in this file.