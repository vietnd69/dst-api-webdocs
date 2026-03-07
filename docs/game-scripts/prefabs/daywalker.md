---
id: daywalker
title: Daywalker
description: Manages the boss entity Daywalker, including phase transitions, leech attachment, chain mechanics, and combat state changes during boss fights.
tags: [boss, combat, ai, entity, state]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 084c275d
system_scope: entity
---

# Daywalker

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`daywalker` defines the `Prefab` for the Daywalker boss entity in DST. It coordinates complex boss behaviors including phase transitions based on health thresholds, leech tracking/attachment mechanics, chain imprisonment states, fatigue management, and integration with components like `combat`, `health`, `grouptargeter`, and `lootdropper`. The prefab uses state machines (via `SetStateGraph`) and brain logic to orchestrate boss encounters, and supports networked state via net variables for client-side FX synchronization.

## Usage example
The `daywalker` prefab is instantiated automatically during world generation for boss arenas and should not be manually created by modders. However, modders may observe its API usage in custom prefabs or encounter scripts:
```lua
-- Example of inspecting Daywalker state (not recommended for direct manipulation)
if daywalker.inst.components.combat:HasTarget() then
    local engaged = daywalker.inst.engaged
    if daywalker.inst.IsFatigued(daywalker.inst) then
        -- Boss may be vulnerable or transitioning
    end
end
```

## Dependencies & tags
**Components used:** `combat`, `despawnfader`, `entitytracker`, `epicscare`, `grouptargeter`, `health`, `healthtrigger`, `inspectable`, `knownlocations`, `locomotor`, `lootdropper`, `sanityaura`, `talker`, `teleportedoverride`, `timer`, `updatelooper`, `drownable`, `explosiveresist`

**Tags:** `epic`, `noepicmusic`, `monster`, `hostile`, `scarytoprey`, `largecreature`, `shadow_aligned`, `pigtype`, `notarget` (when chained), `noteleport` (when chained), `NOCLICK` (chains/FX)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `chained` | boolean | `false` | Indicates if the boss is imprisoned (no movement, combat disabled). |
| `hostile` | boolean | `true` | Whether the boss can engage in combat and target players. |
| `engaged` | boolean or `nil` | `nil` | Whether the boss is currently in combat mode (e.g., roaring, attacking). |
| `defeated` | boolean | `false` | Whether the boss has been defeated and is despawning. |
| `looted` | boolean | `false` | Whether loot has been collected from the boss (affects despawn timer). |
| `fatigue` | number | `0` | Boss fatigue level; used for stamina management. |
| `canfatigue` | boolean | `false` | Whether fatigue mechanics are enabled for the current phase. |
| `canstalk` | boolean | `true` | Whether stalk mechanics are enabled. |
| `canslam` | boolean | `false` | Whether slam attack is enabled. |
| `canwakeuphit` | boolean | `false` | Whether wake-up hits are enabled. |
| `nostalkcd` | boolean | `true` | Whether the stalk cooldown timer is disabled. |
| `_enablechains` | net_bool | `false` | Network variable controlling FX chain visibility. |
| `_headtracking` | net_bool | `false` | Network variable controlling head/FX tracking. |
| `_stalking` | net_entity | `nil` | Network variable for the current stalking target (player). |
| `_facingmodel` | net_tinybyte | `0` | Network variable for head facing model (0, 4, or 6 faces). |

## Main functions
### `SetStalking(stalking)`
* **Description:** Sets or clears the boss's stalking target. Activates regen when stalking starts, and manages stalk cooldown timer. Resets stalk CD if `nostalkcd` is `true`.
* **Parameters:** `stalking` (`Entity` or `nil`) — the player entity to stalk, or `nil` to clear.
* **Returns:** Nothing.
* **Error states:** Ignores requests if `stalking` is non-`nil` and not a player with the `"player"` tag, or if the `hostile` state is `false`.

### `SetEngaged(engaged)`
* **Description:** Manages boss engagement state (e.g., roar, combat, regen). Stops regen when engaging, starts regen when disengaging (unless `engaged` is `nil`).
* **Parameters:** `engaged` (`boolean`, `true`, or `false`, or `nil`) — engagement state.
* **Returns:** Nothing.

### `DeltaFatigue(delta)`
* **Description:** Adjusts the boss's fatigue level by `delta`, and manages the fatigue regeneration timer task.
* **Parameters:** `delta` (number) — amount to change fatigue (e.g., `+5` for damage taken, `-0.1` for regen).
* **Returns:** Nothing.

### `ResetFatigue()`
* **Description:** Sets fatigue to zero and cancels the fatigue regen timer task.
* **Parameters:** None.
* **Returns:** Nothing.

### `IsFatigued()`
* **Description:** Checks if the boss is currently fatigued.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `fatigue >= TUNING.DAYWALKER_FATIGUE_TIRED`.

### `MakeChained()`
* **Description:** Transitions the boss into the imprisoned state (e.g., after pillars are destroyed). Disables combat, regen, and movement; enables chains and override physics; changes SG to `SGdaywalker_imprisoned`.
* **Parameters:** None.
* **Returns:** Nothing.

### `MakeUnchained()`
* **Description:** Exits the chained state, restores movement, and switches SG to `SGdaywalker`.
* **Parameters:** None.
* **Returns:** Nothing.

### `MakeHarassed()`
* **Description:** Moves the boss into a "struggle" state (non-combat, no brain), often triggered when leeches attach.
* **Parameters:** None.
* **Returns:** Nothing.

### `MakeHostile()`
* **Description:** Activates full combat mode: sets brain, enables combat and target tracking, starts stamina management, and configures sanity aura.
* **Parameters:** None.
* **Returns:** Nothing.

### `MakeDefeated()`
* **Description:** Moves the boss into defeated state: starts despawn timer, disables combat, and sets sanity aura to medium.
* **Parameters:** None.
* **Returns:** Nothing.

### `SpawnLeeches()`
* **Description:** Spawns three `shadow_leech` prefabs around the boss at random positions, each spawned at increasing distances.
* **Parameters:** None.
* **Returns:** Nothing.

### `AttachLeech(leech, noreact)`
* **Description:** Attempts to attach a leech to an unoccupied attach position (`"left"`, `"right"`, `"top"`). Marks position as busy for 2 seconds after detachment.
* **Parameters:** `leech` (`Entity`) — leech prefab instance; `noreact` (`boolean`, optional) — suppress event push.
* **Returns:** `boolean` — `true` if successfully attached; `false` if chained, defeated, or no attach slots available.

### `DetachLeech(attachpos, speedmult, randomdir)`
* **Description:** Detaches a leech from a specified attach position, or from a random available position. Handles busy-position lockout.
* **Parameters:** `attachpos` (`string`, `table`, or `nil`) — position(s) to detach from; `speedmult` (`number`, optional) — fling speed multiplier; `randomdir` (`boolean`, optional) — randomize fling direction.
* **Returns:** `boolean` — `true` if detachment occurred; `false` if no valid leech found or position busy.

### `CountPillars(inst)`
* **Description:** Counts resonating and idle daywalker pillars within `6.1` units of the boss.
* **Parameters:** `inst` (entity) — the boss instance (passed implicitly).
* **Returns:** Two numbers: `resonating`, `idle`.

### `OnPillarRemoved(inst, pillar)`
* **Description:** Cleans up the `"prison"` location from `knownlocations` when all pillars are destroyed (by checking for freed/prisoner references).
* **Parameters:** `inst` (entity) — the boss instance; `pillar` (`Entity`) — removed pillar.
* **Returns:** Nothing.

### `SetHeadTracking(track)`
* **Description:** Enables/disables head tracking FX and eye flame. Spawns or removes `head` entity with `updatelooper` post-update function (`UpdateHead`) for dynamic eye animation.
* **Parameters:** `track` (`boolean`) — whether to enable tracking.
* **Returns:** Nothing.

### `SwitchToFacingModel(numfacings)`
* **Description:** Changes the head facing model between 0, 4, or 6 faces for client-side animation sync via net variable `_facingmodel`.
* **Parameters:** `numfacings` (number) — `0`, `4`, or `6`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `incoming_jump` — registers jump cooldown for leech.  
  `attacked` — updates combat target unless targeting a player in range.  
  `newcombattarget` — sets engaged state, stalk target (if `canstalk`), and regen.  
  `minhealth` — calls `MakeDefeated` when health threshold reached.  
  `pillarremoved` — cleanup of prison location if all pillars destroyed.  
  `timerdone` (name `"despawn"`) — handles despawning (fade out or remove).  
  `onremove` (leeches, stalking target) — cleanup tracking.  
  `newstate` — manages stalking regen.

- **Pushes:**  
  `roar` — fired at start of engagement (if `"roar_cd"` timer does not exist).  
  `leechattached` — fired on successful leech attachment (unless `noreact`).  
  `stalkingdirty` — client FX sync signal.  
  `chainsdirty`, `headtrackingdirty`, `facingmodeldirty` — client FX sync signals.

Note: All `inst:PushEvent(...)` calls are in `TheWorld.ismastersim` context.