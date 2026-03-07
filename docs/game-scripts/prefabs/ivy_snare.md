---
id: ivy_snare
title: Ivy Snare
description: A trap-like prefab that spawns, targets a nearby enemy, and deals periodic damage before deactivating after death.
tags: [combat, trap, environmental, enemy]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ed294145
system_scope: environment
---

# Ivy Snare

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`ivy_snare` is a passive environmental trap prefab that waits hidden underground, then emerges to target and damage the nearest valid enemy within range. It uses the `combat` and `health` components for damage delivery and durability, and operates via timed state transitions and target validation logic. Once killed, it transforms into a harmless, non-interactive obstacle (non-solid and non-clickable) before being removed from the world after a short delay.

## Usage example
```lua
local snare = SpawnPrefab("ivy_snare")
if snare ~= nil then
    snare.Transform:SetPosition(x, y, z)
    -- Trigger or wait for the snare to activate naturally
    -- Optional: manually restart it if needed
    snare.RestartSnare(snare, 0) -- immediate reactivation
end
```

## Dependencies & tags
**Components used:** `combat`, `health`, `inspectable`, `physics`, `animstate`, `soundemitter`, `transform`, `network`  
**Tags added:** `groundspike`, `hostile`, `soulless`  
**Tags removed on death/activation:** `groundspike`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target` | `Entity` or `nil` | `nil` | Current enemy being targeted. |
| `target_max_dist` | number | `15` (inferred) | Maximum distance for target validation. |
| `validate_task` | `Task` or `nil` | `nil` | Periodic task checking target validity. |
| `task` | `Task` or `nil` | `nil` | Delayed task managing animation/state transitions. |

## Main functions
### `DoKillOff(inst)`
* **Description:** Immediately kills the snare if it is still alive. Used internally to ensure clean termination after death animation.
* **Parameters:** `inst` (`Entity`) — the snare instance.
* **Returns:** Nothing.
* **Error states:** Does nothing if `health` component is `nil` or already dead.

### `KillOff(inst)`
* **Description:** Prepares the snare for safe removal: cancels target validation task, removes the `groundspike` tag, and schedules `DoKillOff` after a short random delay.
* **Parameters:** `inst` (`Entity`) — the snare instance.
* **Returns:** Nothing.

### `OnDeath(inst)`
* **Description:** Handles post-mortem state: plays the death animation (`spike_pst`), removes `groundspike` tag, disables physics, hides the snare, cancels validation task, and schedules full removal after 1.5 seconds.
* **Parameters:** `inst` (`Entity`) — the snare instance.
* **Returns:** Nothing.

### `ValidateTarget(inst)`
* **Description:** Verifies whether the current target remains valid (exists, alive, within range, etc.). If invalid, calls `KillOff`.
* **Parameters:** `inst` (`Entity`) — the snare instance.
* **Returns:** Nothing.
* **Error states:** Cancels its own `validate_task` if the `groundspike` tag is lost.

### `StartSpike(inst, duration)`
* **Description:** Activates the snare: plays preparation animation, starts looping animation, shows the entity, and plays the activation sound. *Note:* Damage logic is commented out (`--DoDamage(inst)`) and not currently functional.
* **Parameters:**  
  - `inst` (`Entity`) — the snare instance.  
  - `duration` (`number`, optional) — *unused in current implementation*.
* **Returns:** Nothing.

### `RestartSnare(inst, delay)`
* **Description:** Resets the snare’s animation state and schedules reactivation. Cancels any pending task, hides the snare, and starts a new delayed task that calls `StartSpike`.
* **Parameters:**  
  - `inst` (`Entity`) — the snare instance.  
  - `delay` (`number`, optional) — delay before reactivation (default: `0`).  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `death` — triggers `OnDeath` when the snare dies.
- **Pushes:** None identified.