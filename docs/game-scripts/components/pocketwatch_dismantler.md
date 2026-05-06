---
id: pocketwatch_dismantler
title: Pocketwatch Dismantler
description: Manages the dismantling logic for pocketwatch items, converting them back into their recipe ingredients.
tags: [crafting, inventory, items]
sidebar_position: 10
last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: components
source_hash: ec1ffb55
system_scope: inventory
---

# Pocketwatch Dismantler

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`PocketWatch_Dismantler` provides the logic for dismantling pocketwatch items back into their constituent recipe ingredients. This component is typically added to pocketwatch prefabs and works alongside `inventoryitem`, `lootdropper`, `rechargeable`, and `itemmimic` components. It validates dismantling conditions including cooldown status and doer qualifications before processing the item conversion.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("pocketwatch_dismantler")
inst:AddComponent("inventoryitem")
inst:AddComponent("lootdropper")

local can_dismantle, reason = inst.components.pocketwatch_dismantler:CanDismantle(target, doer)
if can_dismantle then
    inst.components.pocketwatch_dismantler:Dismantle(target, doer)
end
```

## Dependencies & tags
**Components used:**
- `rechargeable` -- checks `IsCharged()` to validate cooldown status
- `inventoryitem` -- calls `GetGrandOwner()` to find the item owner
- `itemmimic` -- calls `TurnEvil()` if target is a mimic item
- `lootdropper` -- calls `GetFullRecipeLoot()` and `SpawnLootPrefab()` for ingredient spawning
- `inventory` -- used as receiver for returned items
- `container` -- alternative receiver for returned items
- `soundemitter` -- calls `PlaySound()` on doer when dismantling mimic items

**Tags:**
- `clockmaker` -- checked on doer; required to perform dismantling
- `pocketdimension_container` -- checked on owner; affects item receiver logic

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | `nil` | The entity instance that owns this component. |

## Main functions
### `CanDismantle(target, doer)`
* **Description:** Validates whether a target item can be dismantled by the given doer. Checks rechargeable cooldown status and verifies the doer has the clockmaker tag.
* **Parameters:**
  - `target` -- entity instance of the item to dismantle
  - `doer` -- entity instance attempting the dismantling action
* **Returns:** Boolean `true` if dismantling is allowed, or `false` with optional string reason `"ONCOOLDOWN"` if on cooldown.
* **Error states:** Errors if `doer` is nil when calling `doer:HasTag()` -- no nil guard present. The `rechargeable` component check includes a nil guard and will not error if missing.

### `Dismantle(target, doer)`
* **Description:** Performs the actual dismantling operation. For item mimics, triggers the reveal transformation. For regular items, spawns recipe ingredients as loot and removes the target entity. Plays a sound effect for mimic items.
* **Parameters:**
  - `target` -- entity instance of the item to dismantle
  - `doer` -- entity instance performing the dismantling action
* **Returns:** None
* **Error states:** Errors if `target` lacks `inventoryitem` component (nil dereference on `target.components.inventoryitem:GetGrandOwner()` -- no guard present), or if `target` lacks `lootdropper` component when not an item mimic (nil dereference on `target.components.lootdropper:GetFullRecipeLoot()`). Errors if `AllRecipes[target.prefab]` is nil when accessing recipe data. Errors if `doer` is nil when accessing `doer.Transform` (no guard in non-mimic branch); `doer.SoundEmitter` access is guarded by `if doer and doer.SoundEmitter then`.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.