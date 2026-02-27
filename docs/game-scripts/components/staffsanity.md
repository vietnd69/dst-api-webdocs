---
id: staffsanity
title: Staffsanity
description: Applies a multiplier to sanity deltas triggered by a staff item's casting action.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: a302ea3b
---

# Staffsanity

## Overview
The `Staffsanity` component enables an entity (typically a staff item) to modify sanity changes performed through its `DoCastingDelta` method by applying a configurable multiplier. It acts as a helper wrapper that delegates sanity adjustments to the target entity’s `sanity` component, scaling the amount based on the multiplier set via `SetMultiplier`.

## Dependencies & Tags
- **Component Dependency:** Requires the host entity (`inst`) to have a `sanity` component for `DoCastingDelta` to function meaningfully.
- **No tags** are added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in constructor) | Reference to the entity this component is attached to; used to access other components. |
| `multiplier` | `number` | `nil` (default to `1` in `DoCastingDelta`) | Optional scaling factor applied to sanity delta amounts during casting. |

## Main Functions
### `SetMultiplier(mult)`
* **Description:** Sets the multiplier used to scale sanity deltas in `DoCastingDelta`.
* **Parameters:**  
  - `mult` (`number`): The scaling factor. If `nil` or omitted, `DoCastingDelta` defaults to multiplying by `1`.

### `DoCastingDelta(amount)`
* **Description:** Applies a sanity delta to the host entity, scaled by the configured `multiplier`. Only executes if the host entity has a `sanity` component.
* **Parameters:**  
  - `amount` (`number`): The base sanity change (positive for gain, negative for loss), before scaling.

## Events & Listeners
None.