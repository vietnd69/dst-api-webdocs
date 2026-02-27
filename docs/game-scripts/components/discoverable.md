---
id: discoverable
title: Discoverable
description: This component manages an entity's discovery state and its associated minimap icons.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 1fdb1aaf
---

# Discoverable

## Overview
This component allows an entity to have a discoverable state, primarily impacting its appearance on the minimap. Entities with this component can be "discovered" (e.g., by clicking them), which changes their minimap icon. It also handles the saving and loading of the discovered state across game sessions.

## Dependencies & Tags
This component relies on the entity having a `MiniMapEntity` component (`inst.MiniMapEntity`) to set and change minimap icons.
None identified.

## Properties
| Property           | Type          | Default Value | Description                                                    |
| :----------------- | :------------ | :------------ | :------------------------------------------------------------- |
| `inst`             | table (entity)| `self`        | A reference to the entity this component is attached to.       |
| `discovered`       | boolean       | `false`       | True if the entity has been discovered, false otherwise.       |
| `undiscoveredIcon` | string        | `nil`         | The asset path for the minimap icon to display when undiscovered. |
| `discoveredIcon`   | string        | `nil`         | The asset path for the minimap icon to display when discovered. |

## Main Functions
### `Discover()`
*   **Description:** Sets the entity's state to discovered and updates its minimap icon to the `discoveredIcon`.
*   **Parameters:** None.

### `Hide()`
*   **Description:** Sets the entity's state to undiscovered and updates its minimap icon to the `undiscoveredIcon`.
*   **Parameters:** None.

### `SetIcons(undiscovered, discovered)`
*   **Description:** Sets the asset paths for both the undiscovered and discovered minimap icons. After setting the icons, it calls `Hide()` to ensure the entity initially displays its undiscovered icon.
*   **Parameters:**
    *   `undiscovered` (string): The asset path for the minimap icon when the entity is undiscovered.
    *   `discovered` (string): The asset path for the minimap icon when the entity is discovered.

### `OnSave(data)`
*   **Description:** Serializes the `discovered` state of the component into the provided data table for persistence.
*   **Parameters:**
    *   `data` (table): The table to which component data should be saved.

### `OnLoad(data)`
*   **Description:** Deserializes the `discovered` state from the provided data table, restoring the component's state from a save game. If previously discovered, it calls `Discover()`.
*   **Parameters:**
    *   `data` (table): The table containing saved component data.

## Events & Listeners
*   Listens for the `onclick` event on its instance. If the entity is clicked and has not yet been discovered, it triggers the `Discover()` function.