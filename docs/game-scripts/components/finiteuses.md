---
id: finiteuses
title: Finiteuses
description: Manages a finite number of uses for an entity's actions, updating repair status and tags as uses deplete.
tags: [inventory, durability, repair]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 202a85d3
system_scope: inventory
---

# Finiteuses

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FiniteUses` tracks and enforces a limited number of uses for an entity (typically an item), incrementally decrementing `current` uses as actions are performed. It synchronizes repair status with the `repairable` or `forgerepairable` components when present, and manages the `usesdepleted` tag. The component is commonly attached to tools and wearable items with limited lifespans.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("finiteuses")
inst.components.finiteuses:SetMaxUses(50)
inst.components.finiteuses:SetConsumption(ACTIONS.MINE, 5)
inst.components.finiteuses:OnUsedAsItem(ACTIONS.MINE, player, target)
```

## Dependencies & tags
**Components used:** `repairable`, `forgerepairable`, `efficientuser`  
**Tags:** Adds `usesdepleted` when `current <= 0`; removes `usesdepleted` when `current > 0`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `total` | number | `100` | Maximum number of uses allowed. |
| `current` | number | `100` | Remaining number of uses. |
| `consumption` | table | `{}` | Maps actions (e.g., `ACTIONS.MINE`) to use cost. |
| `ignorecombatdurabilityloss` | boolean | `false` | If true, combat-related actions do not consume uses. |
| `doesnotstartfull` | boolean | `nil` | Controls whether the item is considered full at creation (used for save/load). |
| `modifyuseconsumption` | function | `nil` | Optional callback to alter use cost per action. |
| `onfinished` | function | `nil` | Callback executed once uses drop from positive to zero. |

## Main functions
### `SetConsumption(action, uses)`
*   **Description:** Sets the number of uses consumed when a specific action is performed.
*   **Parameters:** `action` (string) — action identifier; `uses` (number) — use count to assign.
*   **Returns:** Nothing.
*   **Error states:** If `action == ACTIONS.MINE`, the same `uses` value is also assigned to `ACTIONS.REMOVELUNARBUILDUP`.

### `Use(num)`
*   **Description:** Decrements current uses by `num` (default `1`).
*   **Parameters:** `num` (number?, default `1`) — number of uses to consume.
*   **Returns:** Nothing.
*   **Error states:** If `num` exceeds remaining uses, `current` is clamped to `0`.

### `OnUsedAsItem(action, doer, target)`
*   **Description:** Handles use consumption for an action, applying modifiers from `efficientuser` and custom `modifyuseconsumption`.
*   **Parameters:** `action` (string) — action performed; `doer` (entity?, optional) — entity performing the action; `target` (entity?, optional) — target entity.
*   **Returns:** Nothing.
*   **Error states:** No-op if no consumption cost is defined for `action`; `doer` or its `efficientuser` component may be `nil`.

### `SetUses(val)`
*   **Description:** Directly sets `current` uses, triggering events and tag updates.
*   **Parameters:** `val` (number) — new use count.
*   **Returns:** Nothing.
*   **Error states:** `current` is clamped to `0` if `val <= 0`; triggers `"percentusedchange"` event.

### `GetPercent()`
*   **Description:** Returns the fraction of remaining uses (`current / total`).
*   **Parameters:** None.
*   **Returns:** number — value in `[0, 1]`.

### `SetPercent(amount)`
*   **Description:** Sets uses based on a percentage of `total`.
*   **Parameters:** `amount` (number) — desired fraction (e.g., `0.5` for half).
*   **Returns:** Nothing.
*   **Error states:** No explicit clamping of `amount`; invalid values may produce unexpected results.

### `Repair(repairvalue)`
*   **Description:** Adds `repairvalue` to `current` without exceeding `total`.
*   **Parameters:** `repairvalue` (number) — number of uses to restore.
*   **Returns:** Nothing.

### `SetMaxUses(val)`
*   **Description:** Updates the total allowable uses; does not automatically adjust `current`.
*   **Parameters:** `val` (number) — new maximum.
*   **Returns:** Nothing.

### `SetOnFinished(fn)`
*   **Description:** Registers a callback executed once `current` transitions from positive to zero.
*   **Parameters:** `fn` (function) — callback invoked with `(inst)` signature.
*   **Returns:** Nothing.

### `SetModifyUseConsumption(fn)`
*   **Description:** Sets a custom function to dynamically modify use consumption.
*   **Parameters:** `fn` (function) — callback with signature `(uses, action, doer, target, item)`.
*   **Returns:** Nothing.

### `IgnoresCombatDurabilityLoss()`
*   **Description:** Indicates whether combat actions bypass durability loss.
*   **Parameters:** None.
*   **Returns:** boolean — current value of `ignorecombatdurabilityloss`.

### `SetIgnoreCombatDurabilityLoss(value)`
*   **Description:** Enables or disables combat-based durability loss.
*   **Parameters:** `value` (boolean).
*   **Returns:** Nothing.

### `SetDoesNotStartFull(enabled)`
*   **Description:** Informs the save system that the item does *not* begin at full uses.
*   **Parameters:** `enabled` (boolean).
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a formatted string for debugging display (e.g., `"10.00/100"`).
*   **Parameters:** None.
*   **Returns:** string.

### `OnSave()`
*   **Description:** Returns save data if `current` differs from `total` or `doesnotstartfull` is true.
*   **Parameters:** None.
*   **Returns:** `{ uses = number }` or `nil`.

### `OnLoad(data)`
*   **Description:** Loads saved `uses` value via `SetUses`.
*   **Parameters:** `data` (table) — expected to contain `data.uses`.
*   **Returns:** Nothing.

### `OnRemoveFromEntity()`
*   **Description:** Removes the `usesdepleted` tag when component is detached.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None explicitly (uses `Class` metadata to bind `current` and `total` changes to `onfiniteuses`).
- **Pushes:** `"percentusedchange"` — `{percent = number}` — fired when `current` changes.  
  `"usesdepleted"` tag is added/removed as a side effect of `SetUses`.
