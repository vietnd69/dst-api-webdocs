---
id: wormwood_vined_debuff
title: Wormwood Vined Debuff
description: Applies a rooted debuff effect to a target entity, dealing periodic damage and attaching a visual FX entity that follows a specific symbol on the target.
tags: [debuff, root, combat, fx]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7c07c492
system_scope: combat
---

# Wormwood Vined Debuff

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wormwood_vined_debuff` is a_prefab that functions as a combat debuff effect — specifically, a rooted vine that attaches to a target entity. It is instantiated by Wormwood's abilities and attaches to the target using a follower system tied to a named symbol. The prefab adds a `debuff` component (enabling integration with the debuff system), a `timer` component (to automatically terminate the effect after a fixed duration), and ensures the target becomes rooted via the `rooted` component. Upon attachment, it deals initial damage to the target and listens for events that should prematurely end the effect (e.g., target death, flight state, removal).

## Usage example
This prefab is not added directly by modders but is spawned internally by the game (e.g., when Wormwood uses a specific ability). However, if a modder wishes to replicate its behavior for testing or custom abilities, they would do something like:

```lua
local inst = MakePrefabInstance("wormwood_vined_debuff")
inst.GUID = TheNet:GetServerGUID() -- Required for proper network sync
local target = some_entity
inst.Follower:FollowSymbol(target.GUID, "root_sym", 0, 0, 0) -- Followed via debuff.SetChangeFollowSymbolFn
```

## Dependencies & tags
**Components used:** `debuff`, `timer`, `rooted`, `combat`, `health`, `transform`, `follower`, `animstate`, `network`  
**Tags:** Adds `"FX"` and `"NOCLICK"` to the instance. Uses `target.components.rooted` to add/remove source.

## Properties
No public properties are exposed by this prefab. All internal behavior is encapsulated in event handlers and `debuff` callbacks.

## Main functions
### `OnChangeFollowSymbol(inst, target, followsymbol, followoffset)`
*   **Description:** Callback used by the `debuff` component to update the follower's target symbol and offset during runtime (e.g., on state change). Attaches the debuff FX to the target’s specified symbol.
*   **Parameters:**  
    - `inst`: The debuff instance (self).  
    - `target`: The entity being debuffed.  
    - `followsymbol`: The symbol name to follow (string).  
    - `followoffset`: A vector offset (x, y, z) relative to the symbol.
*   **Returns:** Nothing.

### `OnAttached(inst, target, followsymbol, followoffset)`
*   **Description:** Invoked when the debuff is first attached to a target. Sets parent relationship, adds `rooted` source, registers cleanup listeners, and deals initial damage.
*   **Parameters:** Same as `OnChangeFollowSymbol`.
*   **Returns:** Nothing.
*   **Error states:** Attaches a `rooted` component to the target if missing. Ignores damage if target is dead or lacks `combat`.

### `OnDetached(inst, target)`
*   **Description:** Invoked when the debuff ends. Removes the root source, plays detachment animation, and schedules the prefab for removal.
*   **Parameters:**  
    - `inst`: The debuff instance.  
    - `target`: The previously debuffed entity (may be nil/invalid).
*   **Returns:** Nothing.

### `OnTimerDone(inst, data)`
*   **Description:** Timer callback. Terminates the debuff when the `STOP_TASK_NAME` timer expires.
*   **Parameters:**  
    - `inst`: The debuff instance.  
    - `data`: Table with timer name; checked against `"stop_vined_debuff"`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `death`, `enterlimbo`, `teleported`, `onremove` on target — all terminate the debuff.  
  - `newstate` on target — terminates debuff if target enters a state with tag `"flight"`.  
  - `animover` on self — triggers self-removal after the `spike_pst` animation completes.  
  - `timerdone` — triggers debuff termination if timer name matches `"stop_vined_debuff"`.
- **Pushes:** None (this prefab does not fire custom events).