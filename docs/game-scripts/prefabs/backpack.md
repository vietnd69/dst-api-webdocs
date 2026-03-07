---
id: backpack
title: Backpack
description: Manages equippable storage behavior with skin-specific visual FX and inventory interaction.
tags: [inventory, equipment, visualfx]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3db024ee
system_scope: inventory
---

# Backpack

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `backpack` prefab implements a wearable inventory container with support for skin-specific visual follow effects (e.g., animation-synced FX attached to the owner during equipping). It integrates closely with the `equippable`, `container`, `burnable`, and `inventoryitem` components. It serves as a core wearable item in the game's crafting and inventory systems, opening its container UI when equipped and managing its visual representation (including skin overrides and follow FX) on equip/unequip.

## Usage example
```lua
local backpack = SpawnPrefab("backpack")
backpack.Transform:SetPosition(inst.Transform:GetWorldPosition())
inst.components.inventory:AddItem(backpack, true)

-- When equipped, the backpack's container opens and skin follow FX attach to the owner
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `equippable`, `container`, `burnable`, `propagator`, `highlightchild`, `colouradder`, `bloomer`, `follower`  
**Tags:** Adds `backpack` and `FX` (for `backpack_swap_fx` sub-prefab); no tag removal or checking logic in core code.

## Properties
No public properties are initialized directly on the `backpack` entity instance beyond component internal states. Skin-related behavior is exposed via callbacks in `inst.backpack_skin_fns` (modder-extendable).

## Main functions
The `backpack` prefab is primarily a data-driven entity defined via its `fn()` constructor. Custom behavior is exposed through callback hooks and event listeners. Key internal functions:

### `onequip(inst, owner)`
*   **Description:** Invoked when the backpack is equipped. Sets up skin overrides, attaches follow FX, and opens the container to the owner.
*   **Parameters:**  
    `inst` (entity) – The backpack entity.  
    `owner` (entity) – The entity equipping the backpack.  
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Invoked when the backpack is unequipped. Detaches follow FX, reattaches idle FX, clears animation overrides, and closes the container.
*   **Parameters:**  
    `inst` (entity) – The backpack entity.  
    `owner` (entity) – The entity unequipping the backpack.  
*   **Returns:** Nothing.

### `onburnt(inst)`
*   **Description:** Called when the backpack is fully burnt. Drops all container contents, closes the container, spawns an `ash` prefab, and removes the backpack.
*   **Parameters:** `inst` (entity) – The backpack entity.  
*   **Returns:** Nothing.

### `onignite(inst)`
*   **Description:** Called when the backpack is ignited. Disables container opening by setting `canbeopened = false`.
*   **Parameters:** `inst` (entity) – The backpack entity.  
*   **Returns:** Nothing.

### `onextinguish(inst)`
*   **Description:** Called when the backpack is extinguished. Re-enables container opening by setting `canbeopened = true`.
*   **Parameters:** `inst` (entity) – The backpack entity.  
*   **Returns:** Nothing.

### `OnBackpackSkinChanged(inst, skin_build)`
*   **Description:** Handler called when the backpack’s skin changes. Resets and reinitializes all follow FX (idle and equip). Removes old FX and recreates them with the new skin build.
*   **Parameters:**  
    `inst` (entity) – The backpack entity.  
    `skin_build` (string or nil) – The new skin build name.  
*   **Returns:** Nothing.

### `ForEachSkinFollowFx(inst, cb, ...)`
*   **Description:** Utility to iterate over all active skin follow FX (idle and equipped). Useful for applying changes en masse (e.g., colour/bloom updates).
*   **Parameters:**  
    `inst` (entity) – The backpack entity.  
    `cb` (function) – Callback invoked with signature `cb(inst, fx, ...)`.  
    `...` (any) – Additional arguments passed to `cb`.  
*   **Returns:** Nothing.

### `OnSave(inst, data)` and `OnLoad(inst, data, ents)`
*   **Description:** Serialization hooks delegated to `inst.backpack_skin_fns.onsave` and `inst.backpack_skin_fns.onload` if present. Allows modded skins to persist/restore state.
*   **Parameters:**  
    `inst` (entity) – The backpack entity.  
    `data` (table) – Serialization table.  
    `ents` (table, only in `OnLoad`) – Entity mapping.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
    `equipskinneditem` (pushed via `owner:PushEvent(...)`)  
    `unequipskinneditem` (pushed via `owner:PushEvent(...)`)  
    `onremove` – used internally via `ListenForEvent` in `Bloomer.AttachChild`/`DetachChild` to clean up colour/bloom attachments.  
- **Pushes:**  
    `equipskinneditem` with `inst:GetSkinName()` when equipped with a skin.  
    `unequipskinneditem` with `inst:GetSkinName()` when unequipped with a skin.  
    `onclose` – fired via `Container.Close(...)`.  
- **Component-internal listeners:**  
    `colouradder` and `bloomer` components listen for `onremove` on FX entities to detach cleanly.

