---
id: healthregenbuff
title: Healthregenbuff
description: A temporary entity that periodically restores health to a target using jellybean-style regen logic, stopping automatically if the target dies or becomes a ghost.
tags: [buff, health, entity, fx]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6c3a7736
system_scope: entity
---

# Healthregenbuff

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`healthregenbuff` is a non-persistent, invisible entity used to apply periodic health restoration to a target entity. It functions as a debuff-type utility — typically attached to a target via a buff effect — and heals the target at fixed intervals (`TUNING.JELLYBEAN_TICK_RATE`) by `TUNING.JELLYBEAN_TICK_VALUE` HP. The buff ends automatically when the target dies, becomes a ghost, or when the overall duration (`TUNING.JELLYBEAN_DURATION`) expires. It relies on the `debuff` and `timer` components to manage its lifecycle.

## Usage example
```lua
-- Typically not spawned manually; created automatically by buff-related logic
-- Example: When a jellybean item grants health regen
local buff = SpawnPrefab("healthregenbuff")
buff.components.debuff:Attach(target)
```

## Dependencies & tags
**Components used:** `debuff`, `timer`, `health`  
**Tags:** Adds `CLASSIFIED` to itself (non-networked); does not manipulate target tags.

## Properties
No public properties initialized in the constructor.

## Main functions
The `healthregenbuff` prefab itself is a one-off entity instance; its behavior is entirely defined via event callbacks (`OnAttached`, `OnExtended`, `OnTimerDone`) and the periodic task (`OnTick`). No public API functions are exported beyond standard component hooks used by `debuff`.

### `OnAttached(inst, target)`
*   **Description:** Called when the debuff is attached to a target entity. Sets up the parent-child relationship, resets position, starts the periodic health regeneration task, and listens for the target's `death` event.
*   **Parameters:**  
    * `inst` (Entity) — the healthregenbuff entity itself  
    * `target` (Entity) — the entity being healed  
*   **Returns:** Nothing.  
*   **Error states:** If `target.components.health` is missing, `IsDead()`, or `target:HasTag("playerghost")`, the periodic task will call `inst.components.debuff:Stop()` on the next tick to terminate the buff.

### `OnExtended(inst, target)`
*   **Description:** Called when the buff duration is extended (e.g., by re-applying the same buff). Resets the timer, cancels and restarts the periodic healing task.
*   **Parameters:**  
    * `inst` (Entity) — the healthregenbuff entity  
    * `target` (Entity) — the entity being healed  
*   **Returns:** Nothing.

### `OnTimerDone(inst, data)`
*   **Description:** Event handler for the internal `"regenover"` timer. Terminates the buff if the timer completes.
*   **Parameters:**  
    * `inst` (Entity) — the healthregenbuff entity  
    * `data` (table) — timer completion data; checks `data.name == "regenover"`  
*   **Returns:** Nothing.

### `OnTick(inst, target)`
*   **Description:** Periodically executed task that attempts to heal the target. Ends the buff early if the target is no longer valid for healing.
*   **Parameters:**  
    * `inst` (Entity) — the healthregenbuff entity  
    * `target` (Entity) — the entity being healed  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  * `"death"` on the target entity — triggers immediate buff termination via `inst.components.debuff:Stop()`.  
  * `"timerdone"` on itself — triggers `OnTimerDone` to terminate the buff when the duration expires.  
- **Pushes:** None (the entity does not fire custom events).
