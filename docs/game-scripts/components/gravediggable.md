---
id: gravediggable
title: Gravediggable
description: Enables entities to be marked as diggable graves, managing the `gravediggable` tag and exposing a `DigUp` callback interface.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 96c5964b
---

# Gravediggable

## Overview
The `Gravediggable` component allows an entity to be marked as a diggable grave by toggling the `gravediggable` tag based on diggability state. It provides a `DigUp` method to invoke a custom callback when the grave is dug up, and supports save/load via `OnSave`/`OnLoad`.

## Dependencies & Tags
- Adds the `"gravediggable"` tag at construction time (for component actions).
- Adds or removes the `"gravediggable"` tag dynamically via the `canbedug` property setter.
- On removal from entity, explicitly removes the `"gravediggable"` tag.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `canbedug` | boolean | `true` | Controls whether the `"gravediggable"` tag is present on the entity. Setting this property triggers the `oncanbedug` callback to update the tag. |
| `ondug` | function | `nil` | Optional callback invoked when `DigUp` is called. Signature: `function(inst, tool, doer) -> success: boolean, reason: ?string`. |

## Main Functions
### `DigUp(tool, doer)`
* **Description:** Invokes the optional `ondug` callback to handle digging logic. Returns success status and optional reason string.
* **Parameters:**
  - `tool`: The item used to dig the grave (e.g., shovel).
  - `doer`: The entity performing the dig action (usually a player).

### `OnSave()`
* **Description:** Returns a serializable table containing the current `canbedug` state for persistence.
* **Returns:** `{ canbedug = boolean }`

### `OnLoad(data)`
* **Description:** Restores the `canbedug` state from saved data. If `data.canbedug` is missing or falsy, sets `canbedug = false`.
* **Parameters:**
  - `data`: Saved state table (expected to contain `canbedug` if saved previously).

## Events & Listeners
None.