---
id: klaussacklock
title: Klaussacklock
description: This component enables an entity to process locking or unlocking actions via a key, by invoking a custom callback function when used.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: c6d9a545
---

# Klaussacklock

## Overview
This component serves as a locking mechanism for entities (typically containers or doors), allowing interaction with keys. It stores a callback function (`onusekeyfn`) that defines how a key should be processed when used on the entity. It also automatically adds and removes the `"klaussacklock"` tag on the entity to indicate its purpose.

## Dependencies & Tags
- **Tags added:** `"klaussacklock"` (added in constructor, removed on entity removal)
- **Component dependencies:** Relies on `key.components.stackable` being present if key is stackable and consumed; otherwise calls `key:Remove()` directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (set via constructor) | Reference to the owning entity instance. |
| `onusekeyfn` | `function?` | `nil` | Callback function to invoke on key use; signature: `fn(inst, key, doer) -> success: boolean, fail_msg: string?, consumed: boolean`. |

## Main Functions

### `SetOnUseKey(onusekeyfn)`
* **Description:** Assigns the callback function that defines the logic for using a key on this entity.
* **Parameters:**  
  `onusekeyfn` (`function`): A function with signature `(entity, key, doer) -> (success: boolean, fail_msg: string?, consumed: boolean)`.

### `UseKey(key, doer)`
* **Description:** Executes the key-usage logic by invoking `onusekeyfn`. Handles key consumption (removing the key from inventory or destroying it) if the callback signals consumption. Returns success/failure state and optional failure message.
* **Parameters:**  
  `key` (`Entity?`): The key entity being used. Must be valid.  
  `doer` (`Entity`): The entity (typically a player) performing the key use action.  
  **Returns:**  
  - `true` if the operation succeeded and key was consumed.  
  - `false, fail_msg` if the operation failed (e.g., incorrect key, condition not met), where `fail_msg` is a message to display.

## Events & Listeners
None identified.