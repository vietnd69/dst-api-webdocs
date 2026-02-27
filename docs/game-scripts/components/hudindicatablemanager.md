---
id: hudindicatablemanager
title: Hudindicatablemanager
description: Tracks and manages HUD-indicatable items on the client by registering/unregistering them via GUID.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: ui
source_hash: 53228663
---

# Hudindicatablemanager

## Overview
Manages a collection of items that can be displayed on the HUD (e.g., quest markers or trackable objects) exclusively on the client side. It maintains a registry keyed by item GUID and provides register/unregister methods to control which items appear visually in the HUD.

## Dependencies & Tags
* `TheNet:IsDedicated()` is used to assert that this component is **client-only**—it is never attached on dedicated servers.
* No external component dependencies are declared or inferred.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this component is attached to (typically the player). |
| `items` | `table` (GUID → item) | `{}` | Dictionary mapping item GUIDs to their entity references; represents currently tracked HUD-indicatable items. |

## Main Functions

### `RegisterItem(item)`
* **Description:** Registers an item for HUD indication if not already present. Prevents duplicate registration by checking the item's GUID.
* **Parameters:**
  * `item` (`Entity`): The item entity to register. Must have a `GUID` property.

### `UnRegisterItem(item)`
* **Description:** Removes an item from the HUD indication registry if it exists. Gracefully handles nil input.
* **Parameters:**
  * `item` (`Entity` or `nil`): The item entity to unregister. If nil, no action is taken.

### `OnSave()`
* **Description:** Prepares data for saving. Currently returns an empty table—no persistent state is stored server-side or across sessions.
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Loads saved data. Currently a no-op—no data is processed or applied.
* **Parameters:**
  * `data` (`table` or `nil`): Ignored by the implementation.

### `GetDebugString()`
* **Description:** Intended for debug output; always returns `nil` due to the `if true then return nil` guard.
* **Parameters:** None.

## Events & Listeners
None identified.