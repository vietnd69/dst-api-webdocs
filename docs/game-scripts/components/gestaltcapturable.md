---
id: gestaltcapturable
title: Gestaltcapturable
description: Tracks targeting and capture state for Gestalt-based entities, enabling them to be captured by the Gestalt Cage.
tags: [gestalt, capture, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: bb2c573f
system_scope: entity
---

# Gestaltcapturable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `gestaltcapturable` component enables an entity to be targeted and captured by Gestalt Cage mechanisms. It tracks which objects (e.g., Gestalt Cages) are currently targeting the entity, fires callback functions when targeting state changes, and notifies associated systems upon capture. It is designed for use with entities that participate in Gestalt mechanics, such as monster versions of characters.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("gestaltcapturable")
inst.components.gestaltcapturable:SetLevel(3)
inst.components.gestaltcapturable:SetOnTargetedFn(function(ent) print(ent.prefab .. " is now targeted") end)
inst.components.gestaltcapturable:SetOnCapturedFn(function(ent, cage, doer) print(ent.prefab .. " captured by " .. doer.prefab) end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `gestaltcapturable` tag when enabled; removes it on removal from entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `level` | number | `1` | Capturable level (e.g., difficulty or stage). |
| `enabled` | boolean | `true` | Whether the component is active and the entity is capturable. |
| `targeters` | table | `{}` | Map of objects currently targeting this entity. |
| `ontargetedfn` | function | `nil` | Callback invoked when the entity transitions from untargeted to targeted. |
| `onuntargetedfn` | function | `nil` | Callback invoked when the entity transitions from targeted to untargeted. |
| `oncapturedfn` | function | `nil` | Callback invoked when the entity is captured. |

## Main functions
### `SetEnabled(enabled)`
*   **Description:** Enables or disables capturability. When disabled, the `gestaltcapturable` tag is removed from the entity.
*   **Parameters:** `enabled` (boolean) — whether the entity should be capturable.
*   **Returns:** Nothing.

### `IsEnabled()`
*   **Description:** Returns whether the component is currently enabled.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if enabled, `false` otherwise.

### `SetLevel(level)`
*   **Description:** Sets the capturable level for this entity (e.g., used by Gestalt Cages to determine compatibility).
*   **Parameters:** `level` (number) — the capturable level.
*   **Returns:** Nothing.

### `GetLevel()`
*   **Description:** Gets the current capturable level.
*   **Parameters:** None.
*   **Returns:** `number` — the capturable level.

### `SetOnCapturedFn(fn)`
*   **Description:** Registers a function to be called when the entity is captured.
*   **Parameters:** `fn` (function) — function with signature `fn(inst, cage, doer)`.
*   **Returns:** Nothing.

### `SetOnTargetedFn(fn)`
*   **Description:** Registers a function to be called when the entity becomes targeted.
*   **Parameters:** `fn` (function) — function with signature `fn(inst)`.
*   **Returns:** Nothing.

### `SetOnUntargetedFn(fn)`
*   **Description:** Registers a function to be called when the entity is no longer targeted.
*   **Parameters:** `fn` (function) — function with signature `fn(inst)`.
*   **Returns:** Nothing.

### `IsTargeted()`
*   **Description:** Checks whether the entity is currently targeted by at least one object.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if targeted, `false` otherwise.

### `OnTargeted(obj)`
*   **Description:** Called by `gestaltcage` component when it begins targeting this entity. Registers internal listener for removal of the targeter and fires the `ontargetedfn` callback and `gestaltcapturable_targeted` event if this is the first targeter.
*   **Parameters:** `obj` (Entity) — the object (e.g., Gestalt Cage) that is now targeting this entity.
*   **Returns:** Nothing.

### `OnUntargeted(obj)`
*   **Description:** Called by `gestaltcage` component when it stops targeting this entity. Unregisters internal listener and fires the `onuntargetedfn` callback and `gestaltcapturable_untargeted` event if no targeters remain.
*   **Parameters:** `obj` (Entity) — the object that is no longer targeting this entity.
*   **Returns:** Nothing.

### `OnCaptured(obj, doer)`
*   **Description:** Called by `gestaltcage` component upon successful capture. Notifies the capturer (`doer`) via `gestaltcaptured` event and invokes `oncapturedfn` callback.
*   **Parameters:**  
  * `obj` (Entity) — the Gestalt Cage or capture object.  
  * `doer` (Entity or `nil`) — the entity performing the capture (e.g., player).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` (on targeter entities) — triggers `OnUntargeted` for that targeter.  
- **Pushes:**  
  * `gestaltcapturable_targeted` — fired when the entity transitions from untargeted to targeted.  
  * `gestaltcapturable_untargeted` — fired when the entity transitions from targeted to untargeted.
