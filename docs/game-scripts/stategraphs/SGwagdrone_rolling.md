---
id: SGwagdrone_rolling
title: Sgwagdrone Rolling
description: Manages the rolling state behavior of the wagdrone entity, including spinning attacks, recoil, work interactions, and state transitions.
tags: [stategraph, entity, combat, locomotion, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: a94fe276
system_scope: entity
---

# Sgwagdrone Rolling

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This stategraph governs the rolling phase of the wagdrone entity, enabling spinning animations, continuous area-of-effect interactions with entities (such as chopping, mining, or attacking), dynamic recoil based on collisions, work slowdown penalties, and transitions between idle, moving, and broken states. It integrates closely with the locomotor, health, workable, pickable, combat, and finiteuses components to manage the entity's behavior, regenerative state, and durability during high-speed rolling.

## Usage example
```lua
-- Example of triggering a rolling state with spinning AOE and handling recoil
inst:PushEvent("activate") -- activates the rolling state
inst.sg:GoToState("rolling") -- transitions into the rolling stategraph

-- Inside a stateaction, typical spinning logic looks like:
if not inst.sg:HasStateTag("broken") then
    DoSpinningAOE(inst, targets)
    if some_condition_for_recoil then
        local target_pos = target.Transform:GetWorldPosition()
        DoForcedSpinningRecoil(inst, target, 2.5)
    end
end
```

## Dependencies & tags
**Components used:** locomotor, health, floater, workable, pickable, combat, inventory, inventoryitem, finiteuses, freezable, Transform, DynamicShadow, AnimState, SoundEmitter, Physics, TheSim, stategraph, WigdroneCommon.

**Tags:**
- State tags: `idle`, `canrotate`, `moving`, `running`, `hit`, `busy`, `broken`, `noattack`, `nointerrupt`, `caninterrupt`, `off`, `stationary`, `canconnect`.
- Entity tags: `NOCLICK`, `hostile`, `waxedplant`, `event_trigger`, `waxable`, `frozen`, `grass`, `wood`, `wall`, `intense`, `hardarmor`, `inlimbo`, `flight`, `invisible`, `notarget`, `noattack`, `wagboss`.
- Dynamic workable action tags (constructed as `ACTION_workable`): `CHOP_workable`, `HAMMER_workable`, `MINE_workable`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `work_slowdown_t` | number | `nil` | Stores the duration (in seconds) of work slowdown applied to nearby workers when wagdrone is spinning. Set and cleared by `ResetWorkSlowdown`. |
| `registered_tags` | table | `{}` | Used internally to track registered tags on target entities during AOE interactions. Initialized on first `DoSpinningAOE` call. |

## Main functions
### `ResetWorkSlowdown(inst)`
* **Description:** Removes the "work_slowdown" external speed multiplier from the locomotor component and clears the `work_slowdown_t` memory variable. Typically called after spinning stops or after a work slowdown duration expires.
* **Parameters:** `inst` — the entity instance (wagdrone).
* **Returns:** None.

### `DoForcedSpinningRecoil(inst, target, radius)`
* **Description:** Applies a spinning recoil effect to the inst: calculates direction from target, computes a new position outside the target’s radius, teleports the inst, spawns a collision fx, resets work slowdown, and pushes a "spinning_recoil" event.
* **Parameters:**
  * `inst` — the entity instance.
  * `target` — an entity; its position (`Transform:GetWorldPosition()`) determines recoil direction.
  * `radius` — numeric radius buffer used to compute the safe position away from target.
* **Returns:** None.

### `DoSpinningAOE(inst, targets)`
* **Description:** Performs area-of-effect interactions while spinning: checks entities within radius for being workable, pickable, or combat targets; executes work/pick/attack actions with cooldown tracking; applies work slowdown or recoil based on interaction outcome; updates `finiteuses` on targets; and initializes registered tags on first call. Also sets `work_slowdown_t` when interacting with workables.
* **Parameters:**  
  * `inst` — the entity instance (wagdrone).
  * `targets` — a table mapping entity instances to earliest allowed interaction timestamps (used for cooldown tracking).
* **Returns:** None.

### `SetShadowScale(inst, scale)`
* **Description:** Sets the size of the dynamic shadow based on the given scale. Intended to adjust visual size during transitions or dynamic scaling.
* **Parameters:**  
  * `inst` — the entity instance.
  * `scale` — numeric multiplier for shadow size (via `DynamicShadow:SetSize`).
* **Returns:** None.

## Events & listeners
- **`locomote`**: Listened by stategraph. Handles transitions between idle and moving states based on forward movement input; adjusts tags like `idle`, `moving`, and `running`.
- **`attacked`**: Listened by stategraph. Transitions to `broken` state if health is minimal (`currenthealth <= minhealth`); otherwise handles hit interruptibility via state tags (`hit`, `nointerrupt`, `caninterrupt`).
- **`minhealth`**: Listened by stategraph. Triggers transition to `broken` if health drops to critical level.
- **`activate`**: Listened by stategraph. Turns on the wagdrone immediately, or queues activation if currently busy.
- **`deactivate`**: Listened by stategraph. Deactivates immediately or queues transformation based on mode (stationary/mobile) and current state (e.g., rolling vs idle).
- **`despawn`**: Listened by stategraph. Marks for despawn, cancels pending state transitions, and initiates turnoff or transformation before despawn.
- **`transform_to_stationary`**: Listened by stategraph. Queues or initiates transformation to stationary mode.
- **`transform_to_mobile`**: Listened by stategraph. Queues or initiates transformation to mobile mode.
- **`forced_spinning_recoil`**: Listened by stategraph. Triggers `DoForcedSpinningRecoil` only if currently in a running/active spinning state.