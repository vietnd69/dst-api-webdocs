---
id: worm_boss_util
title: Worm Boss Util
description: Provides core utility functions and constants for the Worm Boss boss fight, handling chunk generation, movement, digestion, and state transitions.
tags: [boss, ai, combat, locomotion]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 12fa9363
system_scope: entity
---

# Worm Boss Util

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`worm_boss_util.lua` is a shared utility module that encapsulates core logic for the Worm Boss entity (Wanda). It defines state enums, chunk behavior templates, and a suite of functions that manage the boss’s movement, body segmentation, dirtFX generation, digestion of devoured entities, and transitions between states like moving, idle, digesting, and dead. This module is not a component itself but a library referenced by the main `worm_boss` prefab and its state graphs.

## Usage example
```lua
local worm_utils = require("prefabs/worm_boss_util")

-- Initialize a new chunk at a given position
local pt = Vector3(10, 0, 10)
worm_utils.CreateNewChunk(worm_inst, pt, false)

-- Check if a chunk segment should apply thorn damage
if worm_utils.ShouldDoSpikeDamage(chunk) then
    segment:DoThornDamage()
end

-- Trigger digestion of devoured entities
worm_utils.Digest(worm_inst)

-- Handle knocking back nearby entities
worm_utils.Knockback(source, target)
```

## Dependencies & tags
**Components used:** `combat`, `edible`, `groundpounder`, `health`, `highlightchild`, `inventory`, `lootdropper`, `oldager`, `sanity`

**Tags:** `notarget`, `depleted`, `heavyarmor`, `heavybody`, `player`, `devourable`, `irreplaceable`, `INLIMBO`, `NOCLICK`, `FX`, `DECOR`, `largecreature`, `worm_boss_piece`, `noattack`, `playerghost`, `_inventoryitem`, `character`, `smallcreature`

## Properties
No public properties. This file exports only functions and constants.

## Main functions
### `CHUNK_STATE`
* **Description:** Enum defining possible states for a worm chunk: `EMERGE`, `MOVING`, `IDLE`, `TRANSITION_TO_SEGMENTED`.
* **Returns:** Table of integer constants.

### `STATE`
* **Description:** Enum defining global worm states: `MOVING`, `IDLE`, `DEAD`, `DIGESTING`.
* **Returns:** Table of integer constants.

### `CHUNK_TEMPLATE`
* **Description:** Table used to initialize new worm chunks with default field values.
* **Returns:** Table with fields: `state`, `startpos`, `segments`, `rotation`, `groundpoint_start`, `groundpoint_end`, `ease`, `nextseg`, `segtimeMax`, `segmentstotal`.

### `WORM_LENGTH`
* **Description:** Constant defining the ideal number of chunks in the worm’s body (value: `3`).
* **Returns:** `3`.

### `MAX_SEGTIME`
* **Description:** Alias for `CHUNK_TEMPLATE.segtimeMax`, the time in seconds a segment takes to traverse a chunk.
* **Returns:** `1`.

### `ShouldDoSpikeDamage(chunk)`
* **Description:** Determines whether thorn damage should be applied based on easing state.
* **Parameters:** `chunk` (table) – the worm chunk to check.
* **Returns:** `true` if `chunk.ease` is `nil` or `>= THORN_EASE_THRESHOLD (0.5)`, otherwise `false`.

### `Knockback(source, target)`
* **Description:** Applies knockback to a target entity (if not immune).
* **Parameters:**
  * `source` (Entity) – the entity applying knockback.
  * `target` (Entity) – the entity being knocked back.
* **Returns:** Nothing.
* **Error states:** Returns early if `target` is `nil`, dead, or has the `noattack` tag.

### `ToggleOffPhysics(inst)`
* **Description:** Disables all collision masks except `GROUND` on the entity’s physics body.
* **Parameters:** `inst` (Entity) – the entity whose physics mask to modify.
* **Returns:** Nothing.

### `ToggleOnPhysics(inst)`
* **Description:** Re-enables standard collision masks (`WORLD`, `OBSTACLES`, `SMALLOBSTACLES`, `CHARACTERS`, `GIANTS`).
* **Parameters:** `inst` (Entity) – the entity whose physics mask to modify.
* **Returns:** Nothing.

### `SpawnDirt(inst, chunk, pt, start, instant)`
* **Description:** Spawns a `worm_boss_dirt` FX entity for the chunk’s start or end point and configures its animation and highlight chain.
* **Parameters:**
  * `inst` (Entity) – the worm entity.
  * `chunk` (table) – the chunk for which to spawn dirt.
  * `pt` (Vector3) – spawn position.
  * `start` (boolean) – `true` for start point, `false` for end.
  * `instant` (boolean) – if `true`, spawn in idle state without physics.
* **Returns:** Nothing.

### `DoChew(inst, target, useimpactsound)`
* **Description:** Applies combat damage and sanity drain to a devoured entity, optionally suppressing impact sound.
* **Parameters:**
  * `inst` (Entity) – the worm entity.
  * `target` (Entity) – the devoured entity.
  * `useimpactsound` (boolean) – whether to play impact sound.
* **Returns:** Nothing.

### `ChewAll(inst)`
* **Description:** Triggers chewing/damage for all entities in `inst.devoured`.
* **Parameters:** `inst` (Entity) – the worm entity.
* **Returns:** Nothing.

### `DoSpitOut(inst, target, spitfromhead, spitfromlocatoin)`
* **Description:** Ejects a devoured entity via the `spitout` state event, or removes it if not player/devourable.
* **Parameters:**
  * `inst` (Entity) – the worm entity.
  * `target` (Entity) – the entity to eject.
  * `spitfromhead` (boolean) – if `true`, spit from head.
  * `spitfromlocatoin` (boolean) – if `true`, spit from target’s current location.
* **Returns:** Nothing.

### `SpitAll(inst, spitfromhead, spitfromlocatoin)`
* **Description:** Ejects all devoured entities and items in inventory, and spawns three poop items if tail is present.
* **Parameters:**
  * `inst` (Entity) – the worm entity.
  * `spitfromhead` (boolean) – see `DoSpitOut`.
  * `spitfromlocatoin` (boolean) – see `DoSpitOut`.
* **Returns:** Nothing.

### `Digest(inst)`
* **Description:** Switches the worm to `DIGESTING` state, marks digesting chunks, and enables digestion sound for players.
* **Parameters:** `inst` (Entity) – the worm entity.
* **Returns:** Nothing.

### `HasFood(inst)`
* **Description:** Checks if the worm has items or devoured entities in inventory.
* **Parameters:** `inst` (Entity) – the worm entity.
* **Returns:** `true` if `NumItems() > 0` or `#devoured > 0`, otherwise `false`.

### `ShouldMove(inst)`
* **Description:** Determines if the worm should resume movement (not dead, no food, target out of melee range).
* **Parameters:** `inst` (Entity) – the worm entity.
* **Returns:** `true` if movement is appropriate, otherwise `false`.

### `CollectThingsToEat(inst, source)`
* **Description:** Finds and attempts to devour or loot entities near `source`, handling inventory transfer and devoured state.
* **Parameters:**
  * `inst` (Entity) – the worm entity.
  * `source` (Entity) – the point of origin for the search.
* **Returns:** `true` if at least one entity was eaten or devoured, otherwise `false`.

### `CreateNewChunk(inst, pt, instant)`
* **Description:** Creates and appends a new chunk to `inst.chunks`, spawns its start dirt FX, and sets the worm’s position.
* **Parameters:**
  * `inst` (Entity) – the worm entity.
  * `pt` (Vector3) – the ground position for the chunk’s start.
  * `instant` (boolean) – if `true`, skip animation (used for loading/death).
* **Returns:** The newly created chunk table.

### `FindNewEndPoint(inst, chunk)`
* **Description:** Computes a valid walkable endpoint for `chunk` based on target or random direction.
* **Parameters:**
  * `inst` (Entity) – the worm entity.
  * `chunk` (table) – the chunk to extend.
* **Returns:** Vector3 offset from `chunk.groundpoint_start`, or `nil` if none found.

### `UpdateSegmentArt(segment)`
* **Description:** Sets the build animation for a segment based on whether it is head, tail, or standard.
* **Parameters:** `segment` (Entity) – the worm segment entity.
* **Returns:** Nothing.

### `UpdateSegmentAnimPosition(segment, percentdist, useframe)`
* **Description:** Updates segment animation playback position.
* **Parameters:**
  * `segment` (Entity) – the segment entity.
  * `percentdist` (number) – 0..1 progress along the segment path.
  * `useframe` (boolean) – if `true`, set frame directly; otherwise use `SetPercent`.
* **Returns:** Nothing.

### `MoveSegmentUnderGround(inst, chunk, test_segment, percent, instant)`
* **Description:** Removes a finished segment from the chunk, updates FX, triggers thorn damage, and optionally schedules a new chunk.
* **Parameters:**
  * `inst` (Entity) – the worm entity.
  * `chunk` (table) – the chunk containing the segment.
  * `test_segment` (Entity) – the finished segment.
  * `percent` (number) – progress along segment (unused).
  * `instant` (boolean) – skip FX.
* **Returns:** Nothing.

### `AddSegment(inst, chunk, tail, instant)`
* **Description:** Spawns and configures a new worm segment, inserting it into `chunk.segments`.
* **Parameters:**
  * `inst` (Entity) – the worm entity.
  * `chunk` (table) – the chunk to append to.
  * `tail` (boolean) – marks the new segment as the tail if `true`.
  * `instant` (boolean) – skip damage and FX.
* **Returns:** Nothing.

### `UpdateChunk(inst, chunk, dt, instant)`
* **Description:** Main update loop for a single chunk: moves segments, manages idle animations, and handles death transitions.
* **Parameters:**
  * `inst` (Entity) – the worm entity.
  * `chunk` (table) – the chunk to update.
  * `dt` (number) – time since last frame.
  * `instant` (boolean) – skip FX/animations.
* **Returns:** Nothing.

### `SetCreateChunkTask(inst, pt)`
* **Description:** Schedules creation of a new chunk after `DELAY_TO_MOVE_UNDERGROUND (0.4)` seconds.
* **Parameters:**
  * `inst` (Entity) – the worm entity.
  * `pt` (Vector3) – spawn point for the next chunk.
* **Returns:** Nothing.

### `EmergeHead(inst, chunk, instant)`
* **Description:** Spawns the head prefab and transitions the worm to `IDLE` or `MOVING` state.
* **Parameters:**
  * `inst` (Entity) – the worm entity.
  * `chunk` (table) – the chunk containing the head’s start point.
  * `instant` (boolean) – skip eating and animation.
* **Returns:** Nothing.

### `SpawnAboveGroundHeadCorpse(inst, headchunk)`
* **Description:** Spawns a corpse head above ground and triggers death animations.
* **Parameters:**
  * `inst` (Entity) – the worm entity.
  * `headchunk` (table) – the head’s chunk.
* **Returns:** Nothing.

### `SpawnUnderGroundHeadCorpse(inst)`
* **Description:** Spawns a death head underground and triggers death state.
* **Parameters:** `inst` (Entity) – the worm entity.
* **Returns:** Nothing.

## Events & listeners
* **Listens to:** `newstate` – via `inst:ListenForEvent("newstate", OnThingExitDevouredState)` to reset health limits for devoured players exiting the devoured state.
* **Pushes:** `bodycomplete`, `death_ended`, `knockback` (via target event callbacks), `spit`, `spitout` (via target event callbacks), `death`.