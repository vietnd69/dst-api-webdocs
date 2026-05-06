---
id: SGwx78_scanner
title: SGwx78 Scanner
description: Animation state machine for the WX-78 scanner entity, governing deployment, scanning, success, and shutdown sequences with shadow scale effects.
tags: [stategraph, wx78, scanner, animation]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: stategraphs
source_hash: 6b7d3476
system_scope: entity
---

# SGwx78 Scanner

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`SGwx78_scanner` is an animation state machine attached to the `wx78_scanner` prefab. It governs idle, deployment (turn_on), scanning success, and shutdown (turn_off) animations with dynamic shadow scaling effects. Stategraphs are accessed via `StartStateGraph()` on the entity, not called as utility functions. Major state categories: lifecycle (turn_on, turn_off), scanning (idle, scan_success), and locomotion (walk states from CommonStates).

## Usage example
```lua
-- Stategraphs are attached to a prefab during construction:
inst:SetStateGraph("wx78_scanner")

-- Trigger a state from external code:
inst.sg:GoToState("turn_on")

-- Query state-tag membership:
if inst.sg:HasStateTag("scanned") then
    return
end

-- Listen for stategraph events from a component:
inst:ListenForEvent("turn_on_finished", function(inst)
    -- Follow-up logic after deployment completes
end)
```

## Dependencies & tags
**External dependencies:**
- `stategraphs/commonstates` -- shared locomotion state factories (AddWalkStates)
- `CommonHandlers` -- provides OnLocomote handler for locomote event

**Components used:**
- `locomotor` -- Stop(), Clear() called in state onenter to halt movement
- `entitytracker` -- GetEntity("scantarget") to check target presence
- `floater` -- splash property modified on spawned replacement items
- `inventoryitem` -- SetLanded() called on spawned scanner_item

**Tags:**
- `idle` -- added in idle state
- `busy` -- added in turn_on, turn_off, turn_off_idle, scan_success states
- `scanned` -- added in turn_off, turn_off_idle, scan_success states

## Properties
### State reference table
| State name | Tags | Description |
|------------|------|-------------|
| `idle` | `idle` | Default resting state; plays scan_loop or idle animation based on target range. |
| `turn_on` | `busy` | Deployment animation; scales shadow from 0 to 1 over frames 5-10. |
| `turn_off` | `busy, scanned` | Shutdown sequence; may spawn replacement item or success prefab on animover. |
| `turn_off_idle` | `busy, scanned` | Idle state after turning off; loops turn_off_idle animation. |
| `scan_success` | `busy, scanned` | Success animation; spawns data at frame 21, transitions to turn_off. |
| `startwalk` | (CommonStates) | Walk start animation; returns scan_loop if target in range. |
| `walk` | (CommonStates) | Walking loop; returns scan_loop if target in range. |
| `stopwalk` | (CommonStates) | Walk stop animation; returns scan_loop if target in range. |

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `states` | table (local) | --- | State reference table above lists all defined states. |
| `events` | table (local) | --- | Stategraph-level event handlers for deployed, turn_off, scan_success, locomote. |

## Main functions
### `return_to_idle(inst)` (local)
* **Description:** Helper function that transitions the entity back to the idle state. Called by animover event handler in idle state.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None.

### `targetinrange(inst)` (local)
* **Description:** Checks if the scan target entity is within scanning distance. Returns true if scantarget exists and distance squared is less than scan distance squared.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** `true` if target in range, `nil` otherwise
* **Error states:** Errors if `inst.components.entitytracker` is nil (no guard before GetEntity call). Errors if `inst:GetScannerScanDistance()` is not defined on the entity.

### `SetShadowScale(inst, scale)` (local)
* **Description:** Adjusts the entity's dynamic shadow size proportionally to the scale parameter. Shadow width is 1.2 * scale, height is 0.75 * scale.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `scale` -- number shadow scale factor (0 to 1)
* **Returns:** nil
* **Error states:** Errors if `inst.DynamicShadow` is nil (no guard before SetSize call).

### `onenter (idle)`
* **Description:** Stops locomotion and clears destination. Plays scan_loop animation if target is in range, otherwise plays idle animation (looping).
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.components.locomotor` is nil (no guard before Stop/Clear calls).

### `onenter (turn_on)`
* **Description:** Stops locomotion, plays turn_on animation (non-looping), and sets shadow scale to 0. Pushes on_landed event if not populating. Timeline: frames 5-10 scale shadow from 0.1 to 1.0; frame 9 pushes on_no_longer_landed. On animover (via EventHandler), pushes turn_on_finished event and transitions to idle state.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.components.locomotor` is nil (no guard before Stop call).

### `onenter (turn_off)`
* **Description:** Processes data parameters (changetoitem, changetosuccess, hit) and stores in statemem. Calls inst:DoTurnOff() if defined. Stops locomotion, plays hit_turn_off_pre or turn_off_pre animation based on washit flag. Plays deactivate sound and stops scan FX. Timeline: frames 6-10 scale shadow down from 0.9 to 0; frame 14 pushes on_landed. On animover (via EventHandler), spawns replacement prefab (wx78_scanner_item or wx78_scanner_succeeded) with proper landing setup, or transitions to turn_off_idle.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `data` -- optional table with changetoitem, changetosuccess, hit flags
* **Returns:** nil
* **Error states:** Errors if `inst.components.locomotor` is nil (no guard before Stop call).

### `onexit (turn_off)`
* **Description:** If not transitioning to idle, starts looping sound and pushes on_no_longer_landed event.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None.

### `onenter (turn_off_idle)`
* **Description:** Stops locomotion, plays turn_off_idle animation (looping), and stops looping sound.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.components.locomotor` is nil (no guard before Stop call).

### `onexit (turn_off_idle)`
* **Description:** Clears flashon statemem flag, starts looping sound, and pushes on_no_longer_landed event.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None.

### `onenter (scan_success)`
* **Description:** Stops locomotion and plays success animation (non-looping). Timeline: frame 7 plays print sound; frame 21 calls inst:SpawnData() to generate scan results. On animover (via EventHandler), transitions to turn_off with changetosuccess flag.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.components.locomotor` is nil (no guard before Stop call). Errors if `inst:SpawnData()` is not defined on the entity (no guard before call).



## Events & listeners
- **Listens to:** `deployed` -- transitions to turn_on state
- **Listens to:** `turn_off` -- transitions to turn_off state with data parameter
- **Listens to:** `scan_success` -- transitions to scan_success state
- **Listens to:** `locomote` -- (from CommonHandlers) transitions to walk or idle based on movement state
