---
id: wagboss_robot
title: Wagboss Robot
description: Manages the state, combat, drone coordination, and environmental behavior of the Wagboss Robot boss entity.
tags: [combat, ai, boss, entity, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4ff6d024
system_scope: world
---

# Wagboss Robot

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wagboss_robot.lua` file defines the behavior and lifecycle of the Wagboss Robot, a large boss entity in DST's Wagpunk Arena. It orchestrates combat phases, drone control (`wagdrone_flying` and `wagdrone_rolling`), pathfinding modifications, and dynamic environmental effects (e.g., crown flames, stomp projections, lunar alignment). It integrates tightly with components like `combat`, `commander`, `grouptargeter`, `healthtrigger`, `dpstracker`, `locomotor`, and `focalpoint`, and handles transitions between off, friendly, and hostile modes.

## Usage example
```lua
local inst = Prefab("wagboss_robot")
-- After instantiation, transition to hostile mode to enable combat
inst:PushEvent("activate")
inst.ConfigureHostile()
-- Later, to re-enable drone deployment and pathfinding:
inst.HackDrones(inst)
```

## Dependencies & tags
**Components used:**  
`colouraddersync`, `updatelooper`, `combat`, `commander`, `grouptargeter`, `health`, `healthtrigger`, `dpstracker`, `planardamage`, `locomotor`, `lootdropper`, `teleportedoverride`, `timer`, `inspectable`, `epicscare`, `trader`, `planarentity`, `explosiveresist`, `focalpoint`

**Tags added:**  
`mech`, `electricdamageimmune`, `soulless`, `wagboss`, `epic`, `noepicmusic`, `blocker`, `lunar_aligned`, `brightmareboss`, `largecreature`, `scarytoprey`, `hostile` (conditional), `notarget` (conditional)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `active` | boolean | `false` | Indicates whether the robot is active (friendly or hostile). |
| `hostile` | boolean | `false` | Indicates whether the robot is in hostile mode. |
| `socketed` | boolean | `false` | Whether the robot has been assembled with a cage. |
| `shattered` | boolean | `false` | Whether the robot's containment glass has been broken. |
| `engaged` | boolean | `false` | Whether the robot is currently engaged in combat. |
| `threatlevel` | number | `1` | Current threat level affecting attack speed (1–N). |
| `flyer_t`, `flyer_theta`, `flyer_atk_delay` | number, number, number | `0`, random, `4 + math.random()*2` | Internal state for flying drone positioning and attack timing. |
| `roller_t`, `roller_theta`, `roller_xform_delay`, `roller_stationary` | number, number, number, boolean | `0`, random, `19 + math.random()*5`, `false` | Internal state for rolling drone positioning and transformation timing. |
| `_temptbl1`, `_temptbl2` | table | `{}` | Temporary tables used for target and drone collection to avoid GC pressure. |
| `_nocollide` | table | `{}` | Tracks reasons for temporary no-collide state. |
| `_pfpos` | Vector3 or nil | `nil` | Cached position for pathfinding walls. |

## Main functions
### `ConfigureOff(inst)`
*   **Description:** Disables all combat, movement, and AI systems; resets visual state (e.g., wires, glass).
*   **Parameters:** `inst` (Entity) — the robot instance.
*   **Returns:** Nothing.

### `ConfigureFriendly(inst)`
*   **Description:** Activates the robot in friendly (caged) mode: enables locomotion, disables combat, plays idle animation, and overrides glass/crown visuals.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `ConfigureHostile(inst)`
*   **Description:** Activates the robot in hostile mode: enables locomotion, combat, brain, and shatters containment.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `HackDrones(inst)`
*   **Description:** Scans nearby for `wagdrone_flying` and `wagdrone_rolling` entities (within 40 units), adds them as soldiers via `commander`, sets their health if they have `finiteuses`, and triggers their activation.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `ReleaseDrones(inst, include_non_soldiers)`
*   **Description:** Removes all soldiers (and optionally non-soldiers) and converts them to loot using `WagdroneCommon.ChangeToLoot`.
*   **Parameters:**  
  - `inst` (Entity)  
  - `include_non_soldiers` (boolean) — whether to also convert drones not yet added as soldiers.
*   **Returns:** Nothing.

### `SkipBarragePhase(inst)`
*   **Description:** If the robot is in a barrage phase (`canmissilebarrage`), skips to the next non-barrage phase by directly invoking its `fn`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `SetMusicLevel(inst, level)`
*   **Description:** Sets the music level (0–3) via `music` netbool; starts/stops music periodic task on client.
*   **Parameters:**  
  - `inst` (Entity)  
  - `level` (number) — desired music level.
*   **Returns:** Nothing.

### `EnableCameraFocus(inst, enable)`
*   **Description:** Starts or stops camera focus on the boss using `focalpoint` (client only).
*   **Parameters:**  
  - `inst` (Entity)  
  - `enable` (boolean).
*   **Returns:** Nothing.

### `MakeObstacle(inst, isobstacle)`
*   **Description:** Toggles pathfinding obstacle status (adds/removes walls around the robot) and adjusts collision physics.
*   **Parameters:**  
  - `inst` (Entity)  
  - `isobstacle` (boolean).
*   **Returns:** Nothing.

### `StartStompFx(inst)`
*   **Description:** Enables client-side stomp projection visual (`showstompfx`); creates and animates stomp FX.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `StopStompFx(inst, interrupted)`
*   **Description:** Stops stomp FX and disables `showstompfx`. If `interrupted`, sets netbool to `false`; otherwise sets locally.
*   **Parameters:**  
  - `inst` (Entity)  
  - `interrupted` (boolean).
*   **Returns:** Nothing.

### `StartBackFx(inst)`
*   **Description:** Enables lunar spawn back FX (`showbackfx`) on client.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `StopBackFx(inst)`
*   **Description:** Stops and removes lunar spawn back FX.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `SocketCage(inst)`
*   **Description:** Assembles the robot with its cage, overriding glass symbol and showing crown if needed.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `BreakGlass(inst)`
*   **Description:** Marks the robot's glass as shattered, reveals wires, and ensures crown is enabled.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `attacked` — calls `OnAttacked` to potentially switch targets.  
  - `newcombattarget` — calls `OnNewTarget` to mark robot as engaged.  
  - `droppedtarget` — calls `OnDroppedTarget` to de-engage after delay.  
  - `soldierschanged` — calls `OnSoldiersChanged` to start/stop drone updates.  
  - `doreset` — calls `DoReset` to handle off-screen reset logic.  
  - `activate` — calls `CancelReset`.  
  - `isobstacledirty`, `showstompfxdirty`, `showbackfxdirty`, `showcrowndirty`, `musicdirty`, `camerafocusdirty` — client-side effects and visual sync.

- **Pushes:**  
  - `reveal` (via `PushEventImmediate`) — fired when cage is first placed.  
  - `transform_to_stationary` / `transform_to_mobile` (via `PushEvent`) — sent to rolling drones.  
  - `doattack` (via `PushEvent`) — sent to flying drones to initiate attack.  
  - `deactivate`, `gotcommander`, `lostcommander`, `soldierschanged`, `triggeredevent` (music).