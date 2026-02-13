---
id: chessunlocks
title: Chessunlocks
description: This component manages the locked and unlocked state of chess-themed crafting sketches and trinkets, typically tied to in-game progression.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: world
---

# Chessunlocks

## Overview
This component is responsible for tracking the locked and unlocked status of specific crafting recipes (referred to as "sketches") and collectible trinkets that are associated with the game's various chess figures. It initializes all such items as locked and provides an interface to unlock them based on in-game events, as well as methods for persistence across game sessions. It specifically asserts that it should only exist on the master simulation.

## Dependencies & Tags
None identified. This component does not explicitly add other components or manage tags on its entity.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `inst`   | `table` | `self` (the component instance itself) | A reference to the entity this component is attached to. |

## Main Functions
### `self:IsLocked(prefab)`
*   **Description:** Checks if a given prefab (either a sketch or a trinket) is currently locked by this component.
*   **Parameters:**
    *   `prefab`: (`string`) The string identifier of the prefab to check.

### `self:GetNumLockedSketches()`
*   **Description:** Returns the total count of chess-themed sketches that are currently locked.
*   **Parameters:** None.

### `self:GetNumLockedTrinkets()`
*   **Description:** Returns the total count of chess-themed trinkets that are currently locked.
*   **Parameters:** None.

### `self:OnSave()`
*   **Description:** Prepares the data for saving the component's state. It collects the names of all chess pieces whose associated sketches are *unlocked*.
*   **Parameters:** None.

### `self:OnLoad(data)`
*   **Description:** Restores the component's state from saved data. It iterates through the saved `unlocks` and triggers the `OnUnlockChesspiece` logic for each, effectively unlocking the previously unlocked items.
*   **Parameters:**
    *   `data`: (`table`) A table containing the saved state, expected to have an `unlocks` field which is an array of strings representing unlocked chess pieces.

## Events & Listeners
*   **`ms_unlockchesspiece`**: Listens for this master simulation event. When triggered with a `chesspiece` string, it unlocks the corresponding sketch and any associated trinkets.