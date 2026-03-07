---
id: alterguardianhatshard
title: Alterguardianhatshard
description: A portable light-emitting storage container that holds a single Mushroom Spore and adjusts its light colour and appearance based on the spore type.
tags: [light, storage, spore, container]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c29c2a7b
system_scope: inventory
---

# Alterguardianhatshard

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `alterguardianhatshard` prefab represents a lightweight, portable container that stores one Mushroom Spore. It functions as a light source whose colour dynamically matches the stored spore (Red, Green, or Blue). When held, the light disables; when dropped, the light activates if a spore is present. The prefab also includes an associated symbol-following FX version used for visual effects (e.g., by Winona battery).

This prefab integrates with the `container`, `inventoryitem`, and `preserver` components. It listens for `itemget` and `itemlose` events to update its light state and colour when items are added or removed.

## Usage example
```lua
local shard = SpawnPrefab("alterguardianhatshard")
shard.components.container:GetItemInSlot(1) -- returns current spore, if any
shard.components.preserver:SetPerishRateMultiplier(0) -- prevents spore spoilage
shard.components.container:Open(player) -- opens the container UI
```

## Dependencies & tags
**Components used:** `inventoryitem`, `container`, `preserver`, `tradable`, `inspectable`, `light`, `animstate`, `transform`, `follower`, `network`  
**Tags added:** `fulllighter`, `lightcontainer`, `portablestorage`, `FX`, `NOCLICK` (for FX variant)  
**Tags checked:** None explicitly checked via `HasTag`; `IsHeld()` is used via `inventoryitem`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_shardcolour` | string or `nil` | `nil` | Stores the current spore colour suffix (`"_red"`, `"_green"`, `"_blue"`) or `nil` if empty. Used for image name generation. |
| `colour` | string or `nil` | `nil` | Stores short colour code (`"r"`, `"g"`, `"b"`) — defined in `SetShardColour` but not used by other methods. |

## Main functions
### `UpdateInventoryImage(inst)`
*   **Description:** Updates the inventory item image name based on the container's open state and current shard colour. Called whenever the spore is updated or the container is opened/closed.
*   **Parameters:** `inst` (entity) — the entity instance.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling — assumes `container` and `inventoryitem` components exist.

### `Bounce(inst)`
*   **Description:** Triggers a bounce animation if the item is not held; otherwise plays idle. Updates the inventory image afterwards.
*   **Parameters:** `inst` (entity) — the entity instance.
*   **Returns:** Nothing.

### `OnPutInInventory(inst)`
*   **Description:** Callback invoked when the shard is placed in an inventory. Closes the container and disables the light.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnDropped(inst)`
*   **Description:** Callback invoked when the shard is dropped. Re-enables the light if a spore is present (`_shardcolour ~= nil`).
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `UpdateLightState(inst)`
*   **Description:** Adjusts the light colour, bloom, and mult colour based on the spore type in slot 1. Enables light only when dropped and container non-empty; disables when empty or held.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `SetShardColour(inst, colour)`
*   **Description:** Sets the animation mult colour to match the spore colour.
*   **Parameters:**  
    * `inst` (entity) — the entity instance.  
    * `colour` (string) — `"r"`, `"g"`, or `"b"` (case-sensitive).  
*   **Returns:** Nothing.

### `SetupFxFromHatShard(inst, shard)`
*   **Description:** Helper to propagate shard's spore colour to an associated FX entity (e.g., symbol follower).
*   **Parameters:**  
    * `inst` (entity) — the FX entity to update.  
    * `shard` (entity) — the source `alterguardianhatshard` instance.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `itemget`, `itemlose` — triggers `UpdateLightState` to update visual state when a spore is added or removed from the container.
- **Pushes:** No events are explicitly pushed by this component itself. (Relies on component events like `container.open`, `inventoryitem.imagelist`.)

Note: The `container` and `inventoryitem` components push numerous events (e.g., `onopen`, `onclose`, `imagechange`), but this file does not register listeners for them beyond its own logic (e.g., `onopenfn`, `ondropfn` are assigned).