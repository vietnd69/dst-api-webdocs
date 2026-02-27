---
id: hunger_replica
title: Hunger Replica
description: This component provides a network-synchronized replica of a character's hunger state, delegating to a classified data object for reliable replication between server and client.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: b82c6329
---

# Hunger Replica

## Overview
The `Hunger` component acts as a lightweight, network-safe wrapper for hunger data, primarily used on clients or non-master simulations. It retrieves or attaches to a `player_classified` or `pet_hunger_classified` object to mirror the authoritative hunger state (current/max values, starvation status) from the server without directly accessing the master-holding `hunger` component.

## Dependencies & Tags
- **Component Dependency:** Relies on the presence of either `inst.components.hunger` (master simulation) or a `classified` object (e.g., `player_classified`, `pet_hunger_classified`) on the entity for replication.
- **Event Listeners:** Attaches an `"onremove"` event listener to the classified object to clean up references on removal.
- **Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (none) | Reference to the owning entity. |
| `classified` | `Classified?` | `nil` | Reference to the `player_classified` or `pet_hunger_classified` object used for data replication. |

## Main Functions
### `AttachClassified(classified)`
* **Description:** Attaches to a classified object and registers an `"onremove"` event listener to detect when the classified object is removed, ensuring proper cleanup. Stores a local callback to avoid closure issues.
* **Parameters:**
  * `classified` (`Classified`): The classified object to attach to (typically contains `currenthunger` and `maxhunger` fields).

### `DetachClassified()`
* **Description:** Detaches from the classified object by clearing internal references and removing the `"onremove"` listener. Should be called automatically via the event system.
* **Parameters:** None.

### `SetCurrent(current)`
* **Description:** Updates the `"currenthunger"` value in the attached classified object. Intended for use on the server to push hunger updates to clients.
* **Parameters:**
  * `current` (`number`): The new current hunger value.

### `SetMax(max)`
* **Description:** Updates the `"maxhunger"` value in the attached classified object. Used to propagate maximum hunger changes (e.g., due to effects or items).
* **Parameters:**
  * `max` (`number`): The new maximum hunger value.

### `Max()`
* **Description:** Returns the current maximum hunger value. Prioritizes the local `hunger` component (master) if present; otherwise, reads from `classified`, and defaults to `100` if neither is available.
* **Parameters:** None.

### `GetPercent()`
* **Description:** Returns the hunger level as a normalized value between `0` and `1`. Delegates to `hunger:GetPercent()` if available, otherwise computes from classified values; defaults to `1` if no hunger data exists.
* **Parameters:** None.

### `GetCurrent()`
* **Description:** Returns the current hunger value. Uses the local `hunger` component on the master, or falls back to the classified object, or `100` if unavailable.
* **Parameters:** None.

### `IsStarving()`
* **Description:** Returns `true` if the character is starving. Delegates to `hunger:IsStarving()` on master; otherwise, checks if `currenthunger` in classified is `≤ 0`.
* **Parameters:** None.

## Events & Listeners
- **Listens for:** `"onremove"` event on the attached `classified` object. Triggers `DetachClassified()` when fired to prevent stale references.
- **Does not push or trigger any custom events.**