---
id: alterguardian_phase3
title: Alterguardian Phase3
description: Serves as the final phase boss entity for the Alterguardian, handling combat logic, health regeneration, trap spawning, music events, and loot drops during its terminal phase in the game.
tags: [combat, ai, boss, health, loot]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e2e0d7b9
system_scope: world
---

# Alterguardian Phase3

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`alterguardian_phase3` is the final-phase boss entity implementation. It encapsulates the complete behavior of the Alterguardian's third stage, integrating combat targeting and damage logic with specialized mechanics including health regeneration during sleep cycles, trap spawning, sanity aura, music triggers, and event-aware loot drops. The component is primarily responsible for state transitions, networked synchronization, and maintaining persistent state across world load/save cycles. It relies heavily on the `SGalterguardian_phase3` state graph and the `alterguardian_phase3brain` AI brain for low-level behavior orchestration.

## Usage example
```lua
local inst = CreateEntity()
-- Standard entity setup (anim, sound, transform, etc.)
inst:AddTag("boss")
inst:AddComponent("alterguardian_phase3")
-- Other setup handled internally by prefab constructor
```

## Dependencies & tags
**Components used:**  
`locomotor`, `health`, `combat`, `explosiveresist`, `sanityaura`, `lootdropper`, `inspectable`, `knownlocations`, `timer`, `teleportedoverride`, `hauntable`

**Tags added:**  
`brightmareboss`, `epic`, `flying`, `hostile`, `largecreature`, `mech`, `monster`, `noepicmusic`, `scarytoprey`, `soulless`, `lunar_aligned`

## Properties
No public properties exposed directly. Internal state is maintained via private fields (e.g., `_traps`, `_playingmusic`, `attackerUSERIDs`) and component APIs.

## Main functions
### `SetNoMusic(inst, val)`
* **Description:** Controls whether the Alterguardian Phase3 entity should play boss music. Adds/removes the `nomusic` tag and triggers music dirty check.
* **Parameters:** `val` (boolean) — `true` to disable music, `false` to enable.
* **Returns:** Nothing.

### `do_traps(inst, basetrapcount, minrange, maxrange)`
* **Description:** Spawns a radial pattern of trap projectiles around the boss. Adjusts trap count based on nearby living players.
* **Parameters:**  
  `basetrapcount` (optional number) — base number of traps to spawn (default `4`).  
  `minrange` (number) — minimum radial range offset.  
  `maxrange` (number) — maximum radial range offset.  
* **Returns:** Nothing. Fires `"endtraps"` event when all projectiles are queued.
* **Error states:** No traps spawned if `FindWalkableOffset` fails for all calculated angles.

### `track_trap(inst, trap)`
* **Description:** Registers a trap entity for tracking so it can be removed from internal `_traps` set when destroyed.
* **Parameters:** `trap` (EntityRef) — trap projectile instance to track.
* **Returns:** Nothing.

### `trackattackers(inst, data)`
* **Description:** Records the `userid` of players who have attacked the boss for post-mortem achievement tracking.
* **Parameters:** `data` (table) — event payload containing `attacker` entity.
* **Returns:** Nothing.

### `OnDead(inst, data)`
* **Description:** Runs after death. Notifies players in `attackerUSERIDs` of the `"celestialchampion_killed"` accomplishment and handles final state cleanup.
* **Parameters:** `data` (table) — death event payload.
* **Returns:** Nothing.

### `OnAttacked(inst, data)`
* **Description:** Reacts to attacks on the boss by suggesting the attacker as a combat target if valid.
* **Parameters:** `data` (table) — attack event payload containing `attacker` entity.
* **Returns:** Nothing.

### `SpawnTrapProjectile(inst, target_positions)`
* **Description:** Recursively spawns trap projectile prefabs at specified world positions. Fires `"endtraps"` event once queue is exhausted.
* **Parameters:**  
  `inst` (Entity) — boss instance.  
  `target_positions` (table) — stack of position objects.  
* **Returns:** Nothing.

### `teleport_override_fn(inst)`
* **Description:** Provides safe destination coordinates when the boss teleports. Uses walkable offset search to avoid holes.
* **Parameters:** `inst` (Entity) — boss instance.
* **Returns:** `Vector3` — destination position (or current position if offset search fails).

## Events & listeners
- **Listens to:**  
  - `"attacked"` → `OnAttacked`  
  - `"death"` → `OnDead`  
  - `"musicdirty"` (client-side only) → `OnMusicDirty`  
  - `"onremove"` (on tracked traps) → removes trap from `_traps` map  

- **Pushes:**  
  - `"healthdelta"` (via `health` component)  
  - `"endtraps"` (after trap projectile queue finishes)  
  - `"triggeredevent"` (music event to `ThePlayer` during play session)  

