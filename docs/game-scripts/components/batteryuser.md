---
id: batteryuser
title: Batteryuser
description: Enables an entity to consume charge from another entity's battery component.
tags: [power, component, interaction]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: b220f5d6
system_scope: entity
---

# Batteryuser

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`BatteryUser` allows an entity to interact with and consume charge from another entity that possesses a `battery` component. It manages callbacks for charge multiplication and usage events, enabling custom logic when power is drawn. This component is typically added to devices or structures that require fuel or electrical charge to operate.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("batteryuser")

-- Define how much charge is consumed
inst.components.batteryuser:SetChargeMultFn(function(inst, target)
    return 1.0
end)

-- Define custom logic on usage
inst.components.batteryuser:SetOnBatteryUsedFn(function(inst, target, mult)
    return true, nil
end)

-- Attempt to draw charge from a generator
local generator = SpawnPrefab("lightningrod")
inst.components.batteryuser:ChargeFrom(generator)
```

## Dependencies & tags
**Components used:**
- `battery` -- accessed on the target entity passed to `ChargeFrom` to check usage and consume charge

**Tags:**
- `batteryuser` -- added on initialization, removed when component is removed from entity

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `chargemultfn` | function/nil | `nil` | Callback to calculate charge multiplication factor. |
| `onbatteryused` | function/nil | `nil` | Callback triggered when the battery is successfully used. |
| `allowpartialcharge` | boolean | `false` | Determines if partial charge multipliers are resolved via the battery component. |

## Main functions
### `OnRemoveFromEntity()`
*   **Description:** Cleanup function called when the component is removed from the entity. Removes the `batteryuser` tag.
*   **Parameters:** None
*   **Returns:** None
*   **Error states:** None

### `SetChargeMultFn(fn)`
*   **Description:** Sets the callback function used to calculate the charge multiplication factor.
*   **Parameters:** `fn` -- function(inst, charge_target) returning a number multiplier.
*   **Returns:** None
*   **Error states:** None

### `SetOnBatteryUsedFn(fn)`
*   **Description:** Sets the callback function triggered when the battery is successfully used.
*   **Parameters:** `fn` -- function(inst, charge_target, mult) returning success, reason.
*   **Returns:** None
*   **Error states:** None

### `SetAllowPartialCharge(allow)`
*   **Description:** Configures whether partial charge multipliers should be resolved via the target battery component.
*   **Parameters:** `allow` -- boolean to enable or disable partial charge resolution.
*   **Returns:** None
*   **Error states:** None

### `ChargeFrom(charge_target)`
*   **Description:** Attempts to consume charge from the specified target entity. Executes charge multiplication callbacks, checks battery usability, and triggers usage events if successful.
*   **Parameters:** `charge_target` -- entity instance containing a `battery` component.
*   **Returns:** `result` (boolean), `reason` (string/nil) -- success status and optional failure reason from the battery component.
*   **Error states:** Errors if `charge_target` is nil or does not have a `battery` component (nil dereference on `charge_target.components.battery` — no guard present in source).

## Events & listeners
**Listens to:** None identified.
**Pushes:** None identified.