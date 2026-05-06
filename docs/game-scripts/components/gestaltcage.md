---
id: gestaltcage
title: Gestaltcage
description: Manages the capture and containment of gestalt entities by players.
tags: [capture, entity, containment]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: 71e0d6e0
system_scope: entity
---

# Gestaltcage

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`GestaltCage` handles the mechanics of capturing gestalt entities and converting them into filled cage prefabs. It validates capture conditions, retrieves the owner's position, removes itself from the world, and spawns the appropriate filled cage variant based on the target's level and planar state. This component works in conjunction with `GestaltCapturable` to manage the targeting and capture lifecycle.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("gestaltcage")

-- Target a gestalt entity for capture
inst.components.gestaltcage:OnTarget(gestalt_entity)

-- Attempt to capture the targeted gestalt
local success, reason = inst.components.gestaltcage:Capture(gestalt_entity, player)

-- Clear target when done
inst.components.gestaltcage:OnUntarget()
```

## Dependencies & tags
**Components used:**
- `gestaltcapturable` -- checks enable state, level, and planar status; calls OnCaptured/OnTargeted/OnUntargeted
- `inventoryitem` -- retrieves grand owner for position calculation via GetGrandOwner()

**Tags:**
- None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The entity instance that owns this component. |
| `target` | entity | `nil` | The currently targeted gestalt entity. Cleared on capture or manual untarget. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleanup handler called when the component is removed from its entity. Automatically clears any active target relationship.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `Capture(target, doer)`
* **Description:** Attempts to capture the target gestalt entity. Validates target existence, proximity, and capturable state. On success, spawns a filled cage prefab at the owner's position with matching rotation and planar state, then removes this entity from the world.
* **Parameters:**
  - `target` -- entity instance of the gestalt to capture
  - `doer` -- entity instance performing the capture (typically a player)
* **Returns:** `true` on success, or `false, "MISSED"` on failure
* **Error states:** None. Returns failure tuple for invalid conditions rather than erroring.

### `OnTarget(target)`
* **Description:** Sets the component's target to the specified gestalt entity. Clears any previous target before assigning the new one. Registers the instance as a targeter with the target's `gestaltcapturable` component.
* **Parameters:** `target` -- entity instance to target, or nil to clear
* **Returns:** nil
* **Error states:** None. Gracefully handles nil or invalid targets via internal validity checks.

### `OnUntarget(target)`
* **Description:** Removes the targeting relationship with the specified target. If no target is specified, clears the current target. Notifies the target's `gestaltcapturable` component that this instance is no longer targeting it.
* **Parameters:** `target` -- entity instance to untarget, or nil to clear current target
* **Returns:** nil
* **Error states:** None. Gracefully handles nil or invalid targets via internal validity checks.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.