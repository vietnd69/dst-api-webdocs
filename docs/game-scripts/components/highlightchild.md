---
id: highlightchild
title: Highlightchild
description: Manages the highlighting of an entity when it is associated with a specific owner entity, primarily for visual feedback in non-dedicated server environments.
tags: [visual, owner, highlight]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6115137f
system_scope: entity
---

# Highlightchild

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`HighlightChild` is a lightweight component that binds an entity (typically a visual effect or child object) to an owner entity for highlighting purposes. When an owner is assigned, the child entity is added to the owner's `highlightchildren` list and its visual appearance is modified using `AnimState:SetHighlightColour()`. The component is only active on non-dedicated servers and syncs the owner across the network via a replicated property (`syncowner`). It also supports optional callbacks when the owner changes.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("highlightchild")
inst.components.highlightchild:SetOwner(some_owner_entity)
inst.components.highlightchild:SetOnChangeOwnerFn(function(child_inst, new_owner)
    -- custom logic when owner changes
end)
```

## Dependencies & tags
**Components used:** None (uses `AnimState` via `self.inst.AnimState` — assumes the entity already has this component).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `TheNet:GetClient() or TheNet:GetServer()` reference | (inherited) | Reference to the entity instance this component is attached to. |
| `owner` | `entity` or `nil` | `nil` | The entity that owns this highlight child; used to manage highlight state. |
| `syncowner` | `net_entity` or `nil` | `nil` | Networked property for owner synchronization (only present if `inst.Network ~= nil`). |
| `onchangeownerfn` | function or `nil` | `nil` | Optional callback invoked when the owner changes. |

## Main functions
### `OnRemoveEntity()`
*   **Description:** Removes the entity from the current owner's `highlightchildren` list when the entity is being removed. Prevents dangling references.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetOwner(owner)`
*   **Description:** Sets the owner entity for this highlight child. Updates the owner list, applies/removes highlight visuals, and replicates the change across the network.
*   **Parameters:** `owner` (`entity` or `nil`) — the entity to assign as owner, or `nil` to clear.
*   **Returns:** Nothing.

### `SetOnChangeOwnerFn(fn)`
*   **Description:** Registers a callback function to be invoked whenever the owner changes.
*   **Parameters:** `fn` (`function`) — function with signature `(child_inst, owner)`, where `child_inst` is the entity instance and `owner` is the new owner.
*   **Returns:** Nothing.

### `OnChangeOwner(owner)`
*   **Description:** Internal handler that updates visual highlight state and owner tracking. Runs only on non-dedicated servers.
*   **Parameters:** `owner` (`entity` or `nil`) — the new owner entity.
*   **Returns:** Nothing.
*   **Error states:** Does nothing on dedicated servers. Removes the highlight colour and unregisters from the old owner if an owner previously existed.

## Events & listeners
- **Listens to:** `syncownerdirty` — triggers `OnSyncOwnerDirty()` on clients to update owner when the server modifies the replicated `syncowner` property.
- **Pushes:** None identified.
