---
id: shadow_trap
title: Shadow Trap
description: A trap prefab that detects nearby panic-capable targets, triggers a shockwave effect, and applies a movement speed penalty and panic state.
tags: [trap, combat, ai, environment, debuff]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a77565e2
system_scope: environment
---

# Shadow Trap

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `shadow_trap` prefab is an environmental trap entity that remains dormant until detecting a valid target within range. When triggered, it releases a shockwave effect, dispatches a visual "shadow_despawn" effect to the target, and applies a panic state and speed penalty to panic-capable entities. It is typically used in encounters with the Shadow or related boss mechanics (e.g., Abigail’s minions, nightmare states). The component relies heavily on the `timer`, `health`, and `locomotor` components to manage state, target selection, and debuff application.

## Usage example
```lua
-- Spawn a shadow trap at position (x, y, z)
local trap = SpawnPrefab("shadow_trap")
trap.Transform:SetPosition(x, y, z)

-- Manually trigger the trap if needed
trap.components.timer:StartTimer("lifetime", TUNING.SHADOW_TRAP_LIFETIME)
trap.TriggerTrap()
```

## Dependencies & tags
**Components used:** `timer`, `health`, `locomotor`, `hauntable` (via target component check)  
**Tags added:** `ignorewalkableplatforms`, `ignorewalkableplatformdrowning`, `NOBLOCK` (added on activation/dispel)  
**Tags checked:** `locomotor`, `epic`, `notraptrigger`, `ghost`, `player`, `INLIMBO`, `flight`, `invisible`, `notarget`, `noattack`, `bird`, `butterfly`, `monster`, `character`, `animal`, `smallcreature`, `largecreature`, `CLASSIFIED` (on FX entity)  
**Tags removed:** None (only `NOBLOCK` added dynamically)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `persists` | boolean | `true` | Controls whether the trap can trigger; set to `false` once triggered or dispelled. |
| `task` | task handle | `nil` | Reference to the active detection periodic task. |
| `groundfxtask` | task handle | `nil` | Reference to the ground FX periodic task (generates glob particles). |
| `targetfx` | entity | `nil` | Reference to the reticule FX entity when activated. |
| `base` | entity | `nil` | Reference to the visual pillar FX (spawned only on master). |
| `killed` | boolean | `nil` | Set to `true` when FX is being killed; prevents double-kills. |
| `size` | string (`"small"`/`"large"`) | `nil` | Size variant for debuff FX animation (set on `OnSetTarget`). |

## Main functions
### `EnableGroundFX(inst, enable)`
*   **Description:** Activates or cancels the periodic ground FX that spawns `shadow_glob_fx` particles around the trap.  
*   **Parameters:**  
    - `enable` (boolean) – `true` to start FX, `false` to stop it.  
*   **Returns:** Nothing.  
*   **Error states:** No-op if FX is already enabled/disabled.

### `EnableTargetFX(inst, enable)`
*   **Description:** Spawns or removes the reticule target FX (`reticuleaoeshadowtarget_6`) parented to the trap.  
*   **Parameters:**  
    - `enable` (boolean) – `true` to spawn, `false` to remove.  
*   **Returns:** Nothing.

### `TriggerTrap(inst)`
*   **Description:** Immediately activates the trap (if not already activated), spawns the ground detection task, and schedules cleanup.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  
*   **Error states:** Early return if `persists` is `false` or trap is not in `"canactivate"` state (though logic forces state transition if not `"activated"`).  

### `DispellTrap(inst, collidewithboat)`
*   **Description:** Immediately dispels the trap (cancels timers, sets `persists=false`, adds `NOBLOCK` tag). If asleep, removes the trap outright.  
*   **Parameters:**  
    - `collidewithboat` (boolean) – Passed to state machine for visual/logic context (unused in code).  
*   **Returns:** Nothing.

### `Detect(inst, map)`
*   **Description:** Performs radius-based target detection. If a valid target is found, triggers the trap. Also handles idle states and platform collisions (dispels if walking over a platform while `ignorewalkableplatforms`).  
*   **Parameters:**  
    - `map` (`Map`) – World map instance for passability/platform checks.  
*   **Returns:** Nothing.

### `OnSetTarget(inst, target)`
*   **Description:** Sets up the `shadow_trap_debuff_fx` visual for a specific target (e.g., shows `debuff_pre_*`/`debuff_loop_*` animation matching creature size). Listens for target death/removal to clean up.  
*   **Parameters:**  
    - `target` (entity) – The entity receiving the debuff.  
*   **Returns:** Nothing.

### `KillFX(inst)`
*   **Description:** Plays the termination animation (`debuff_pst_*`) and schedules removal. Used when the debuff target dies or is removed.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `OnShockwave(inst)`
*   **Description:** Spawns a local-only `mushroombomb_base` visual to represent the shockwave effect.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `timerdone` – Triggers `DispellTrap` when the `"lifetime"` timer completes.  
  - `onsink` – Triggers `DispellTrap` when the trap is destroyed (e.g., lava/sink).  
  - `shadow_trap.shockwave` (local only) – Spawns shockwave FX.  
  - `death` / `onremove` – On `shadow_trap_debuff_fx` to cleanup FX if target dies/leaves.  
- **Pushes:**  
  - `ms_forcenightmarestate` (on target) – Forces nightmare state on nightmare-capable targets.  
  - `attacked` (on target) – Dummy attack event (damage `0`) to ensure triggers are processed.  
  - `shadow_trap.shockwave` (networked) – Broadcasts shockwave FX to clients.