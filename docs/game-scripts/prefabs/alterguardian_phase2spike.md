---
id: alterguardian_phase2spike
title: Alterguardian Phase2Spike
description: Spawns and manages ground spikes used by the Alterguardian boss in Phase 2, including trail spikes and static moonglass spikes that can be destroyed by players.
tags: [combat, boss, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9b59fa94
system_scope: environment
---

# Alterguardian Phase2Spike

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `alterguardian_phase2spike` prefab implements two types of entities used by the Alterguardian Phase 2 boss: (1) moving *spike trails* that propagate across terrain and spawn static spikes upon stopping or reaching impassable terrain, and (2) static *moonglass spikes* that serve as destructible environmental hazards. The component uses the `combat` and `workable` systems to handle attacks against targets and player mining interactions, respectively. It is not a standalone component but defines two related Prefab constructors (`spiketrailfn` and `spikefn`) for distinct gameplay objects.

## Usage example
```lua
-- Spawning a spike trail (moves and spawns static spikes)
local trail = SpawnPrefab("alterguardian_phase2spiketrail")
trail.Transform:SetPosition(some_pos)
trail.components.combat:SetDefaultDamage(TUNING.ALTERGUARDIAN_PHASE2_SPIKEDAMAGE)

-- Spawning a static spike (destroyable by players)
local spike = SpawnPrefab("alterguardian_phase2spike")
spike.Transform:SetPosition(some_pos)
spike.components.workable:SetWorkLeft(1)
```

## Dependencies & tags
**Components used:** `combat`, `workable`, `inspectable`, `physics`  
**Tags:** `groundspike`, `moonglass`, `NOCLICK`, `notarget`, `FX` (for trail effect), `DECOR`, `flying`, `ghost`, etc. (used as exclusion filters during attack)

## Properties
No public properties are exposed by this prefab’s constructors. Internal state is stored on `inst` (e.g., `_aguard`, `_rotation`, `_stop_trail`, `_emerge_task`, `_watertest_task`, `_break_task`, `_trail_task`) but not intended for external consumption.

## Main functions
This section documents public functions attached directly to the instance (`inst`) and core logical functions invoked during the lifecycle of spikes.

### `SetOwner(inst, aguard)`
* **Description:** Assigns the parent Alterguardian entity as the spike’s owner, used to identify the true attacker during combat.
* **Parameters:** `aguard` (entity) — The Alterguardian Phase 2 instance.
* **Returns:** Nothing.

### `emerge(inst)`
* **Description:** Initiates the spike’s “emergence” behavior: stops physics, kills earthquake sound, spawns the initial spike, then schedules additional wall-spaced spikes over time in alternating lateral offsets before removing itself.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No explicit error handling; relies on `TheWorld.Map:IsPassableAtPoint` to skip impassable locations.

### `check_over_water(inst)`
* **Description:** Periodically checks if the spike would move into impassable terrain (e.g., water) on the next update; if so, triggers `emerge` immediately and cancels the water check task.
* **Parameters:** None.
* **Returns:** Nothing.

### `spike_break(inst)`
* **Description:** Transitions a static spike into its broken state: disables physics, marks it non-workable, plays a break animation and sound, and schedules removal on animation end.
* **Parameters:** None.
* **Returns:** Nothing.

### `on_spike_mining_finished(inst, worker)`
* **Description:** Callback invoked when the spike is fully mined. Cancels any pending timed self-destruction task and triggers `spike_break`.
* **Parameters:** `worker` (entity) — The entity that mined the spike (unused in implementation).
* **Returns:** Nothing.

### `DoAttack(inst, pos)`
* **Description:** Performs area-of-effect attacks in a circular radius around `pos` against nearby valid targets (including smashables, workables, and living entities). Uses a temporary damage increase from tuning, attacks as the owning Alterguardian if alive, and spawns break FX only when hitting a target.
* **Parameters:** `pos` (Vector3, optional) — Center of the attack radius; defaults to `inst:GetPosition()`.
* **Returns:** `true` if at least one target was hit; otherwise `false`.

## Events & listeners
- **Listens to:**  
  - `animover` — Removes the entity once an animation finishes (used in spike_break and trail FX).  
  - `alterguardian_phase2spike._stop_trail` (client-only) — Cancels the periodic trail FX task.  
- **Pushes:**  
  - `alterguardian_phase2spike._stop_trail` — Network event (via `net_event`) used on the client to halt FX when the trail stops.  
  - `shakeallcameras` — Implicit via `ShakeAllCameras` (not a standard event but triggers camera shake on server).  
  - `net_event` — Used internally for `alterguardian_phase2spike._stop_trail` to synchronize trail stop on clients.
