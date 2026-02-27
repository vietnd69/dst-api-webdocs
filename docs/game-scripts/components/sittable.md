---
id: sittable
title: Sittable
description: Enables an entity to be occupied by a player or creature for sitting, managing occupancy state, tag updates, and event propagation.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 2caa10ce
---

# Sittable

## Overview
This component allows an entity (e.g., a chair, stool, or bench) to serve as a seat, tracking whether it is occupied and managing associated state such as the `cansit` tag, event notifications (`becomesittable`, `becomeunsittable`), and interaction with fire (e.g.,_notify_ the occupier if the seat catches fire). It integrates with the Entity Component System (ECS) to coordinate sitter entry/exit, cleanup, and visual/gameplay state changes.

## Dependencies & Tags
**Dependencies:**
- Uses `inst.components.burnable` if present (for fire propagation handling).
- Does not explicitly add or require other components beyond the base `inst`.

**Tags:**
- Adds the `"cansit"` tag on initialization (unless occupied).
- Removes the `"cansit"` tag when occupied or when the component is removed.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `occupier` | `Entity` or `nil` | `nil` | Reference to the entity currently sitting on this item. Read-write via public property; setting it triggers tag toggling and event broadcasting. |
| `_onremoveoccupier` | `function` | (internal callback) | Private callback attached to the occupier’s `"onremove"` event to auto-eject if the occupier is destroyed. |

*Note:* No public properties beyond `occupier` are explicitly initialized or exposed. All others (`_onremoveoccupier`, `OnIgnite`) are internal implementation details.

## Main Functions

### `SetOccupier(occupier)`
* **Description:** Sets the occupier entity (or clears it if `nil`), updating state accordingly: toggles the `"cansit"` tag, registers/cleans up event callbacks (e.g., for occupier removal or fire), and emits `becomesittable` or `becomeunsittable` events.
* **Parameters:**
  - `occupier` (`Entity` or `nil`): The entity sitting on this item, or `nil` to vacate the seat.

### `IsOccupied()`
* **Description:** Returns `true` if any entity is currently sitting here.
* **Parameters:** None.

### `IsOccupiedBy(occupier)`
* **Description:** Returns `true` if the given entity is the *current* occupier (and not `nil`).
* **Parameters:**
  - `occupier` (`Entity`): The specific entity to check for occupancy.

### `EjectOccupier()`
* **Description:** Triggers a `"becomeunsittable"` event (e.g., to notify UI or gameplay systems) *without* clearing the `occupier` reference. Typically used for soft ejection logic (e.g., forced dismount), but implementation here is minimal and rarely used in practice. Note: does *not* call `SetOccupier(nil)`.
* **Parameters:** None.

### `OnRemoveFromEntity()`
* **Description:** Cleanup routine called when the component is removed from the entity. Clears all event listeners, removes `"cansit"` tag, and emits `"becomeunsittable"` if occupied.
* **Parameters:** None.

## Events & Listeners

- **Listens for events:**
  - `"onremove"` on the occupier entity (via `self._onremoveoccupier` callback), to auto-eject if the occupier is destroyed.
  - `"onignite"` on the sitting entity *if* `burnable` component exists, to notify the occupier via `"sittableonfire"`.

- **Triggers events:**
  - `"becomesittable"` — emitted when the entity gains `"cansit"` (i.e., becomes empty and eligible to sit).
  - `"becomeunsittable"` — emitted when the entity loses `"cansit"` (i.e., becomes occupied or is being removed).
  - `"sittableonfire"` — emitted on the occupier when the sitting entity ignites, carrying the sittable entity as payload.