---
id: finiteuses
title: Finiteuses
description: Manages a finite number of uses for an item, updating repairability state and deprecation tags as uses are consumed or restored.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: 202a85d3
---

# Finiteuses

## Overview
The `FiniteUses` component tracks and manages the remaining uses of an item (e.g., tools, equipment) within the DST Entity Component System. It handles consumption logic, durability decay, percent-based calculations, and automatically updates related repairable states and entity tags (like `"usesdepleted"`) as the item is used or repaired.

## Dependencies & Tags
- **Tags added/removed:**
  - Adds `"usesdepleted"` when `current ≤ 0` (if previously positive).
  - Removes `"usesdepleted"` when `current > 0` (after previously being depleted).
- **Component usage:** Interacts with optional `repairable` and `forgerepairable` components to adjust repairability status based on remaining uses.
- **No hard dependency declarations** (e.g., no `inst:AddComponent()` calls in `_ctor`), but operates *only* when associated components are present.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `total` | number | `100` | Maximum number of uses the item can have. |
| `current` | number | `100` | Current remaining uses. |
| `consumption` | table | `{}` | Maps `ACTIONS.*` identifiers to the number of uses consumed per action. |
| `ignorecombatdurabilityloss` | boolean | `false` | If `true`, prevents durability loss during combat (e.g., from attacks). |
| `doesnotstartfull` | boolean | `false` | If `true`, indicates the item does *not* start at full durability (affects save/load behavior). |
| `modifyuseconsumption` | function | `nil` | Optional callback to override per-action consumption. |
| `onfinished` | function | `nil` | Callback invoked once when uses transition from >0 to ≤0. |

## Main Functions
### `onfiniteuses(self)` *(internal callback)*
* **Description:** Callback invoked when `current` or `total` changes. Updates repairability state: marks item as repairable if `current < total`, otherwise not.
* **Parameters:** `self` — the `FiniteUses` component instance.

### `SetConsumption(action, uses)`
* **Description:** Records how many uses are consumed per action (e.g., mining, building). Special handling:若 `action == ACTIONS.MINE`, also sets consumption for `ACTIONS.REMOVELUNARBUILDUP`.
* **Parameters:**  
  - `action`: `ACTIONS.*` identifier (e.g., `ACTIONS.MINE`, `ACTIONS.CHOP`).  
  - `uses`: number of uses consumed per action.

### `GetDebugString()`
* **Description:** Returns a formatted string for debug UI (`"X.XX/Y"`), representing current and total uses.
* **Parameters:** None.

### `SetDoesNotStartFull(enabled)`
* **Description:** Enables/disables the assumption that the item *starts* at full uses (used for save compatibility).
* **Parameters:**  
  - `enabled`: `true` if the item does *not* start at full durability.

### `OnSave()`
* **Description:** Saves the current use count *only* if it differs from `total` or `doesnotstartfull` is enabled.
* **Parameters:** None.  
* **Returns:** `{ uses = self.current }` or `nil`.

### `OnLoad(data)`
* **Description:** Restores use count from saved data if present.
* **Parameters:**  
  - `data`: saved table, expected to contain `data.uses`.

### `SetMaxUses(val)`
* **Description:** Sets the maximum (total) number of uses. Does *not* change `current`.
* **Parameters:**  
  - `val`: positive number.

### `SetUses(val)`
* **Description:** Directly sets the current use count. Triggers `"percentusedchange"` event. Updates `"usesdepleted"` tag and `onfinished` callback if transitions occur.
* **Parameters:**  
  - `val`: desired current uses (clamped to `0` if `≤ 0`).

### `GetUses()`
* **Description:** Returns the current number of uses.
* **Parameters:** None.

### `Use(num)`
* **Description:** Decreases current uses by `num` (default: `1`).
* **Parameters:**  
  - `num`: number of uses to consume (optional; defaults to `1`).

### `IgnoresCombatDurabilityLoss()`
* **Description:** Returns whether the item ignores durability loss in combat.
* **Parameters:** None.

### `SetIgnoreCombatDurabilityLoss(value)`
* **Description:** Sets whether the item ignores durability loss from combat.
* **Parameters:**  
  - `value`: `true` to disable combat-based durability loss.

### `SetModifyUseConsumption(fn)`
* **Description:** Registers a custom callback to adjust use consumption *before* it is applied.
* **Parameters:**  
  - `fn`: function with signature `fn(original_uses, action, doer, target, self.inst)` returning adjusted uses.

### `OnUsedAsItem(action, doer, target)`
* **Description:** Handles use consumption during item actions (e.g., mining, building). Applies efficiency multipliers and custom consumption modifiers, then calls `Use`.
* **Parameters:**  
  - `action`: `ACTIONS.*` identifier.  
  - `doer`: entity performing the action (may be `nil`).  
  - `target`: target entity (may be `nil`).

### `GetPercent()`
* **Description:** Returns remaining durability as a ratio (`0.0` to `1.0`).
* **Parameters:** None.

### `SetPercent(amount)`
* **Description:** Sets current uses proportional to `total` (`amount` scaled to `[0, 1]`).
* **Parameters:**  
  - `amount`: desired durability ratio (`0.0` to `1.0`).

### `SetOnFinished(fn)`
* **Description:** Registers a callback to execute when the item’s uses drop to `0` (after being positive).
* **Parameters:**  
  - `fn`: function with signature `fn(inst)`.

### `Repair(repairvalue)`
* **Description:** Adds `repairvalue` to current uses, up to `total`.
* **Parameters:**  
  - `repairvalue`: number of uses to add.

## Events & Listeners
- **Listens to:** `nil` (no `inst:ListenForEvent` calls found).
- **Triggers:**
  - `"percentusedchange"` with payload `{percent = self:GetPercent()}` when `SetUses()` is called.