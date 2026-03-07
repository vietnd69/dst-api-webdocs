---
id: cave_hole
title: Cave Hole
description: Manages a damage-dealing cave entrance that periodically strikes nearby players and respawns loot over time.
tags: [combat, environment, trigger, loot]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a612d572
system_scope: environment
---

# Cave Hole

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`cave_hole` is a dynamic environmental prefab that acts as a hazard zone in the Ruins and Cave layers. It periodically detects nearby players and launches surprise attacks (flicks), dealing knockback and (via a redirected event) triggering visual/audio feedback without true damage. It also auto-replenishes a weighted random pool of loot items when empty. The component uses `playerprox` to monitor player proximity, `objectspawner` to manage loot, and integrates with `health` and `stackable` for conditional behavior.

## Usage example
```lua
-- This prefab is auto-instanced by the worldgen system and not typically created directly by mods.
-- Example of custom interaction:
local inst = SpawnPrefab("cave_hole")
inst.Transform:SetPosition(x, y, z)
inst.allowspawn = true -- Ensure looting can resume if previously triggered
inst:DoTaskInTime(0.1, function() inst.components.objectspawner:SpawnObject("greengem") end)
```

## Dependencies & tags
**Components used:**  
- `objectspawner` (spawns loot, tracks objects inside the hole, fires `onnewobjectfn`)  
- `playerprox` (monitors player proximity, triggers flick events)  
- `health` (`IsDead` used to prevent attacks on dead players)  
- `stackable` (`SetStackSize` used to assign randomized stack sizes to certain loot)

**Tags:**  
- Added: `groundhole`, `blocker`, `blinkfocus`, `outofreach` (on loot)  
- Checked: `playerghost`, `wereplayer`, `debuffed`, `buffed` (indirect via other components)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `allowspawn` | boolean | `true` | Controls whether new loot may be spawned into the hole. Set to `false` after a spawn to prevent overfilling. |
| `_groundhole_innerradius` | number | `1.5` | Inner radius (meters) of the hole's functional zone. |
| `_groundhole_outerradius` | number | `2.75` | Outer radius (meters) for detecting players; also used for knockback radius. |
| `_groundhole_rangeoverride` | number | `0` | Placeholder for radius overrides; unused in current implementation. |

## Main functions
### `SetObjectInHole(inst, obj)`
*   **Description:** Called by `objectspawner` when a new loot object is spawned into the hole. Disables physics and tags the object as `outofreach` until picked up.
*   **Parameters:**  
  - `inst` (Entity): The cave_hole instance.  
  - `obj` (Entity): The spawned loot object.  
*   **Returns:** Nothing.  
*   **Side effects:** Sets `obj.Physics:SetActive(false)`, adds `outofreach` tag, and registers `onremove` and `onpickup` event callbacks.

### `tryspawn(inst)`
*   **Description:** Attempts to spawn a random loot item if `allowspawn` is true and no loot currently resides in the hole. Applies randomized stack sizes where defined.
*   **Parameters:**  
  - `inst` (Entity): The cave_hole instance.  
*   **Returns:** Nothing.  
*   **Error states:** No effect if `allowspawn` is false or loot exists. May spawn a `small_puff` FX if the hole is awake (not asleep).

### `DoFlickOn(player, inst)`
*   **Description:** Executes the main flick attack: spawns the `cavehole_flick` FX, fires a zero-damage `attacked` event (to trigger screen flash avoidance), and applies knockback.
*   **Parameters:**  
  - `player` (Entity): The target player.  
  - `inst` (Entity): The cave_hole instance.  
*   **Returns:** Nothing.  
*   **Error states:** Returns early if player is dead/ghosted, or is a `wereplayer`.

### `DoFlickWarnOn(player, inst)`
*   **Description:** Called after `FLICK_WARN_TIME` (2 seconds). Spawns warning FX and schedules the final `DoFlickOn` attack after `FLICK_TIME` (2 more seconds).
*   **Parameters:**  
  - `player` (Entity): The target player.  
  - `inst` (Entity): The cave_hole instance.  
*   **Returns:** Nothing.  
*   **Error states:** Cancels the warning task and exits early if the player becomes invalid or is a `wereplayer`.

### `CheckFlick(player, inst)`
*   **Description:** Starts the warning-timer chain for a player. Must be called periodically while a player is near.
*   **Parameters:**  
  - `player` (Entity): The target player.  
  - `inst` (Entity): The cave_hole instance.  
*   **Returns:** Nothing.  
*   **Error states:** Skips warning if player is dead/ghosted or a `wereplayer`.

### `OnPlayerNear(inst, player)` and `OnPlayerFar(inst, player)`
*   **Description:** Callbacks registered with `playerprox`. `OnPlayerNear` initiates a periodic check (`CheckFlick`) every 1 second. `OnPlayerFar` decrements the count and cancels the task when all players have left.
*   **Parameters:**  
  - `inst` (Entity): The cave_hole instance.  
  - `player` (Entity): The player entering or leaving proximity.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onremove` (on loot objects) — internal handler via `_onremoveobj`.  
  - `onpickup` (on loot objects) — internal handler via `_onpickupobj`.  
  - `resetruins` (on `TheWorld`) — resets `allowspawn` and schedules a quick `tryspawn`.  
- **Pushes:**  
  - `attacked` (on player) — redirected attack with `damage = 0` and `redirected = player`.  
  - `knockback` (on player) — triggers knockback physics.  
  - `stacksizechange` (on loot via `stackable` component).