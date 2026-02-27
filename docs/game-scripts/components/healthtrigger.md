---
id: healthtrigger
title: Healthtrigger
description: Executes custom callbacks when an entity's health percentage crosses specified threshold values.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 894a75f5
---

# Healthtrigger

## Overview
The `HealthTrigger` component monitors changes in an entity's health percentage and executes registered callback functions when the health crosses predefined threshold values. It is typically attached to entities (e.g., players, creatures) that have a `health` component and enables event-driven logic based on health milestones (e.g., when health drops below 25%).

## Dependencies & Tags
- **Component Dependency**: Requires the `health` component to be present on the same entity (`inst.components.health`), as it relies on the `healthdelta` event emitted by the health component.
- **Tags**: None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity the component is attached to. |
| `triggers` | `table` | `{}` | A dictionary mapping health percentages (thresholds, as floats between `0.0` and `1.0`) to callback functions. |

## Main Functions
### `AddTrigger(amount, fn)`
* **Description:** Registers a callback function (`fn`) to be invoked when the entity's health percentage crosses the specified `amount` threshold (e.g., `0.25` for 25% health). Thresholds are interpreted as fractions of max health (0.0 = dead, 1.0 = full health).
* **Parameters:**  
  - `amount` (number): A float in the range `[0.0, 1.0]` representing the health percentage threshold.  
  - `fn` (function): A callback function that accepts the entity instance (`inst`) as its only argument.

### `OnHealthDelta(data)`
* **Description:** Internal handler called when the entity's health changes. Evaluates registered thresholds against the old and new health percentages and triggers callbacks in the correct order (descending for health loss, ascending for health gain).
* **Parameters:**  
  - `data` (table): Event payload from the `healthdelta` event, expected to contain `oldpercent` and `newpercent` fields (floats between `0.0` and `1.0`).

### `OnRemoveFromEntity()`
* **Description:** Cleans up event listeners when the component is removed from the entity.
* **Parameters:** None.

## Events & Listeners
- Listens to `"healthdelta"` events on `self.inst`, triggering `OnHealthDelta`.
- Removes the `"healthdelta"` callback during `OnRemoveFromEntity()`.