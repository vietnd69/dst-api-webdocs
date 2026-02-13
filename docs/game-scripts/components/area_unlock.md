---
id: area_unlock
title: Area Unlock
description: Manages the tracking and unlocking of narrative stories associated with specific world areas.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: world
---

# Area Unlock

## Overview
The Area Unlock component is responsible for tracking an entity's discovery of specific game areas. It maintains a list of registered "stories," which are associated with these areas. When the entity enters a new area for the first time, this component marks the corresponding story as "unlocked," providing a mechanism for narrative progression tied to world exploration.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `inst` | `userdata` | `inst` | A reference to the entity instance this component is attached to. |
| `stories` | `table` | `{}` | A key-value map where keys are story identifiers and values are booleans indicating if the story is unlocked (`true`) or not (`false`). |

## Main Functions
### `CheckUnlock(area)`
*   **Description:** Checks if the story associated with the entered area has been registered and is currently locked. If so, it marks the story as unlocked. This function is automatically called by the `changearea` event listener.
*   **Parameters:**
    *   `area`: A table containing data about the world area the entity has just entered, which must include a `story` key.

### `RegisterStory(story)`
*   **Description:** Adds a new story identifier to the component's tracking list. The story is initially set to an unlocked state (`false`).
*   **Parameters:**
    *   `story`: A string or other hashable type representing the unique identifier for the story to be tracked.

### `GetUnlocked()`
*   **Description:** Iterates through all registered stories and returns a list of the ones that have been unlocked.
*   **Parameters:** None.
*   **Returns:** An array containing the identifiers of all unlocked stories.

## Events & Listeners
*   **Listens To:** `"changearea"`
    *   **Callback:** When the entity this component is attached to changes world areas, this event triggers a call to `self:CheckUnlock(area)`, passing the new area's data.