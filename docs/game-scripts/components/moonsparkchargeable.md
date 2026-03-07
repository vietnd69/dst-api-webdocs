---
id: moonsparkchargeable
title: Moonsparkchargeable
description: Increases the fuel level of an entity's Fueled component when triggered, based on a configured charge amount.
tags: [fuel, event, world]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ae6c53e2
system_scope: world
---

# Moonsparkchargeable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MoonSparkChargeable` is a component used on entities that act as temporary fuel sources (e.g., moon sparkles spawned during moonstorms). When activated, it boosts the fuel level of a target entity that has a `fueled` component, using a fixed `fueled_percent` value defined during initialization. It automatically tags the entity with `"moonsparkchargeable"` for identification and removes it when the component is removed.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fueled")
inst:AddComponent("moonsparkchargeable")
-- Configure the charge amount (e.g., +25% fuel capacity)
inst.components.moonsparkchargeable:SetFueledPercent(0.25)
-- Later, apply the charge to another entity:
inst.components.moonsparkchargeable:DoSpark(some_actor)
```

## Dependencies & tags
**Components used:** `fueled`
**Tags:** Adds and removes `"moonsparkchargeable"`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fueled_percent` | number | `TUNING.MOONSTORM_SPARKCHARGE_DEFAULT` | The fractional amount of fuel (0 to 1) to add to the target's fuel level when `DoSpark` is called. |

## Main functions
### `SetFueledPercent(amount)`
* **Description:** Sets the amount of fuel (as a fraction between 0 and 1) that will be added to a target's `fueled` component during the next `DoSpark` call.
* **Parameters:** `amount` (number) — The fuel fraction to apply.
* **Returns:** Nothing.

### `DoSpark(doer)`
* **Description:** Adds the configured `fueled_percent` to the current fuel percentage of the entity's `fueled` component, if it exists. The result is clamped to `[0, 1]`.
* **Parameters:** `doer` (entity) — The entity triggering the spark charge (passed as context but not used directly in logic).
* **Returns:** Nothing.
* **Error states:** Has no effect if `fueled_percent` is `0` or if the entity lacks a `fueled` component.

## Events & listeners
Not applicable.
