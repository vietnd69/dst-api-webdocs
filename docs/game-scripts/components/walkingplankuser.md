---
id: walkingplankuser
title: Walkingplankuser
description: Manages a player's or entity's interaction with and state while mounted on a walking plank.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 4d0c2835
---

# Walkingplankuser

## Overview
This component tracks whether an entity is currently mounted on a walking plank, maintains a reference to that plank, and handles cleanup (including event unsubscription) when the entity dismounts or the plank is removed.

## Dependencies & Tags
This component does not directly add or remove tags from the entity. It relies on the presence of a `walkingplank` component on the plank entity (used internally via `self.current_plank.components.walkingplank:StopMounting()`), but does not enforce or declare this dependency programmatically. No explicit `AddComponent` calls or tag manipulations are present.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in `_ctor`) | Reference to the owning entity instance. |
| `current_plank` | `Entity?` | `nil` | Reference to the walking plank the entity is currently mounted on. May be `nil`. |
| `_plank_remove_event` | `EventCallback?` | `nil` | Stored event listener callback used to detect when the current plank is removed from the world. |

> Note: `current_plank` and `_plank_remove_event` are initialized to `nil` implicitly (not explicitly in `_ctor`), as the constructor body contains only comments.

## Main Functions

### `SetCurrentPlank(plank)`
* **Description:** Assigns a new walking plank as the current one. Cancels any existing removal listener on the previous plank and, if a new plank is provided, registers a new `"onremove"` listener to automatically clear `current_plank` if the plank is removed from the world.  
* **Parameters:**  
  * `plank` (`Entity?`) — The walking plank entity to mount on. If `nil`, clears `current_plank` and removes any pending listener.

### `Dismount()`
* **Description:** Handles dismounting the current walking plank. Informs the plank’s `walkingplank` component that mounting has stopped, then clears `current_plank`, and cancels the removal event listener.  
* **Parameters:** None.

## Events & Listeners
- Listens for `"onremove"` event on the current plank (via `inst:ListenForEvent("onremove", ...)`), triggering `self.current_plank = nil` when the plank is removed from the world.  
- Cancels the above event listener (via `:Cancel()`) upon dismount or when assigning a new plank.