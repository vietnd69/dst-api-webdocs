---
id: kitcoonden
title: Kitcoonden
description: Manages a collection of kitcoon entities associated with an entity, tracking their presence and responding to their removal.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 035b93bc
---

# Kitcoonden

## Overview
The `KitcoonDen` component maintains a registry of "kitcoon" entities attached to a host entity, ensuring proper tracking and cleanup when kitcoons are added or removed. It listens for the `"onremove"` event on individual kitcoons to automatically deregister them and notify external callbacks, if defined.

## Dependencies & Tags
- Uses `inst:ListenForEvent` and `inst:RemoveEventCallback` for event management.
- Does not add or require specific tags.
- No other components are directly added or required by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component is attached to. |
| `kitcoons` | `table` | `{}` | Dictionary mapping kitcoon entities to themselves (used as a set). |
| `num_kitcoons` | `number` | `0` | Current count of kitcoons in the den. |
| `OnAddKitcoon` | `function?` | `nil` | Optional callback invoked after a kitcoon is added. Signature: `func(inst, kitcoon, doer)`. |
| `OnRemoveKitcoon` | `function?` | `nil` | Optional callback invoked after a kitcoon is removed. Signature: `func(inst, kitcoon)`. |

## Main Functions

### `AddKitcoon(kitcoon, doer)`
* **Description:** Adds a kitcoon entity to the den if not already present. Registers an `"onremove"` listener on the kitcoon to trigger automatic removal. Invokes `OnAddKitcoon` callback if defined.
* **Parameters:**
  * `kitcoon`: The entity representing the kitcoon to add.
  * `doer`: The entity responsible for adding the kitcoon (passed to the callback).

### `RemoveKitcoon(kitcoon)`
* **Description:** Removes a specific kitcoon from the den, invoking cleanup logic (including removing its `"onremove"` listener and decrementing the count). Triggers `OnRemoveKitcoon` callback if defined.
* **Parameters:**
  * `kitcoon`: The kitcoon entity to remove.

### `RemoveAllKitcoons()`
* **Description:** Removes all kitcoons currently in the den, running cleanup for each one.
* **Parameters:** None.

### `OnRemoveFromEntity()`
* **Description:** Cleanup method called when the component is removed from its entity. Removes all kitcoons and their associated event listeners.
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a string for debugging purposes showing the current kitcoon count.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"Count:2"`.

## Events & Listeners
- Listens for `"onremove"` events on each kitcoon entity and triggers `onremove_kitcoon` callback when fired.
- If `OnAddKitcoon` is set, it is invoked during `AddKitcoon`.
- If `OnRemoveKitcoon` is set, it is invoked during internal removal (via `onremove_kitcoon`).