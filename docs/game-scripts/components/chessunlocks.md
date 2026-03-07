---
id: chessunlocks
title: Chessunlocks
description: Manages locking and unlocking of chess piece sketches and associated trinkets in the Don't Starve Together chess minigame system.
tags: [minigame, unlocks, save, network]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 448e346a
system_scope: entity
---

# Chessunlocks

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Chessunlocks` tracks which chess piece sketches and trinkets are currently locked for a given entity (typically the player). It ensures only the server holds the authoritative state (`TheWorld.ismastersim` is required) and exposes methods to query lock status, retrieve counts, and persist state across game sessions via save/load hooks.

## Usage example
```lua
if TheWorld.ismastersim then
    local inst = ThePlayer
    inst:AddComponent("chessunlocks")
    
    -- Query how many sketches are still locked
    print("Locked sketches:", inst.components.chessunlocks:GetNumLockedSketches())
    
    -- Check if a specific item is locked
    if inst.components.chessunlocks:IsLocked("trinket_15") then
        print("Trinket 15 is still locked")
    end
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `chessunlocks` on owner entity during initialization (via `inst:AddComponent("chessunlocks")`); no tags added directly by this component.

## Properties
No public properties.

## Main functions
### `IsLocked(prefab)`
*   **Description:** Checks whether the given prefab (a sketch or trinket) is currently locked.
*   **Parameters:** `prefab` (string) - the name of the prefab to check.
*   **Returns:** `true` if locked, `false` otherwise.

### `GetNumLockedSketches()`
*   **Description:** Returns the total count of locked sketch prefabs.
*   **Parameters:** None.
*   **Returns:** number — number of locked sketches.

### `GetNumLockedTrinkets()`
*   **Description:** Returns the total count of locked trinket prefabs.
*   **Parameters:** None.
*   **Returns:** number — number of locked trinkets.

### `OnSave()`
*   **Description:** Serializes the unlocked chess pieces into a table suitable for saving.
*   **Parameters:** None.
*   **Returns:** `{ unlocks = { "pawn", "knight", ... } }` or `nil` if no pieces are unlocked.

### `OnLoad(data)`
*   **Description:** Restores unlock state from saved data. Must be called on load.
*   **Parameters:** `data` (table?) - the saved data table, expected to contain an `unlocks` array of chess piece names.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `ms_unlockchesspiece` — triggers unlocking of the associated sketch and trinkets for the specified chess piece.

## Save/Load
The component implements `OnSave()` and `OnLoad(data)` methods to persist unlock progress across game sessions. Unlocked chess pieces are stored as a list of strings (e.g., `{ "pawn", "rook" }`) in the saved `data.unlocks` array.
