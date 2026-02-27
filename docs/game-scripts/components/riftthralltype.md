---
id: riftthralltype
title: Riftthralltype
description: Stores and manages the type classification of a rift thrall entity for persistence and runtime checks.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 80502ca2
---

# Riftthralltype

## Overview
This component provides a lightweight mechanism for assigning, storing, and retrieving a thrall type identifier for an entity—primarily used to distinguish between different kinds of rift thralls (e.g., spawned by the Rift or related mechanics). It supports saving/loading via `OnSave`/`OnLoad`, offers utility methods for type comparisons, and exposes a debug string representation.

## Dependencies & Tags
None identified.

## Properties
| Property      | Type   | Default Value | Description                                      |
|---------------|--------|---------------|--------------------------------------------------|
| `inst`        | `Entity` | —             | The entity instance this component is attached to (injected via constructor). |
| `thrall_type` | `string` or `nil` | `nil`         | The classified type of the rift thrall (e.g., `"summoned"`, `"bound"`), set via `SetThrallType`. |

## Main Functions
### `SetThrallType(new_type)`
* **Description:** Assigns a new thrall type string to the component.
* **Parameters:**  
  `new_type` (`string` or `nil`) – The type identifier to assign.

### `GetThrallType()`
* **Description:** Returns the currently assigned thrall type.
* **Parameters:** None.  
* **Returns:** `string` or `nil` – The current `thrall_type`.

### `IsThrallType(check_type)`
* **Description:** Compares the stored type against a given type and returns whether they match.
* **Parameters:**  
  `check_type` (`string`) – The type string to compare against.

### `OnSave()`
* **Description:** Prepares serializable data for world persistence. Returns a table containing the `thrall_type`, or `nil` if no type is set.
* **Parameters:** None.  
* **Returns:** `{ thrall_type = string }` or `nil`.

### `OnLoad(data)`
* **Description:** Restores the thrall type from saved data during world loading.
* **Parameters:**  
  `data` (`table`) – The saved data table, expected to optionally contain a `thrall_type` key.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string representation of the thrall type (e.g., `"summoned"` or `"NONE"`).
* **Parameters:** None.  
* **Returns:** `string`.

## Events & Listeners
None.