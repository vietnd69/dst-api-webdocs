---
id: tillweedsalve
title: Tillweedsalve
description: A consumable healing item that applies a debuff-based regenerative effect to living targets over time.
tags: [healing, debuff, consumable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c3b78ef7
system_scope: entity
---

# Tillweedsalve

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`Tillweedsalve` is a consumable inventory item prefab that heals a target entity by applying a temporary regenerative debuff. It uses the `healer` component to trigger healing on use, and relies on a companion `tillweedsalve_buff` entity to manage the debuff's periodic healing logic and lifecycle. The debuff entity is created on the master simulation only and communicates with the target via `debuff`, `timer`, and `health` component interactions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inventoryitem")
inst:AddComponent("healer")
inst.components.healer:SetHealthAmount(TUNING.HEALING_MEDSMALL)
inst.components.healer:SetOnHealFn(function(inst, target)
    target:AddDebuff("tillweedsalve_buff", "tillweedsalve_buff")
end)
```

## Dependencies & tags
**Components used:** `healer`, `debuff`, `timer`, `health`, `stackable`, `inspectable`, `inventoryitem`
**Tags:** `show_spoilage`, `CLASSIFIED` (on debuff entity only)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `task` | Task (internal) | `nil` | Periodic timer task managing the debuff's tick rate on the debuff entity. |

## Main functions
### `OnUse(inst, target)`
*   **Description:** Called when the item is used via the `healer` component; applies the `tillweedsalve_buff` debuff to the target.
*   **Parameters:**  
    `inst` (Entity) — the tillweedsalve item instance.  
    `target` (Entity) — the entity receiving the heal.
*   **Returns:** Nothing.
*   **Error states:** None; assumes `target` has valid components.

### `OnAttached(inst, target)`
*   **Description:** Called when the debuff entity is attached to a target. Sets up parent relationship, position, and starts periodic healing ticks; listens for the target's `death` event.
*   **Parameters:**  
    `inst` (Entity) — the `tillweedsalve_buff` debuff instance.  
    `target` (Entity) — the entity being debuffed.
*   **Returns:** Nothing.

### `OnTick(inst, target)`
*   **Description:** Periodic tick handler that applies health delta to the target if alive and non-ghost; stops the debuff otherwise.
*   **Parameters:**  
    `inst` (Entity) — the `tillweedsalve_buff` debuff instance.  
    `target` (Entity) — the entity being debuffed.
*   **Returns:** Nothing.

### `OnExtended(inst, target)`
*   **Description:** Called when the debuff is extended (e.g., by reapplying). Resets the regen-over timer and restarts the periodic tick task.
*   **Parameters:**  
    `inst` (Entity) — the `tillweedsalve_buff` debuff instance.  
    `target` (Entity) — the entity being debuffed.
*   **Returns:** Nothing.

### `OnTimerDone(inst, data)`
*   **Description:** Timer callback for the `"regenover"` timer; stops the debuff when duration expires.
*   **Parameters:**  
    `inst` (Entity) — the `tillweedsalve_buff` debuff instance.  
    `data` (table) — timer data containing `name` key.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
    - `"death"` — on the target entity (in `OnAttached`) to stop the debuff when target dies.  
    - `"timerdone"` — on the debuff entity to stop the debuff when `"regenover"` timer completes.
- **Pushes:** None directly (delegates to `debuff:Stop()`).
