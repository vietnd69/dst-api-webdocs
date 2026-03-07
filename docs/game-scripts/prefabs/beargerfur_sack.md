---
id: beargerfur_sack
title: Beargerfur Sack
description: A portable storage container that preserves items and emits frost effects when open on the ground.
tags: [inventory, container, storage, preservation, fx]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7c31afa5
system_scope: inventory
---

# Beargerfur Sack

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `beargerfur_sack` prefab is a portable storage item that functions as a container with preservation properties. It automatically emits frost particle effects when placed on the ground and opened, and handles sound management and state transitions (open/closed) based on container interaction. When held in a player's inventory, it skips ground-based effects and uses a different animation path. It integrates with the `container`, `inventoryitem`, and `preserver` components to provide storage, preservation tuning, and inventory behavior.

## Usage example
```lua
local sack = SpawnPrefab("beargerfur_sack")
sack.components.container:Close()
-- When placed on ground and opened, it emits frost FX automatically
sack.components.preserver:SetPerishRateMultiplier(TUNING.BEARGERFUR_SACK_PRESERVER_RATE)
```

## Dependencies & tags
**Components used:** `container`, `inventoryitem`, `preserver`, `inspectable`  
**Tags:** Adds `portablestorage` on the main item; `FX`, `NOCLICK`, `NOBLOCK` on the frost FX entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_sounds` | table | `nil` (set in master) | Contains `"open"` and `"close"` sound paths used during interaction. |
| `_frostfx` | entity or `nil` | `nil` | Reference to the spawned frost FX entity; only active when open on ground. |
| `_soundent` | entity or `nil` | `nil` | Reference to the entity used to play the open sound; avoids duplicate playback. |
| `_opentask` | task or `nil` | `nil` | Task scheduled to spawn/remove frost FX after animation completes. |
| `_startsoundtask` | task or `nil` | `nil` | Task to delay open-loop sound playback for non-held sacks. |
| `_killtask` | task or `nil` | `nil` | Task scheduling removal of frost FX on entity removal. |

## Main functions
### `OnOpen(inst)`
*   **Description:** Handles behavior when the sack is opened. Adjusts animation, image name, sound, and spawns frost FX if not held.
*   **Parameters:** `inst` (entity) — the sack instance.
*   **Returns:** Nothing.
*   **Error states:** Cancels existing tasks (`_opentask`, `_startsoundtask`) to prevent conflicts.

### `OnClose(inst)`
*   **Description:** Handles behavior when the sack is closed. Reverts animation, image name, stops open sound, and removes frost FX.
*   **Parameters:** `inst` (entity) — the sack instance.
*   **Returns:** Nothing.
*   **Error states:** Skips FX cleanup if `_frostfx` was never created.

### `OnPutInInventory(inst)`
*   **Description:** Invoked when the sack is placed into a player's inventory (e.g., by picking it up). Forces close state and removes frost FX.
*   **Parameters:** `inst` (entity) — the sack instance.
*   **Returns:** Nothing.
*   **Error states:** Always ensures `_frostfx` is removed and container is closed.

### `OnRemoveEntity(inst)`
*   **Description:** Cleanup handler called when the entity is removed. Terminates all active effects (FX and sounds).
*   **Parameters:** `inst` (entity) — the sack instance.
*   **Returns:** Nothing.
*   **Error states:** Safely handles missing `_frostfx` or `_soundent`.

### `ToggleFrostFX(inst, start, remove)`
*   **Description:** Spawns or removes the frost FX entity (`beargerfur_sack_frost_fx`) depending on `start` and `remove` flags.
*   **Parameters:**  
    - `inst` (entity) — the sack instance.  
    - `start` (boolean) — if `true`, spawns the FX if not already active.  
    - `remove` (boolean) — if `true`, fully removes the FX entity instead of just killing it.
*   **Returns:** Nothing.
*   **Error states:** No-op if `start=true` and `_frostfx` already exists; also no-op if `start=false` and `_frostfx` is `nil`.

### `StartOpenSound(inst)`
*   **Description:** Plays the open sound loop using the grand owner as the sound source if available.
*   **Parameters:** `inst` (entity) — the sack instance.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if grand owner or `SoundEmitter` is missing.

### `StopOpenSound(inst)`
*   **Description:** Stops any currently playing open-loop sound.
*   **Parameters:** `inst` (entity) — the sack instance.
*   **Returns:** Nothing.
*   **Error states:** No-op if `_soundent` is `nil` or its `SoundEmitter` is invalid.

## Events & listeners
- **Listens to:** `RemoveEntity` — handled via `inst.OnRemoveEntity = OnRemoveEntity` to clean up FX and sounds.
- **Pushes:** No events directly from this prefab’s logic.

> **Note:** The `container` component’s `onopenfn` and `onclosefn` hooks (`OnOpen` and `OnClose`) are set in the constructor and fire automatically on container open/close actions, but these are internal to the `container` system—not events registered via `inst:ListenForEvent`.