---
id: hound_corpse
title: Hound Corpse
description: A corpse that automatically revives into a mutated hound after a delay unless extinguished or ignited.
tags: [death, ai, transformation, hound]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 759c4c60
system_scope: entity
---

# Hound Corpse

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `hound_corpse` prefab represents a dead hound that transitions into a `mutatedhound` after a randomized delay. It is a transient, non-persistent entity that monitors ignition state and stops revival upon ignition. It integrates closely with the `entitytracker` to retain a reference to its former leader (the `warg`), and uses `burnable`, `timer`, and `sanityaura` components to manage its lifecycle and environmental interactions.

## Usage example
```lua
-- Not intended for direct instantiation by mods.
-- Spawned automatically by the game when a hound dies during specific conditions (e.g., Warg's leadership).
local hound_corpse = SpawnPrefab("houndcorpse")
hound_corpse.Transform:SetPosition(inst.Transform:GetWorldPosition())
hound_corpse.RememberWargLeader(hound_corpse, warg)
```

## Dependencies & tags
**Components used:** `burnable`, `entitytracker`, `inspectable`, `sanityaura`, `timer`, `propagator` (removed post-revival), `inspectable` (removed post-revival)
**Tags:** Adds `blocker`, `deadcreature`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spawn_task` | function task or nil | `nil` | Holds the delayed task reference for spawning the mutated hound; set to `nil` after revival completes. |

## Main functions
### `SpawnMutatedHound(inst)`
* **Description:** Spawns a `mutatedhound` at the corpse's position, copies rotation, sets its state to `"mutated_spawn"` if not asleep, and assigns the tracked `warg` as leader. Also extinguishes the corpse immediately after spawning.
* **Parameters:** `inst` (Entity) — the corpse entity triggering revival.
* **Returns:** Nothing.
* **Error states:** No specific error handling — assumes valid entity references.

### `StartReviving(inst)`
* **Description:** Begins the revival sequence by playing animations, sounds, and scheduling a sequence of punch/body-fall sound events, culminating in spawning the mutated hound.
* **Parameters:** `inst` (Entity) — the corpse.
* **Returns:** Nothing.

### `RememberWargLeader(inst, warg)`
* **Description:** Registers the `warg` entity as the leader using `entitytracker` and informs the `warg` that this corpse exists for tracking purposes.
* **Parameters:** `inst` (Entity), `warg` (Entity) — the former leader entity.
* **Returns:** Nothing.

### `getstatus(inst)`
* **Description:** Returns a string status suitable for inspection UI: `"REVIVING"` if revival is in progress, `"BURNING"` if the corpse is burning and hasn't started revival, or `nil` otherwise.
* **Parameters:** `inst` (Entity) — the corpse.
* **Returns:** `"REVIVING"`, `"BURNING"`, or `nil`.

## Events & listeners
- **Listens to:** `timerdone` — triggers revival if timer name is `"revive"`.
- **Pushes:** None directly; relies on component events (e.g., `burnable` callbacks).
- **Callbacks registered:**
  - `onignite` — cancels the `"revive"` timer.
  - `onsave` — saves `spawn_task` status for persistence.
  - `onload` — resumes revival if revive task was pending.
  - `OnLoadPostPass` — re-establishes link to the tracked `warg` after world load.

## Additional Notes
- This prefab is not designed for mod spawning or modification without deep integration; it relies on internal game logic (`warg` tracking and `RememberFollowerCorpse` method) to function.
- Revival is randomized via `TUNING.MUTATEDHOUND_SPAWN_DELAY + math.random()`.
- Once revived, the corpse removes itself (`inst:Remove()`) after 5 seconds.
- The corpse is not persisted across save/load unless actively reviving (`persist = false` is set during revival).
- The `propagator` component is removed before revival to avoid propagation of corpse state post-revival.
- Sound events are hard-coded using frame deltas (e.g., `11*FRAMES`) to synchronize with animation timing.