---
id: fillable
title: Fillable
description: Enables an entity to be filled with liquid, typically replacing itself with a prefab that represents a filled state and handling interaction logic such as ocean water actions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: cbbd2f69
---

# Fillable

## Overview
The `Fillable` component allows an entity (e.g., an empty container or vessel) to be filled with liquid—most commonly water—by consuming a water source and replacing itself with a new prefab representing the filled state. It also supports optional behavior for ocean water interactions via tag toggling.

## Dependencies & Tags
- **Adds tag(s):** `"fillable"` (on initialization)
- **Removes tag(s):** `"fillable"`, `"fillable_showoceanaction"`, `"allow_action_on_impassable"` (on removal from entity)
- **No external component dependencies** are explicitly required by this component’s core logic.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` → passed in constructor | Reference to the entity this component is attached to. |
| `filledprefab` | `string?` | `nil` | Name of the prefab to spawn when the entity is filled. If `nil`, filling fails. |
| `acceptsoceanwater` | `boolean` | `false` | Whether the entity accepts ocean water as a fill source (currently unused in the provided code). |
| `showoceanaction` | `boolean` | `false` | Controls whether ocean-related actions (e.g., right-click to fill from ocean) appear for this entity. |
| `overrideonfillfn` | `function?` | `nil` | Optional callback executed on fill; if present, replaces default fill behavior. |

> **Note:** No public properties are initialized outside the constructor beyond those listed. The commented-out properties (`overrideonfillfn`, `oceanwatererrorreason`) are not actively used in the current implementation.

## Main Functions

### `Fill(from_object)`
* **Description:** Fills the entity by consuming a water source (if provided) and replacing the current entity with `self.filledprefab`. Handles item transfer into inventories or placement into the world if unowned.
* **Parameters:**
  - `from_object` (`Entity?`): The source of the water (must have a `watersource` component). If `nil`, only `overrideonfillfn` (if present) is executed; otherwise, filling fails.

## Events & Listeners
- **Listens for:** `showoceanaction` event (implicitly via callback registration: `showoceanaction = onshowoceanaction`)
  - When `showoceanaction` changes, the component toggles two tags:
    - `"fillable_showoceanaction"`
    - `"allow_action_on_impassable"`  
    This enables or disables UI and interaction options when the entity is on impassable terrain (e.g., ocean).
- **Pushes no custom events.**