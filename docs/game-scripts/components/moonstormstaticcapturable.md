---
id: moonstormstaticcapturable
title: Moonstormstaticcapturable
description: Tracks whether an entity is being targeted by moonstormstaticcatcher components and manages callbacks and events for targeting and catching interactions.
tags: [moonstorm, target, event, boss]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 1f5d4e0d
system_scope: entity
---

# Moonstormstaticcapturable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MoonstormStaticCapturable` is a lightweight component that enables an entity to be tracked as a target for moonstormstaticcatcher components (e.g., during boss phase mechanics). It maintains a set of active targeters, fires callbacks when targeting state changes, and notifies other systems via events when it is first targeted, no longer targeted, or caught. It is designed to work in conjunction with the `moonstormstaticcatcher` component.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("moonstormstaticcapturable")
inst.components.moonstormstaticcapturable:SetOnTargetedFn(function(entity)
    print("Entity is now being targeted!")
end)
inst.components.moonstormstaticcapturable:SetOnCaughtFn(function(entity, targeter, doer)
    print("Entity was caught!")
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds/removes `moonstormstaticcapturable` tag based on enabled state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | boolean | `true` | Whether the capturable state is active; controls presence of the `moonstormstaticcapturable` tag. |
| `targeters` | table | `{}` | Internal map of objects that are currently targeting this entity. |
| `ontargetedfn` | function? | `nil` | Optional callback invoked when the entity transitions from untargeted to targeted. |
| `onuntargetedfn` | function? | `nil` | Optional callback invoked when the entity transitions from targeted to untargeted. |
| `oncaughtfn` | function? | `nil` | Optional callback invoked when the entity is caught (typically by a moonstormstaticcatcher). |

## Main functions
### `SetEnabled(enabled)`
*   **Description:** Enables or disables the capturable state. When disabled, the `moonstormstaticcapturable` tag is removed; when enabled, the tag is added.
*   **Parameters:** `enabled` (boolean) – whether to enable the component.
*   **Returns:** Nothing.
*   **Error states:** None.

### `IsEnabled()`
*   **Description:** Returns whether the component is currently enabled.
*   **Parameters:** None.
*   **Returns:** boolean – `true` if enabled, `false` otherwise.

### `SetOnTargetedFn(fn)`
*   **Description:** Sets a callback function to be invoked when the entity transitions from untargeted to targeted.
*   **Parameters:** `fn` (function(entity) or `nil`) – callback that receives the entity instance.
*   **Returns:** Nothing.

### `SetOnUntargetedFn(fn)`
*   **Description:** Sets a callback function to be invoked when the entity transitions from targeted to untargeted.
*   **Parameters:** `fn` (function(entity) or `nil`) – callback that receives the entity instance.
*   **Returns:** Nothing.

### `SetOnCaughtFn(fn)`
*   **Description:** Sets a callback function to be invoked when the entity is caught.
*   **Parameters:** `fn` (function(entity, targeter, doer) or `nil`) – callback with entity, the object that was targeting it, and the object performing the catch.
*   **Returns:** Nothing.

### `IsTargeted()`
*   **Description:** Returns whether the entity is currently being targeted.
*   **Parameters:** None.
*   **Returns:** boolean – `true` if at least one targeter is registered, `false` otherwise.

### `OnTargeted(obj)`
*   **Description:** Called by `moonstormstaticcatcher` to register a new targeter. Triggers the `moonstormstaticcapturable_targeted` event if this is the first targeter.
*   **Parameters:** `obj` (entity/table) – the object that is now targeting this entity.
*   **Returns:** Nothing.
*   **Error states:** Ignores duplicate targeters (idempotent behavior).

### `OnUntargeted(obj)`
*   **Description:** Called by `moonstormstaticcatcher` to unregister a targeter. Triggers the `moonstormstaticcapturable_untargeted` event if no targeters remain.
*   **Parameters:** `obj` (entity/table) – the object that is no longer targeting this entity.
*   **Returns:** Nothing.
*   **Error states:** Safely handles removal of non-registered targeters.

### `OnCaught(obj, doer)`
*   **Description:** Called by `moonstormstaticcatcher` when the entity is successfully caught. Fires a `moonstormstatic_caught` event on the `doer` (if provided) and invokes the `oncaughtfn` callback.
*   **Parameters:**  
  `obj` (entity/table) – the targeter object.  
  `doer` (entity or `nil`) – the entity performing the catch.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` event on targeter objects (via `inst:ListenForEvent("onremove", ...)`), to automatically untarget when a targeter is removed.
- **Pushes:**  
  - `moonstormstaticcapturable_targeted` – when the first targeter is added.  
  - `moonstormstaticcapturable_untargeted` – when the last targeter is removed.  
  - `moonstormstatic_caught` (on the `doer` entity) – when caught (via `doer:PushEvent`).
