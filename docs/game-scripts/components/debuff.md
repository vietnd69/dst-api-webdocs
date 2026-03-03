---
id: debuff
title: Debuff
description: Manages the attachment, detachment, extension, and symbol-following behavior of a debuff applied to a target entity.
tags: [combat, effect, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 87626945
system_scope: entity
---

# Debuff

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Debuff` component provides a standardized interface for managing the lifecycle and behavior of debuffs applied to entities. It is designed to be attached to debuff prefabs (e.g., a fire effect, poison cloud, or binding rope) and works in conjunction with a `debuffable` component on the target entity. The component stores callback functions that are invoked at key lifecycle events: attachment, detachment, extension, and follow-symbol changes. It does not store or manage state such as timers or tick rates—those responsibilities belong to the host prefab or the `debuffable` component.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("debuff")

inst.components.debuff:SetAttachedFn(function(self_debuff, target, followsymbol, followoffset, data, buffer)
    -- logic to run when debuff attaches to target
end)

inst.components.debuff:SetDetachedFn(function(self_debuff, target)
    -- logic to run when debuff is removed from target
end)

inst.components.debuff:AttachTo("fire", target_entity, "torso", Vector3(0, 1, 0), nil, nil)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `name` | string or `nil` | `nil` | The identifier of the debuff (e.g., `"fire"`), set during `AttachTo`. |
| `target` | entity instance or `nil` | `nil` | The entity to which this debuff is attached. |
| `onattachedfn` | function or `nil` | `nil` | Callback invoked on attachment; signature: `fn(inst, target, followsymbol, followoffset, data, buffer)`. |
| `ondetachedfn` | function or `nil` | `nil` | Callback invoked on detachment; signature: `fn(inst, target)`. |
| `onextendedfn` | function or `nil` | `nil` | Callback invoked on extension; signature: `fn(inst, target, followsymbol, followoffset, data, buffer)`. |
| `onchangefollowsymbolfn` | function or `nil` | `nil` | Callback invoked when the follow symbol changes; signature: `fn(inst, target, followsymbol, followoffset)`. |

## Main functions
### `SetAttachedFn(fn)`
* **Description:** Sets the callback function invoked when the debuff is attached to a target entity. Called by the `debuffable` component during `AddDebuff`.
* **Parameters:** `fn` (function) – callback with parameters `(debuff_inst, target_inst, followsymbol, followoffset, data, buffer)`.
* **Returns:** Nothing.

### `SetDetachedFn(fn)`
* **Description:** Sets the callback function invoked when the debuff is detached from a target. Called by the `debuffable` component during `RemoveDebuff`.
* **Parameters:** `fn` (function) – callback with parameters `(debuff_inst, target_inst)`.
* **Returns:** Nothing.

### `SetExtendedFn(fn)`
* **Description:** Sets the callback function invoked when the debuff's duration is extended on the target (e.g., reapplying a stackable debuff).
* **Parameters:** `fn` (function) – callback with parameters `(debuff_inst, target_inst, followsymbol, followoffset, data, buffer)`.
* **Returns:** Nothing.

### `SetChangeFollowSymbolFn(fn)`
* **Description:** Sets the callback function invoked when the debuff’s visual or gameplay anchor point on the target changes (e.g., switching from `"torso"` to `"head"`).
* **Parameters:** `fn` (function) – callback with parameters `(debuff_inst, target_inst, followsymbol, followoffset)`.
* **Returns:** Nothing.

### `Stop()`
* **Description:** Attempts to remove this debuff from its current target by calling `target:RemoveDebuff(self.name)`. Safe to call even if the debuff is not currently attached.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if `target` is `nil`.

### `AttachTo(name, target, followsymbol, followoffset, data, buffer)`
* **Description:** Initializes the debuff with a name and target, and triggers the `onattachedfn` callback. Intended to be called only by the `debuffable` component.
* **Parameters:**  
  * `name` (string) – unique identifier for this debuff instance on the target.  
  * `target` (entity instance) – entity to attach to.  
  * `followsymbol` (string) – target bone/symbol name (e.g., `"torso"`) for visual anchoring.  
  * `followoffset` (Vector3) – positional offset relative to the follow symbol.  
  * `data` (table or `nil`) – optional metadata passed to the attachment callback.  
  * `buffer` (table or `nil`) – optional buffer reference for network replication or sync.  
* **Returns:** Nothing.
* **Error states:** No-op if `onattachedfn` is `nil`.

### `OnDetach()`
* **Description:** Resets internal state (`name`, `target`) and triggers the `ondetachedfn` callback. Intended to be called only by the `debuffable` component.
* **Parameters:** None.
* **Returns:** Nothing.

### `Extend(followsymbol, followoffset, data, buffer)`
* **Description:** Triggers the `onextendedfn` callback to update debuff state or duration extension logic.
* **Parameters:** Same as `AttachTo`.
* **Returns:** Nothing.
* **Error states:** No-op if `onextendedfn` is `nil` or `target` is `nil`.

### `ChangeFollowSymbol(followsymbol, followoffset)`
* **Description:** Triggers the `onchangefollowsymbolfn` callback when the visual anchor point on the target changes.
* **Parameters:**  
  * `followsymbol` (string) – new symbol to follow.  
  * `followoffset` (Vector3) – new offset.  
* **Returns:** Nothing.
* **Error states:** No-op if `onchangefollowsymbolfn` is `nil` or `target` is `nil`.

## Events & listeners
None identified
