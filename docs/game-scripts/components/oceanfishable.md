---
id: oceanfishable
title: Oceanfishable
description: Manages the fishable state and behavior of ocean creatures when interacting with fishing rods, including stamina-based struggle mechanics and movement speed adjustments based on line tension.
tags: [ocean, fishing, behavior, stamina, movement]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c84eeb5c
system_scope: entity
---

# Oceanfishable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Oceanfishable` is a component attached to ocean-dwelling creatures (e.g., fish, jellyfish) that enables them to be caught via ocean fishing rods. It handles core mechanics such as line tension–dependent movement speed, stamina-based struggling states, and integration with the `oceanfishingrod` component. It supports event hooks for custom behavior on rod attachment, being eaten, and reeling in.

## Usage example
```lua
local inst = CreateEntity()
-- Attach the component to an ocean creature prefab
inst:AddComponent("oceanfishable")

-- Optional: Configure struggle mechanics
inst.components.oceanfishable:StrugglingSetup(
    TUNING.WILSON_WALK_SPEED * 1.5,
    TUNING.WILSON_RUN_SPEED * 1.5,
    { drain_rate = 0.5, recover_rate = 0.2, struggle_times = { low = 1.0, high = 2.0 }, tired_times = { low = 0.5, high = 1.0 } }
)

-- Optional: Assign hooks for events
inst.components.oceanfishable.onsetrodfn = function(inst, rod) print("Rod attached:", rod) end
inst.components.oceanfishable.oneatenfn = function(inst, eater) print("Eaten by:", eater) end
```

## Dependencies & tags
**Components used:** `locomotor`, `inventoryitem` (via `GetGrandOwner`), `oceanfishingrod`
**Tags:** Checks/updates `oceanfishing_catchable`; listens for `onremove` on attached rod.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `rod` | `Entity` or `nil` | `nil` | Reference to the fishing rod that has hooked this entity. |
| `catch_distance` | number | `4` | Max distance from the rod's owner to trigger the `oceanfishing_catchable` tag. |
| `stamina` | number or `nil` | `nil` | Current stamina level (`0` to `1`); `nil` if struggling mechanics are not initialized. |
| `max_walk_speed` | number or `nil` | `nil` | Base walk speed before tension-based scaling. |
| `max_run_speed` | number or `nil` | `nil` | Base run speed before tension-based scaling. |
| `is_struggling_state` | boolean | `false` | Current active struggle state. |
| `pending_is_struggling_state` | boolean | `false` | Pending struggle state to be applied after timer expires. |
| `struggling_state_timer` | number | `0` | Time remaining (in seconds) before toggling struggle state. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleanup handler called when this component is removed from its entity. Detaches any attached fishing rod.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetRod(rod)`
* **Description:** Attaches or detaches a fishing rod. Updates tags, updates movement speeds, and registers/unregisters event listeners.
* **Parameters:** `rod` (`Entity` or `nil`) – The fishing rod entity to attach/detach.
* **Returns:** `true` if a rod was successfully attached; `false` otherwise.
* **Error states:** May silently fail if `rod` is invalid or has no `oceanfishingrod` component.

### `GetRod()`
* **Description:** Returns the currently attached fishing rod.
* **Parameters:** None.
* **Returns:** `Entity` or `nil`.

### `StrugglingSetup(walk_speed, run_speed, stamina_def)`
* **Description:** Initializes the stamina and movement speed parameters for struggle mechanics.
* **Parameters:**  
  - `walk_speed` (number) – Base walk speed for struggle speed calculations.  
  - `run_speed` (number) – Base run speed for struggle speed calculations.  
  - `stamina_def` (table) – Configuration table with keys: `drain_rate`, `recover_rate`, `struggle_times`, `tired_times`.
* **Returns:** Nothing.

### `IsCloseEnoughToCatch()`
* **Description:** Determines if the entity is within range of the rod’s owner to be caught (i.e., tagged `oceanfishing_catchable`).
* **Parameters:** None.
* **Returns:** `boolean` – `true` if within range, `false` otherwise.

### `OnUpdate(dt)`
* **Description:** Called each frame. Updates stamina based on line tension, toggles struggle state timers, and manages the `oceanfishing_catchable` tag.
* **Parameters:** `dt` (number) – Delta time in seconds.
* **Returns:** Nothing.

### `ResetStruggling()`
* **Description:** Immediately resets stamina to full and toggles the struggle state, resetting the timer.
* **Parameters:** None.
* **Returns:** Nothing.

### `CalcLineUnreelRate(rod)`
* **Description:** Calculates how fast the fishing line unreels (positive rate means line is drawn in).
* **Parameters:** `rod` (Entity) – The fishing rod entity.
* **Returns:** number – unreeling rate per second (non-negative if struggling and running away).

### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing state (rod, stamina, struggle timer, lure modifiers).
* **Parameters:** None.
* **Returns:** string.

## Events & listeners
- **Listens to:**  
  - `onremove` on attached `rod` – triggers `SetRod(nil)` if the rod is removed.
- **Pushes:**  
  - None directly (callbacks are invoked via `oneatenfn`, `onsetrodfn`, `onreelinginfn`, and `onreelinginpstfn` fields if assigned).

> Note: This component supports optional hook functions (`onsetrodfn`, `oneatenfn`, `onreelinginfn`, `onreelinginpstfn`, `makeprojectilefn`) that are called by the game or other components. These are not part of the component’s API but are internal extension points.
