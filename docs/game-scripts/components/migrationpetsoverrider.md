---
id: migrationpetsoverrider
title: Migrationpetsoverrider
description: Provides a pluggable callback mechanism to override the positional offset logic for migration pets spawned by a player.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 82301181
---

# Migrationpetsoverrider

## Overview
This lightweight utility component enables custom positional offset logic for migration pets by exposing an overridable callback function (`SetOffsetFromFn`). It is intended for use with entities (typically players) that spawn migration pets and need to customize where those pets appear relative to a given coordinate.

## Dependencies & Tags
- Uses `inst` (the entity the component is attached to), but does not add or require any additional components or tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(passed to constructor)* | Reference to the owner entity passed at instantiation. |
| `getoffsetfromfn` | `function?` | `nil` | Optional callback function `fn(inst, x, y, z) → ox, oy, oz` that computes the offset for migration pets. |

## Main Functions
### `SetOffsetFromFn(fn)`
* **Description:** Assigns a custom callback function to compute the positional offset for migration pets.  
* **Parameters:**  
  `fn` (`function?`) — A function that accepts the owner instance and world coordinates `(x, y, z)`, and returns the offset coordinates `(ox, oy, oz)`. If `nil`, the default (0,0,0) offset is used.

### `GetOffsetFrom(x, y, z)`
* **Description:** Invokes the configured offset function (if present) and returns the computed offset; otherwise returns `(0, 0, 0)`.  
* **Parameters:**  
  `x`, `y`, `z` (`number`) — World coordinates relative to which the offset should be computed.

## Events & Listeners
None.