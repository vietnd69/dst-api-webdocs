---
id: moonsparkchargeable
title: Moonsparkchargeable
description: Grants an entity the ability to transfer stored spark charge into a fueled component when triggered.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: ae6c53e2
---

# Moonsparkchargeable

## Overview
This component enables an entity to act as a portable source of spark charge, which can be transferred to another entity's `fueled` component via the `DoSpark` function. It tracks a `fueled_percent` value representing the amount of charge available and ensures the entity is tagged appropriately for gameplay logic.

## Dependencies & Tags
- **Component Dependency:** Assumes the target of `DoSpark` has a `fueled` component (`self.inst.components.fueled` is checked before use).
- **Tags Added/Removed:**  
  - Adds the `"moonsparkchargeable"` tag upon construction.  
  - Removes the `"moonsparkchargeable"` tag when removed from the entity.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fueled_percent` | `number` | `TUNING.MOONSTORM_SPARKCHARGE_DEFAULT` | The proportion of charge (0.0–1.0) that this entity contributes when sparking. |

## Main Functions

### `SetFueledPercent(amount)`
* **Description:** Updates the stored spark charge level (`fueled_percent`) to the specified value.
* **Parameters:**  
  - `amount` (`number`): The new charge percentage (typically between 0 and 1, though no explicit clamping is applied within this function).

### `DoSpark(doer)`
* **Description:** Attempts to transfer this component’s stored charge to the `fueled` component of the **target entity** (the entity this component is attached to). The charge is added (as a relative increment) to the target’s current fuel level, clamped to [0, 1]. No transfer occurs if `fueled_percent` is zero or the target lacks a `fueled` component.
* **Parameters:**  
  - `doer` (`Entity`): The entity triggering the spark event (not directly used in logic, but included for context in event callbacks).  

## Events & Listeners
None identified.