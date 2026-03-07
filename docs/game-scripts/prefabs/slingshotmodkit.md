---
id: slingshotmodkit
title: Slingshotmodkit
description: A consumable item that allows the player to open the Slingshot Modding interface for compatible slingshots.
tags: [crafting, ui, inventory, tool]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 638e5701
system_scope: crafting
---

# Slingshotmodkit

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `slingshotmodkit` prefab implements a consumable item used to initiate the Slingshot Modding interface. It integrates with the `useabletargeteditem`, `slingshotmodder`, and `slingshotmods` components to provide a targeted, skill-gated interaction flow: when used on a compatible slingshot, it triggers the modding UI if the user has the required skill and owns the slingshot.

## Usage example
```lua
local inst = SpawnPrefab("slingshotmodkit")
-- Automatically equipped and usable via inventory
-- When used on a slingshot with slingshotmods component:
-- 1. slingshotmods:CanBeOpenedBy(doer) validates access
-- 2. slingshotmodder:StartModding(target, user) opens the mod UI if valid
```

## Dependencies & tags
**Components used:** `useabletargeteditem`, `slingshotmodder`, `inspectable`, `inventoryitem`  
**Tags:** `slingshotmodkit`, `useabletargeteditem_mounted`

## Properties
No public properties.

## Main functions
### `OnUsed(inst, target, user)`
* **Description:** Invoked when the mod kit is used on a target entity. Delegates to `slingshotmodder:StartModding()` to validate and open the modding UI. Automatically resets the "in use" state via `ResetInUse`.
* **Parameters:**  
  - `inst` (entity) – the slingshot mod kit instance.  
  - `target` (entity) – the target slingshot to mod.  
  - `user` (entity) – the player using the kit.  
* **Returns:** `success` (boolean), `reason` (string or nil) – returned by `slingshotmodder:StartModding()`.  
* **Error states:** Returns `false, "NOT_MINE"` if the slingshot is owner-restricted and owned by a different user.

### `UseableTargetedItem_ValidTarget(inst, target, doer)`
* **Description:** Predicate function used by `useabletargeteditem` to determine if `target` is a valid candidate for modding. Checks for existence of the `slingshotmods` component and whether it allows opening by the `doer`.
* **Parameters:**  
  - `inst` (entity) – the mod kit instance.  
  - `target` (entity) – candidate target entity.  
  - `doer` (entity) – the player attempting to use the mod kit.  
* **Returns:** `boolean` – `true` if the target has `slingshotmods` component and `slingshotmods:CanBeOpenedBy(doer)` returns `true`.

### `ResetInUse(inst)`
* **Description:** Immediately stops the "in use" state after modding completes. Ensures the item does not remain locked in an active state.
* **Parameters:** `inst` (entity) – the mod kit instance.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.  
- **Pushes:** None.