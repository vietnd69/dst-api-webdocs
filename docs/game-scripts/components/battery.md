---
id: battery
title: Battery
description: Provides a callback-based interface for entities that can be consumed or drained by other systems.
tags: [power, utility, callback]
sidebar_position: 10
last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: components
source_hash: 6cfd4601
system_scope: entity
---

# Battery

> Based on game build **722832** | Last updated: 2026-04-27

## Overview
`Battery` is a lightweight component that provides a callback-based interface for entities that can be consumed or drained by other systems. It does not manage charge state directly but instead delegates all logic to externally-set callback functions. This allows prefabs to define custom battery behavior (e.g., fuel-based, charge-based, or unlimited) while presenting a uniform API to consumers. The component adds the `battery` tag to identify compatible entities.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("battery")

-- Set custom logic for whether the battery can be used
inst.components.battery:SetCanBeUsedFn(function(battery_inst, user, mult)
    return true -- always usable
end)

-- Set what happens when the battery is consumed
inst.components.battery:SetOnUsedFn(function(battery_inst, user, mult)
    battery_inst.components.finiteuses:Use(1)
end)

-- Check and use the battery
if inst.components.battery:CanBeUsed(player) then
    inst.components.battery:OnUsed(player, 1)
end
```

## Dependencies & tags
**Components used:**
- None identified (callback functions may access other components)

**Tags:**
- `battery` -- added on construction, removed on `OnRemoveFromEntity()`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The owning entity instance. |
| `canbeused` | function | `nil` | Callback to check if battery can be used. Set via `SetCanBeUsedFn()`. |
| `onused` | function | `nil` | Callback fired when battery is consumed. Set via `SetOnUsedFn()`. |
| `resolvepartialchargemult` | function | `nil` | Callback to resolve partial charge multiplier. Set via `SetResolvePartialChargeMultFn()`. |

## Main functions
### `SetCanBeUsedFn(fn)`
* **Description:** Sets the callback function that determines whether the battery can be used. The callback receives `(battery_inst, user, mult)` and should return `success, reason`.
* **Parameters:** `fn` -- function or `nil` to clear
* **Returns:** nil
* **Error states:** None

### `SetOnUsedFn(fn)`
* **Description:** Sets the callback function that is called when the battery is consumed. The callback receives `(battery_inst, user, mult)` and should handle the actual consumption logic.
* **Parameters:** `fn` -- function or `nil` to clear
* **Returns:** nil
* **Error states:** None

### `SetResolvePartialChargeMultFn(fn)`
* **Description:** Sets the callback function that resolves the charge multiplier when partial charge is supported. The callback receives `(battery_inst, user, mult)` and returns the adjusted multiplier.
* **Parameters:** `fn` -- function or `nil` to clear
* **Returns:** nil
* **Error states:** None

### `ResolvePartialChargeMult(user, mult)`
* **Description:** Resolves the charge multiplier, potentially returning a lower value if the battery supports partial charge and lacks sufficient power. Calls `resolvepartialchargemult` callback if set, otherwise returns `mult` unchanged.
* **Parameters:**
  - `user` -- entity attempting to use the battery
  - `mult` -- requested charge multiplier
* **Returns:** number -- adjusted multiplier or original `mult` if no callback set
* **Error states:** None

### `CanBeUsed(user, mult)`
* **Description:** Checks whether the battery can be used by the given user. Calls `canbeused` callback if set, otherwise returns `true` by default.
* **Parameters:**
  - `user` -- entity attempting to use the battery
  - `mult` -- requested charge multiplier (passed to callback)
* **Returns:** boolean -- `true` if usable, `false` otherwise (callback may also return `success, reason`)
* **Error states:** None

### `OnUsed(user, mult)`
* **Description:** Called when the battery is consumed. Invokes the `onused` callback if set, otherwise does nothing.
* **Parameters:**
  - `user` -- entity that used the battery
  - `mult` -- charge multiplier that was applied
* **Returns:** nil
* **Error states:** None

### `OnRemoveFromEntity()`
* **Description:** Lifecycle hook called when the component is removed from the entity. Removes the `battery` tag from the entity.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if `self.inst` is nil when calling `self.inst:RemoveTag()` — no nil guard present.

## Events & listeners
None identified.