---
id: yotc_racestart
title: Yotc Racestart
description: Manages race state transitions (start/end) for an entity, triggers custom callbacks, and manages "race_on" and "yotc_racestart" tags.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 4d20c9fa
---

# Yotc Racestart

## Overview
This component enables an entity to participate in a race by managing its race state—specifically, tracking whether the race is active via the `race_on` tag and executing optional callback functions when the race starts or ends. It also ensures the entity is tagged with `yotc_racestart` upon initialization and removes it on cleanup.

## Dependencies & Tags
- **Component Tags Added/Removed:**
  - Adds `"yotc_racestart"` tag on initialization.
  - Adds `"race_on"` tag when `StartRace()` is called.
  - Removes `"race_on"` tag when `EndRace()` is called.
  - Removes `"yotc_racestart"` tag when the component is removed from the entity (`OnRemoveFromEntity`).
- **No external component dependencies** are explicitly declared or required.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed to constructor) | Reference to the owning entity instance. |
| `onstartracefn` | `function?` | `nil` | Optional callback function invoked when `StartRace()` is called; receives `inst` as argument. |
| `onendracefn` | `function?` | `nil` (implicitly) | Optional callback function invoked when `EndRace()` is called; receives `inst` as argument. |
| `rats` | `table` | `{}` (empty table) | Unused in current implementation; appears reserved for future use. |

> **Note:** `onendracefn` is used in `EndRace()` but is not initialized in the constructor. Its default is effectively `nil`.

## Main Functions

### `StartRace()`
* **Description:** Triggers the start of a race by invoking the `onstartracefn` callback (if set) and adding the `"race_on"` tag to the entity. This indicates the entity is actively participating in the race.
* **Parameters:** None.

### `EndRace()`
* **Description:** Triggers the end of a race by invoking the `onendracefn` callback (if set) and removing the `"race_on"` tag. This signals the race is concluded for this entity.
* **Parameters:** None.

### `CanInteract()`
* **Description:** Returns `true` if the entity is **not** currently in an active race (`race_on` tag is absent). Returns `nil` if `race_on` is present (i.e., race is active), indicating interaction may be disallowed (behavior depends on caller).
* **Parameters:** None.

## Events & Listeners
None.