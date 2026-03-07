---
id: activatable
title: Activatable
description: Manages activation state and behavior for entities, including activation conditions, state tags, and callback execution.
tags: [activation, state, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f0588a20
system_scope: entity
---

# Activatable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Activatable` component controls whether an entity can be activated (e.g., via interaction or input) and tracks its activation-related state. It exposes flags that determine activation behavior (e.g., whether activation is currently disabled, requires standing, or is force-enabled) and maps these flags to entity tags. It also supports custom activation logic via callbacks (`OnActivate`, `CanActivateFn`) and notifies the system when activation occurs.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("activatable")

inst.components.activatable.OnActivate = function(inst, doer)
    -- custom activation logic here
    print(inst.prefab .. " was activated by " .. doer.prefab)
    return true
end

inst.components.activatable.CanActivateFn = function(inst, doer)
    return not doer:HasTag("sleeping"), "cannot activate while sleeping"
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds/removes `inactive`, `quickactivation`, `standingactivation`, `activatable_forceright`, `activatable_forcenopickup`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `OnActivate` | function | `nil` | Callback executed when `DoActivate()` is called successfully. Signature: `fn(inst, doer) → success, msg`. |
| `CanActivateFn` | function | `nil` | Optional predicate to override `CanActivate()` logic. Signature: `fn(inst, doer) → success, msg`. |
| `inactive` | boolean | `true` | Whether the entity is currently inactive (activation disabled). |
| `standingaction` | boolean | `false` | Whether the entity requires the actor to be standing to activate. |
| `quickaction` | boolean | `false` | Whether the entity supports quick activation (e.g., skip animations). |
| `forcerightclickaction` | boolean | `false` | Whether right-click activation is forced on this entity. |
| `forcenopickupaction` | boolean | `false` | Whether pickup is forbidden during activation. |

## Main functions
### `CanActivate(doer)`
*   **Description:** Determines whether the entity can be activated by the specified actor. Defaults to returning `not self.inactive`, but delegates to `CanActivateFn` if present.
*   **Parameters:** `doer` (entity instance) - the entity attempting activation.
*   **Returns:** `success` (boolean) and optional `msg` (string) explaining why activation failed.
*   **Error states:** None.

### `DoActivate(doer)`
*   **Description:** Attempts to execute the activation callback. Sets `inactive` to `false`, invokes `OnActivate`, and pushes an `onactivated` event if successful.
*   **Parameters:** `doer` (entity instance) - the entity performing activation.
*   **Returns:** `success` (boolean) and optional `msg` (string) from `OnActivate`, or `nil` if `OnActivate` is not set.
*   **Error states:** Returns `nil` immediately if `self.OnActivate` is `nil`.

### `GetDebugString()`
*   **Description:** Returns a simple debug representation of the `inactive` state.
*   **Parameters:** None.
*   **Returns:** `string` — `"true"` if `inactive` is `true`, `"false"` otherwise.

### `OnRemoveFromEntity()`
*   **Description:** Cleanup method called when the component is removed from an entity. Removes all activation-related tags.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Pushes:** `onactivated` — fired when `DoActivate()` succeeds. Data payload: `{doer = doer}` (entity that activated).
