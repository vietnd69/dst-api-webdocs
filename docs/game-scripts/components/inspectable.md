---
id: inspectable
title: Inspectable
description: Provides inspection capabilities for entities, managing display name, description, and status indicators during player inspection.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: d505b3c9
---

# Inspectable

## Overview
This component enables an entity to be inspected by players, allowing custom description text, status indicators (e.g., "DEAD", "BURNING", "SLEEPING"), and name overrides. It automatically adds the `"inspectable"` tag to its entity upon construction and removes it when removed from the entity.

## Dependencies & Tags
- Adds the `"inspectable"` tag to the entity.
- Removes the `"inspectable"` tag on component removal.
- Relies on optional downstream components for status reporting (`health`, `sleeper`, `burnable`, `diseaseable`, `pickable`, `witherable`, `inventoryitem`, `occupiable`).
- Uses `GetString`, `GetDescription`, `CanEntitySeeTarget`, and `ProfileStatsSet` (UI/log utilities).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `description` | `string` / `table<string>` / `nil` | `nil` | Static description text (string or table of strings), or `nil` if dynamically provided via `descriptionfn` or `getspecialdescription`. |
| `nameoverride` | `string` / `nil` | `nil` | Custom inspect name string (distinct from the entity’s display name). |
| `getspecialdescription` | `function(inst, viewer)` / `nil` | `nil` | Optional callback to compute a custom description, supporting filtering/author metadata. |
| `descriptionfn` | `function(inst, viewer)` / `nil` | `nil` | Optional callback to return a custom description string. |
| `getstatus` | `function(inst, viewer)` / `nil` | `nil` | Optional callback to compute a custom status string (e.g., `"CUSTOM_STATUS"`). |
| `recordview` | `boolean` | `false` | Whether inspect events should be recorded for stats (`ProfileStatsSet`). |

## Main Functions

### `SetDescription(desc)`
* **Description:** Sets the static description used by `GetDescription`. Accepts a string, table of strings, or `nil`.
* **Parameters:**
  * `desc` (`string` / `table<string>` / `nil`): The description to assign.

### `SetNameOverride(nameoverride)`
* **Description:** Sets a custom inspect name for the entity (used in the inspect UI), distinct from the entity’s display name.
* **Parameters:**
  * `nameoverride` (`string` / `nil`): The inspect name string.

### `RecordViews(state)`
* **Description:** Enables or disables tracking of inspection events for statistics.
* **Parameters:**
  * `state` (`boolean` / `any`): If `state ~= false`, records inspection stats via `ProfileStatsSet`.

### `GetStatus(viewer)`
* **Description:** Returns a status string reflecting the entity’s current state, checked against various components in priority order (e.g., `"DEAD"`, `"SLEEPING"`, `"BURNING"`). Also records inspection stats if enabled and the entity is not the viewer.
* **Parameters:**
  * `viewer` (`GObj`): The inspecting entity (typically a player). Returns `nil` if viewer is the entity itself.

### `GetDescription(viewer)`
* **Description:** Returns the full description (optionally with filtering metadata) for display during inspection. Falls back to system-generated description if needed, and accounts for darkness or smoldering states.
* **Parameters:**
  * `viewer` (`GObj`): The inspecting entity. Returns `nil` if viewer is the entity itself. May return `"DESCRIBE_TOODARK"` or `"DESCRIBE_SMOLDERING"` under special conditions.

## Events & Listeners
None identified.