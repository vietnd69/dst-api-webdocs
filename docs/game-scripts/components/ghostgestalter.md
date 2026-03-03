---
id: ghostgestalter
title: Ghostgestalter
description: Manages activation flags and mutation logic for ghost entities in the world.
tags: [ghost, activation, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 8e806889
system_scope: entity
---

# Ghostgestalter

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Ghostgestalter` is a lightweight component responsible for tracking activation state flags on ghost-type entities and enabling a custom mutation callback. It supports four activation types—standing, quick, force-right-click, and force-no-pickup—and maintains corresponding tags for state synchronization. This component is typically attached to ghost-related prefabs that require dynamic activation behavior and modifiable mutation logic.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("ghostgestalter")

inst.components.ghostgestalter:SetOnActivate(function(inst, doer)
    -- Custom activation logic
    print("Ghost activated by", doer and doer.name or "unknown")
end)

inst.components.ghostgestalter:SetMutateFunction(function(inst, doer)
    -- Custom mutation logic
    return true
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds/removes: `quickactivation`, `standingactivation`, `activatable_forceright`, `activatable_forcenopickup`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance owning this component. |
| `OnActivate` | function or `nil` | `nil` | Callback invoked on activation; signature: `fn(inst, doer)`. |
| `standingaction` | boolean | `false` | Flag indicating if standing activation is enabled. |
| `quickaction` | boolean | `false` | Flag indicating if quick activation is enabled. |
| `forcerightclickaction` | boolean | `false` | Flag indicating if force-right-click activation is enabled. |
| `forcenopickupaction` | boolean | `false` | Flag indicating if force-no-pickup activation is enabled. |
| `domutatefn` | function or `nil` | `nil` | Optional mutation function; signature: `fn(inst, doer)` returning `true`/`false`/`nil`. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up tags when the component is removed from an entity.
* **Parameters:** None.
* **Returns:** Nothing.

### `DoMutate(doer)`
* **Description:** Invokes the optional mutation function (`domutatefn`) if set.
* **Parameters:** `doer` (Entity or `nil`) — the entity triggering the mutation.
* **Returns:** The return value of `domutatefn` if defined, otherwise `nil`.

## Events & listeners
- **Listens to:** N/A  
- **Pushes:** N/A
