---
id: hitchable
title: Hitchable
description: Enables an entity to be hitched to or un-hitched from another entity, managing tag states, sound effects, and combat-target relationships.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: aa144e47
---

# Hitchable

## Overview
The `Hitchable` component allows an entity to be hitched (attached) to a target entity (typically a hitching post or animal), preventing the entity from being considered "hitched" by adding the `"hitched"` tag when hitched, and vice versa. It manages hitch/unhitch logic, including sound playback, event listening for new combat targets, and synchronization with the target's hitch state.

## Dependencies & Tags
- Uses `SoundEmitter` component to play hitching/unhitching sounds.
- Adds/removes the `"hitched"` tag on the entity depending on `canbehitched` state.
- Listens for the `"newcombattarget"` event to automatically unhitch when a new combat target is assigned.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GameObject` | (from constructor) | The entity instance the component is attached to. |
| `hitched` | `GameObject?` | `nil` | Reference to the entity this entity is currently hitched to. |
| `canbehitched` | `boolean` | `true` | Controls whether the entity is currently hitched (`false` = hitched, `"hitched"` tag applied). |

## Main Functions

### `SetHitched(target)`
* **Description:** Hitch the entity to the specified `target` entity. Plays a hitching sound, sets `canbehitched` to `false`, and begins listening for the `"newcombattarget"` event.  
* **Parameters:**  
  - `target` (`GameObject`): The entity to hitch to.

### `Unhitch()`
* **Description:** Unhitch the entity from its current target. Plays an unhitching sound, removes the `"newcombattarget"` listener, sets `canbehitched` to `true`, and (if applicable) unhitches the target entity if it is itself hitched and its `canbehitched` flag becomes false.  
* **Parameters:** None.

### `GetHitch()`
* **Description:** Returns the current hitched target, if any.  
* **Parameters:** None.  
* **Returns:** `GameObject?` — the entity this entity is hitched to, or `nil`.

### `OnSave()`
* **Description:** preparing data for save serialization. Currently returns an empty table (no persistent state).  
* **Parameters:** None.  
* **Returns:** `{}` — empty table.

### `OnLoad(data)`
* **Description:** Restore state from saved data. Currently a no-op (no persistent state).  
* **Parameters:**  
  - `data` (`table`) — unused.

## Events & Listeners
- Listens for `"newcombattarget"` (on `self.inst`) → triggers `onnewtarget`, which calls `Unhitch()`.
- No events are explicitly pushed by this component.