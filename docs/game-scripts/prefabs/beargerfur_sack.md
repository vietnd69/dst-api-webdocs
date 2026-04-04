---
id: beargerfur_sack
title: Beargerfur Sack
description: Defines the Bearger Fur Sack prefab, a portable storage container that preserves perishable items.
tags: [inventory, storage, preservation, prefab, entity]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: root
source_hash: 7c31afa5
system_scope: inventory
---

# Beargerfur Sack

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
The `beargerfur_sack` script defines the prefab for a portable storage entity that functions similarly to a backpack but includes food preservation capabilities. It configures a `container` component for item storage, a `preserver` component to reduce perish rates, and manages visual frost effects and audio cues when opened. This file also defines the accompanying frost visual effect prefab `beargerfur_sack_frost_fx`.

## Usage example
```lua
-- Spawn the sack into the world
local sack = SpawnPrefab("beargerfur_sack")

-- Access components to modify behavior
sack.components.preserver:SetPerishRateMultiplier(0.5)
sack.components.container:Open(ThePlayer)

-- Check if it is currently held by a player
local is_held = sack.components.inventoryitem:IsHeld()
```

## Dependencies & tags
**Components used:** `container`, `preserver`, `inventoryitem`, `inspectable`, `transform`, `animstate`, `soundemitter`, `minimapentity`, `network`, `follower`.
**Tags:** Adds `portablestorage` to the main entity; adds `FX`, `NOCLICK`, `NOBLOCK` to the frost effect entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_sounds` | table | `sounds` | Internal table storing open and close sound paths. |
| `_frostfx` | entity | `nil` | Reference to the spawned frost effect entity. |
| `_opentask` | task | `nil` | Scheduled task handle for toggling frost effects. |
| `_startsoundtask` | task | `nil` | Scheduled task handle for delaying sound playback. |
| `_soundent` | entity | `nil` | Reference to the entity emitting the open loop sound. |
| `_killtask` | task | `nil` | Scheduled task handle for removing the frost effect. |

## Main functions
### `OnOpen(inst)`
*   **Description:** Callback assigned to `container.onopenfn`. Plays open animation, changes inventory image to open state, and triggers frost effects and sound.
*   **Parameters:** `inst` (entity) - The sack entity instance.
*   **Returns:** Nothing.
*   **Error states:** Cancels existing open tasks to prevent duplicate effects.

### `OnClose(inst)`
*   **Description:** Callback assigned to `container.onclosefn`. Plays close animation, resets inventory image, stops sounds, and removes frost effects.
*   **Parameters:** `inst` (entity) - The sack entity instance.
*   **Returns:** Nothing.

### `OnPutInInventory(inst)`
*   **Description:** Callback assigned to `inventoryitem.onputininventoryfn`. Ensures frost effects are removed and container is closed when picked up.
*   **Parameters:** `inst` (entity) - The sack entity instance.
*   **Returns:** Nothing.

### `ToggleFrostFX(inst, start, remove)`
*   **Description:** Internal utility to spawn or kill the frost visual effect attached to the sack.
*   **Parameters:** `inst` (entity) - The sack entity. `start` (boolean) - Whether to spawn the effect. `remove` (boolean) - Whether to completely remove the entity.
*   **Returns:** Nothing.

### `FX_Kill(inst)`
*   **Description:** Method on the frost effect prefab. Initiates the kill animation sequence.
*   **Parameters:** `inst` (entity) - The frost effect entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `container` open/close state changes via `onopenfn` and `onclosefn` hooks.
- **Pushes:** Relies on `container` component to push `onopen` and `onclose` events to listeners.