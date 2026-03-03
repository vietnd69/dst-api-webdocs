---
id: fillable
title: Fillable
description: Manages the logic for transforming an empty container or vessel into a filled version when interacting with a water source.
tags: [inventory, item, interaction, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: cbbd2f69
system_scope: inventory
---

# Fillable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Fillable` enables an entity to be converted into a new prefab (typically a "filled" version) when acted upon, typically via interaction with a `watersource`. It is commonly used for items like buckets or bottles that become "water bucket" or "water bottle" upon filling. The component adds the `fillable` tag to its entity and dynamically manages action visibility tags (`fillable_showoceanaction`, `allow_action_on_impassable`) via the `showoceanaction` property.

It integrates with `watersource`, `inventory`, `container`, and `stackable` components during the fill operation to handle usage of water, owner tracking, and stack management.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fillable")
inst.components.fillable.filledprefab = "bucket_filled"
inst.components.fillable.acceptsoceanwater = true
inst.components.fillable.showoceanaction = true
```

## Dependencies & tags
**Components used:** `watersource`, `inventoryitem`, `inventory`, `container`, `stackable`  
**Tags:** Adds `fillable`, `fillable_showoceanaction`, `allow_action_on_impassable` (dynamically); removes all three on component removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `filledprefab` | string or `nil` | `nil` | Prefab name to spawn when filling succeeds. If `nil`, `Fill()` returns `false`. |
| `acceptsoceanwater` | boolean | `false` | Whether ocean water is accepted as a valid source. (Currently unused in logic — may be reserved for future use or used externally.) |
| `showoceanaction` | boolean | `false` | Controls whether the entity should display special ocean interaction actions (`fillable_showoceanaction`, `allow_action_on_impassable`). Also triggers tag updates via `onshowoceanaction` callback. |
| `overrideonfillfn` | function or `nil` | `nil` | Optional custom callback (`fn(inst, from_object)`) to define custom fill behavior. If set, overrides the default `Fill()` logic after `watersource:Use()` is called. |

## Main functions
### `Fill(from_object)`
* **Description:** Attempts to fill the entity using `from_object` as the water source. Converts the current entity into the `filledprefab` item. Handles removal of the original entity, transfer of ownership, and proper positioning.
* **Parameters:** `from_object` (Entity or `nil`) — the entity providing water (e.g., a bucket near a pond or ocean).
* **Returns:** `true` on success, `false` if filling fails (e.g., no `filledprefab`, no valid `watersource`, or spawn failure).
* **Error states:** Returns `false` if `from_object` lacks a `watersource` component, or if `SpawnPrefab(filledprefab)` returns `nil`. Also returns `false` if `filledprefab` is `nil`. When `overrideonfillfn` is set, its return value is passed through.

### `OnRemoveFromEntity()`
* **Description:** Cleanup function invoked when the component is removed from its entity. Removes all associated tags added by the component.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.

## Notes
- The `filledprefab` must be a valid, world-spawnable prefab; it is spawned via `SpawnPrefab`, not instantiated from an existing entity.
- When an owner exists (via `inventoryitem:GetGrandOwner()`), the filled item is given directly to the owner’s inventory or container.
- When no owner exists, the filled item is spawned at the original entity’s world position, and the original entity is removed.
- If the original item is part of a stack (`stackable:IsStack()`), `stackable:Get()` is used to detach one item from the stack before removal, preserving the rest of the stack.
