---
id: singable
title: Singable
description: Enables an entity to be sung by players, storing a callback function to execute when singing occurs and applying song effects to the singer.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 4e64705d
---

# Singable

## Overview
The `Singable` component allows an entity to be sung by a player. It stores an optional callback function (`onsingfn`) that is invoked upon singing and ensures the singer's `singinginspiration` component records the song via `AddSong`, using the entity's `songdata` property.

## Dependencies & Tags
- Requires `inst.songdata` to be defined on the entity (typically a table of song parameters).
- Assumes the singer entity has a `singinginspiration` component.
- Does *not* add or remove tags; comments suggest potential future interaction with `finiteuses`, but this is currently commented out.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component is attached to. |
| `onsingfn` | `function?` | `nil` | Optional callback function executed during singing; signature: `fn(entity, singer)`. |

## Main Functions
### `SetOnSing(onsingfn)`
* **Description:** Assigns a callback function to be executed when the entity is sung. The callback receives the songable entity and the singer as arguments.
* **Parameters:**  
  - `onsingfn` (*function?*) — A function to call when singing occurs. If `nil`, no callback is executed.

### `Sing(singer)`
* **Description:** Triggers the singing logic: validates the singer has a `singinginspiration` component, executes the callback if set, and registers the song with the singer's inspiration component.
* **Parameters:**  
  - `singer` (*Entity*) — The player entity attempting to sing this item.

## Events & Listeners
None.