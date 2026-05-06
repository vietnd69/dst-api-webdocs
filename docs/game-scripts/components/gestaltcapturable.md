---
id: gestaltcapturable
title: Gestaltcapturable
description: Tracks targeting and capture state for entities that can be captured by Gestalt mechanics.
tags: [capture, gestalt, targeting]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: 351167a9
system_scope: entity
---

# GestaltCapturable

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`GestaltCapturable` manages the targeting and capture lifecycle for entities that can be captured by Gestalt-related mechanics. It tracks which entities are currently targeting this entity, fires events when targeting state changes, and invokes callback functions when capture occurs. This component is typically used alongside `gestaltcage` to enable capture interactions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("gestaltcapturable")
inst.components.gestaltcapturable:SetLevel(2)
inst.components.gestaltcapturable:SetOnCapturedFn(function(inst, obj, doer)
    print("Entity was captured!")
end)
inst.components.gestaltcapturable:SetEnabled(true)
```

## Dependencies & tags
**External dependencies:**
- None identified

**Components used:**
- None identified

**Tags:**
- `gestaltcapturable` -- added when `enabled` is true, removed on entity removal

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `level` | number | `1` | Capture level for this entity. |
| `isplanar` | boolean \| nil | `nil` | Whether this entity is planar. Set via `SetIsPlanar()`. |
| `enabled` | boolean | `true` | Controls whether entity is capturable. Assignment triggers `onenabled` watcher to sync tag. |
| `targeters` | table | `{}` | Tracks entities currently targeting this entity. Keys are targeter objects. |
| `ontargetedfn` | function \| nil | `nil` | Callback fired when first targeter begins targeting. Signature: `fn(inst)`. Set via `SetOnTargetedFn()`. |
| `onuntargetedfn` | function \| nil | `nil` | Callback fired when last targeter stops targeting. Signature: `fn(inst)`. Set via `SetOnUntargetedFn()`. |
| `oncapturedfn` | function \| nil | `nil` | Callback fired on capture. Signature: `fn(inst, obj, doer)`. Set via `SetOnCapturedFn()`. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleanup function called when component is removed from entity. Removes the `gestaltcapturable` tag.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `SetEnabled(enabled)`
* **Description:** Sets whether this entity is capturable. Triggers `onenabled` property watcher to add/remove tag.
* **Parameters:** `enabled` -- boolean to enable or disable capturing
* **Returns:** nil
* **Error states:** None

### `IsEnabled()`
* **Description:** Returns whether capturing is currently enabled for this entity.
* **Parameters:** None
* **Returns:** boolean -- current enabled state
* **Error states:** None

### `SetLevel(level)`
* **Description:** Sets the capture level for this entity.
* **Parameters:** `level` -- number representing capture level
* **Returns:** nil
* **Error states:** None

### `GetLevel()`
* **Description:** Returns the current capture level.
* **Parameters:** None
* **Returns:** number -- current level value
* **Error states:** None

### `SetIsPlanar(bool)`
* **Description:** Sets whether this entity is planar. Passing nil clears the value.
* **Parameters:** `bool` -- boolean or nil to clear
* **Returns:** nil
* **Error states:** None

### `GetIsPlanar()`
* **Description:** Returns whether this entity is planar.
* **Parameters:** None
* **Returns:** boolean \| nil -- planar state or nil if not set
* **Error states:** None

### `SetOnCapturedFn(fn)`
* **Description:** Sets the callback function to invoke when this entity is captured.
* **Parameters:** `fn` -- function with signature `fn(inst, obj, doer)` or nil to clear
* **Returns:** nil
* **Error states:** None

### `SetOnTargetedFn(fn)`
* **Description:** Sets the callback function to invoke when first targeter begins targeting.
* **Parameters:** `fn` -- function with signature `fn(inst)` or nil to clear
* **Returns:** nil
* **Error states:** None

### `SetOnUntargetedFn(fn)`
* **Description:** Sets the callback function to invoke when last targeter stops targeting.
* **Parameters:** `fn` -- function with signature `fn(inst)` or nil to clear
* **Returns:** nil
* **Error states:** None

### `IsTargeted()`
* **Description:** Checks if any entities are currently targeting this entity.
* **Parameters:** None
* **Returns:** boolean -- `true` if `targeters` table has any entries
* **Error states:** None

### `OnTargeted(obj)`
* **Description:** Called by `gestaltcage` component when an entity begins targeting this entity. Adds targeter to tracking table, registers `onremove` listener on targeter, and fires events/callbacks if this is the first targeter.
* **Parameters:** `obj` -- entity instance that is targeting
* **Returns:** nil
* **Error states:** None

### `OnUntargeted(obj)`
* **Description:** Called by `gestaltcage` component when an entity stops targeting this entity. Removes targeter from tracking table, unregisters `onremove` listener, and fires events/callbacks if no targeters remain.
* **Parameters:** `obj` -- entity instance that stopped targeting
* **Returns:** nil
* **Error states:** None

### `OnCaptured(obj, doer)`
* **Description:** Called by `gestaltcage` component when this entity is captured. Pushes `gestaltcaptured` event to the doer and invokes the `oncapturedfn` callback.
* **Parameters:**
  - `obj` -- entity instance representing the capture mechanism (e.g., gestaltcage). The captured entity is `self.inst`.
  - `doer` -- entity instance that performed the capture (e.g., player)
* **Returns:** nil
* **Error states:** None

### `onenabled(self, enabled)` (local)
* **Description:** Property watcher callback fired when `enabled` property is assigned. Adds or removes the `gestaltcapturable` tag based on the new value.
* **Parameters:**
  - `self` -- component instance
  - `enabled` -- boolean new value
* **Returns:** nil
* **Error states:** None

## Events & listeners
- **Listens to:** `onremove` -- listened on targeter objects; triggers `OnUntargeted()` when a targeter is removed
- **Pushes:** `gestaltcapturable_targeted` -- fired when first targeter begins targeting; Data: none
- **Pushes:** `gestaltcapturable_untargeted` -- fired when last targeter stops targeting; Data: none
- **Pushes:** `gestaltcaptured` -- fired on the doer entity when capture occurs; Data: `self.inst` (the captured entity)