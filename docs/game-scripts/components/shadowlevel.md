---
id: shadowlevel
title: Shadowlevel
description: Manages a numerical shadow level value for an entity, supporting static or function-driven level retrieval.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 9ee8e2dd
---

# Shadowlevel

## Overview
This component stores and manages a shadow level value for an entity, allowing either a fixed level or a dynamic level computed by a user-defined function. It also ensures the entity carries the `"shadowlevel"` tag for identification.

## Dependencies & Tags
- Adds the `"shadowlevel"` tag to the entity on construction.
- Removes the `"shadowlevel"` tag when the component is removed from the entity.
- No other component dependencies or tags are explicitly added.

## Properties
| Property   | Type       | Default Value | Description |
|------------|------------|---------------|-------------|
| `inst`     | `Entity`   | —             | Reference to the host entity passed into the constructor. |
| `level`    | `number`   | `1`           | Default static shadow level, used if no level function is set. |
| `levelfn`  | `function?`| `nil`         | Optional function that computes the current level based on `inst`; overrides `level` when present. |

## Main Functions
### `SetDefaultLevel(level)`
* **Description:** Sets the static `level` property, which serves as the fallback value when no `levelfn` is defined.
* **Parameters:**
  * `level` (`number`): The numeric value to use as the default shadow level.

### `SetLevelFn(fn)`
* **Description:** Assigns a callback function (`levelfn`) that dynamically computes the shadow level at query time.
* **Parameters:**
  * `fn` (`function`): A function accepting the entity instance as its sole argument, returning the current shadow level.

### `GetCurrentLevel()`
* **Description:** Returns the current shadow level. If `levelfn` is set, it calls `levelfn(inst)`; otherwise, it returns the stored `level`.
* **Parameters:** None.

## Events & Listeners
None.