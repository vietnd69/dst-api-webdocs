---
id: winona_holoitems
title: Winona Holoitems
description: Creates and manages networked holographic placeholder prefabs for Winona's holographic items, handling visual states, lifecycle, and interaction with inventory components.
tags: [inventory, hologram, winona, client, prefabs]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 18a62a27
system_scope: inventory
---

# Winona Holoitems

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`winona_holoitems.lua` defines a reusable factory (`MakeHoloItem`) for creating holographic placeholder prefabs used by Winona’s crafting items (e.g., machine parts, teleport pads, recipescanner). These prefabs act as visual indicators in the world during crafting, with dedicated client-side animation entities (`_anim`) that respond to inventory state changes (dropped, held, or removed). The implementation separates client and master logic: the client-side entity is non-persistent and forwards interaction to its parent, while the master-side entity manages state transitions, inventory hooks, and replication of animation state via `net_tinybyte`.

## Usage example
```lua
local winona_holoitems = require "prefabs/winona_holoitems"

-- Example: Accessing one of the prefabs returned by the module
local holo_recipescanner = CreatePrefab("winona_recipescanner")
-- This prefab is automatically configured with inventory, projected effects, and client animation logic.
```

## Dependencies & tags
**Components used:** `projectedeffects`, `inventoryitem`, `stackable`, `recipescanner`, `inspectable`  
**Tags added/used:** `CLASSIFIED`, `client_forward_action_target`, `NOBLOCK`, `FX`, `NOCLICK`, `recipescanner`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_BANK` | string | `nil` | Animation bank name for the client-side hologram. |
| `_BUILD` | string | `nil` | Build name for the client-side hologram (overrides default). |
| `_ANIM` | string | `nil` | Animation name for the client-side hologram. |
| `_ERODEPARAM` | number | `nil` | Erosion parameter for `projectedeffects` on the hologram. |
| `_anim` | entity | `nil` | Client-side holographic entity instance. |
| `_animstate` | net_tinybyte | `nil` | Networked animation state (values: `NONE`, `DROPPED`, `KILLED`). |
| `_owner` | entity | `nil` | Owner entity when attached to inventory. |
| `_onremoveowner` | function | `nil` | Callback registered when owner is removed. |
| `_inittask` | task | `nil` | Task used to remove the item immediately after creation (mastersim only). |
| `_killtask` | task | `nil` | Task scheduled to trigger `KillItem` after dropped timeout (10s default). |
| `SCANNABLE_RECIPENAME` | string | `nil` | Recipe name associated with the item for recipe scanning. |

## Main functions
### `MakeHoloItem(name, anim, bank, build, erodeparam, invimg, common_postinit, master_postinit)`
* **Description:** Factory function returning a Prefab definition for a holographic item. Handles setup of both client and master entities, including inventory hooks, animation state replication, and projected effects.  
* **Parameters:**  
  - `name` (string) — prefab name (e.g., `"winona_machineparts_1"`).  
  - `anim` (string) — animation name for the client-side hologram.  
  - `bank` (string?) — optional animation bank name (defaults to `winona_holoitems`).  
  - `build` (string?) — optional build name (used to load custom assets).  
  - `erodeparam` (number?) — erosion parameter passed to `projectedeffects`.  
  - `invimg` (string?) — inventory image asset name (overrides default).  
  - `common_postinit` (function?) — per-instance postinit hook for both client and master.  
  - `master_postinit` (function?) — per-instance postinit hook for master-only logic (e.g., adding components).  
* **Returns:** `Prefab` — A prefab definition ready for use in the prefabs list.  
* **Error states:** None documented; always returns a valid Prefab.

### `InitClientAnim(inst)`
* **Description:** Creates and attaches a non-persistent client-side hologram entity (via `CreateAnim`) as a child of the parent item. Enables client-side interaction forwarding.  
* **Parameters:** `inst` (entity) — the holographic item instance (mastersim or client).  
* **Returns:** Nothing.  

### `KillClientAnim(inst, instant)`
* **Description:** Removes or deactivates the client-side hologram. If `instant` is true, immediately removes it; otherwise, transitions it to a fading FX entity.  
* **Parameters:**  
  - `inst` (entity) — the holographic item instance.  
  - `instant` (boolean) — whether to remove immediately (`true`) or decay (`false`).  
* **Returns:** Nothing.  

### `OnAnimState_Client(inst)`
* **Description:** Client-side listener for `_animstate` changes. Triggers `InitClientAnim` or `KillClientAnim` based on state value (`DROPPED`, `KILLED`, or `NONE`).  
* **Parameters:** `inst` (entity) — the item instance.  
* **Returns:** Nothing.  

### `SetItemClassifiedOwner(inst, owner)`
* **Description:** Assigns the classified owner for network replication and updates the animation state if the owner has an HUD. Cancels the initial removal task (`_inittask`).  
* **Parameters:**  
  - `inst` (entity) — the holographic item instance.  
  - `owner` (entity?) — the new owner (player or item container).  
* **Returns:** Nothing.  

### `OnPutInInventory(inst, owner)`
* **Description:** Called when the item is placed into inventory. Resets animation state to `NONE`, updates HUD visuals, and cancels pending removal/kill tasks. Removes old `onremove` listener if present.  
* **Parameters:**  
  - `inst` (entity) — the item instance.  
  - `owner` (entity) — the inventory/container owner.  
* **Returns:** Nothing.  

### `KillItem(inst)`
* **Description:** Marks the item as killed by setting `_animstate` to `KILLED` and schedules self-removal in 0.5s. Adds tags `NOCLICK` and `FX`.  
* **Parameters:** `inst` (entity) — the item instance.  
* **Returns:** Nothing.  

### `OnDropped(inst)`
* **Description:** Called when the item is dropped. Sets `_animstate` to `DROPPED`, listens for owner removal, and schedules `KillItem` in 10 seconds. Updates classified target.  
* **Parameters:** `inst` (entity) — the item instance.  
* **Returns:** Nothing.  

### `parts_master_postinit(inst)`
* **Description:** Adds `stackable` component and sets `maxsize` to `TUNING.STACK_SIZE_LARGEITEM`. Used for machine parts (e.g., `winona_machineparts_1/2`).  
* **Parameters:** `inst` (entity) — the item instance.  
* **Returns:** Nothing.  

### `holotele_OnRecipeScanned(inst, data)`
* **Description:** Called when a teleportation device (holotelepad/telebrella) is scanned. Immediately removes the item if held; otherwise kills it (without delay).  
* **Parameters:**  
  - `inst` (entity) — the item instance.  
  - `data` (table) — scan metadata (unused).  
* **Returns:** Nothing.  

### `recipescanner_OnScanned(inst, target, doer, recipe)`
* **Description:** Called when the recipescanner is used to scan an item. Teaches the recipe to the doer and removes the scanner item.  
* **Parameters:**  
  - `inst` (entity) — the recipescanner item instance.  
  - `target` (entity) — the scanned item.  
  - `doer` (entity) — the player/item doing the scanning.  
  - `recipe` (string) — recipe name learned.  
* **Returns:** Nothing.  

## Events & listeners
- **Listens to:**  
  - `animstatedirty` (client-only) — triggers `OnAnimState_Client`.  
  - `onremove` — attached to owner in `OnDropped` to clean up item when owner is removed.  
  - `onrecipescanned` — used by teleport items to react to scanning.  
- **Pushes:** None directly (but relies on `SetOnPutInInventoryFn`/`SetOnDroppedFn` callbacks from `inventoryitem`).