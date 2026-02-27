---
id: custombuildmanager
title: Custombuildmanager
description: This component dynamically manages and applies custom animation build overrides to an entity's AnimState, allowing for flexible visual changes based on predefined symbol groups.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 3b8e6b76
---

# Custombuildmanager

## Overview
The `Custombuildmanager` component is responsible for managing and applying custom animation build overrides to an entity's `AnimState`. It allows for dynamic visual changes by defining groups of symbols that can be swapped out with different animation builds. This is particularly useful for character customization, item states, or other situations where an entity's appearance needs to change without altering its core animation definitions.

## Dependencies & Tags
This component directly interacts with the owning entity's `AnimState` to override animation symbols.
None identified.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `inst` | `Entity` | - | A reference to the owning entity this component is attached to. |
| `groups` | `table` | `{}` | A table defining the groups of symbols that can be overridden. The keys are group names, and values are arrays of symbol names within that group. |
| `current` | `table` | `{}` | A table storing the currently active build for each defined group. Keys are group names, and values are the build names to be used. |
| `canswapsymbol` | `function` or `nil` | `nil` | An optional callback function that, if set, must return `true` for symbol overrides to be applied. It receives the `inst` as its argument. |

## Main Functions
### `refreshart()`
*   **Description:** Iterates through all defined symbol groups and their symbols, applying the currently active custom build override for each group to the entity's `AnimState`. If a `canswapsymbol` function is set, it must return `true` for the override to be applied.
*   **Parameters:** None.

### `SetGroups(data)`
*   **Description:** Sets the internal `groups` table, defining which symbols belong to which override groups. This data typically describes how symbols should be grouped for custom build management.
*   **Parameters:**
    *   `data`: `table` - A table where keys are group names and values are arrays of symbol names belonging to that group.

### `SetCanSwapSymbol(fn)`
*   **Description:** Sets an optional predicate function that determines whether symbol overrides should be applied. This allows for conditional art refreshing based on external factors.
*   **Parameters:**
    *   `fn`: `function` - A function that takes the `inst` (entity) as an argument and returns `true` to allow symbol swapping, or `false` to disallow it.

### `ChangeGroup(group, build)`
*   **Description:** Modifies the active build for a specific symbol group. If `build` is `nil`, the override for that group is cleared. After updating, `refreshart()` is called to apply the changes.
*   **Parameters:**
    *   `group`: `string` - The name of the symbol group to modify.
    *   `build`: `string` or `nil` - The name of the new animation build to use for this group, or `nil` to clear the override.

### `OnSave(data)`
*   **Description:** Prepares the component's state for saving. It returns the `current` state of active build overrides.
*   **Parameters:**
    *   `data`: `table` - The save data table provided by the game's saving system (unused in this function's logic).

### `OnLoad(data)`
*   **Description:** Loads the component's state from saved data. It restores the `current` active build overrides and then calls `refreshart()` to apply these loaded settings.
*   **Parameters:**
    *   `data`: `table` - The loaded data table containing the component's saved state.