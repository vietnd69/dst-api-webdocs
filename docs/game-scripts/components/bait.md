---
id: bait
title: Bait
description: Manages the state of an entity used as bait, linking it to a trap and notifying the trap when it is taken.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 56a0893d
---

# Bait

## Overview
The `Bait` component is attached to entities that can be placed in traps. Its primary responsibility is to maintain a reference to the trap entity it has been placed in. It listens for events such as being eaten, stolen, or picked up, and notifies the trap so the trap can react accordingly (e.g., by springing shut).

## Dependencies & Tags
None identified.

## Properties

| Property | Type   | Default Value | Description                                                               |
|----------|--------|---------------|---------------------------------------------------------------------------|
| `trap`     | Entity | `nil`           | A reference to the trap entity that this bait is currently placed inside. |

## Main Functions
### `OnRemoveFromEntity()`
* **Description:** A lifecycle method called when the component is removed from its entity. It cleans up all registered event listeners to prevent memory leaks.
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a string representation of the component's state for debugging purposes, indicating which trap entity it is associated with.
* **Parameters:** None.

### `IsFree()`
* **Description:** Checks whether the bait is currently associated with a trap.
* **Parameters:** None.
* **Returns:** `true` if the bait is not in a trap (`self.trap` is `nil`), otherwise `false`.

## Events & Listeners
This component listens for the following events on its owner entity:

*   **`onremove`**: When the bait entity is removed from the world, it calls `RemoveBait()` on the associated trap, if one exists.
*   **`onpickup`**: When the bait entity is picked up by a player or creature, it behaves the same as `onremove`, notifying the trap that the bait has been removed.
*   **`oneaten`**: When the bait is eaten, it calls `BaitTaken(eater)` on its associated trap, passing the entity that ate the bait.
*   **`onstolen`**: When the bait is stolen, it calls `BaitTaken(thief)` on its associated trap. If the bait is not in a trap, it attempts to place the item directly into the thief's inventory.