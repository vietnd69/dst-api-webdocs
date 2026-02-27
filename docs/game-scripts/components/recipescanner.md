---
id: recipescanner
title: Recipescanner
description: This component enables an entity to scan targets and unlock crafting recipes for the doer based on the scanned item's recipe data.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: crafting
source_hash: 4f546cbd
---

# Recipescanner

## Overview
The Recipescanner component is attached to entities that act as scanning devices (e.g., the Scanning Station). When a target is scanned, it resolves the corresponding recipe, validates unlock conditions, unlocks the recipe for the doer if possible, and triggers associated events. It integrates with the builder system and enforces recipe unlock logic, including restrictions like `nounlock`, `no_deconstruction`, and builder capacity.

## Dependencies & Tags
- Adds the `"recipescanner"` tag to the entity on initialization.
- Removes the `"recipescanner"` tag when the component is removed from the entity.
- Relies on the following components being present on relevant entities:
  - `doer` must have a `"builder"` component.
  - `target` must support `"NOCLICK"` tag and may define `SCANNABLE_RECIPENAME` or rely on `target.prefab`.

## Properties
| Property       | Type     | Default Value | Description                                                                 |
|----------------|----------|---------------|-----------------------------------------------------------------------------|
| `inst`         | `Entity` | —             | Reference to the entity the component is attached to (set in constructor). |
| `onscanned`    | `function` | `nil`       | Optional callback function invoked after a successful scan; set via `SetOnScannedFn`. |

## Main Functions

### `SetOnScannedFn(fn)`
* **Description:** Sets an optional callback function to be invoked whenever a scan operation completes successfully.
* **Parameters:**
  - `fn` (`function`): A function that accepts four arguments: `scanner` (the scanning entity), `target` (the scanned entity), `doer` (the player/entity performing the scan), and `recipe_name` (string).

### `Scan(target, doer)`
* **Description:** Attempts to scan a `target` entity and unlock its corresponding recipe for the `doer`. Returns a boolean indicating success, and optionally a reason string on failure (e.g., `"CANTLEARN"`, `"KNOWN"`).
* **Parameters:**
  - `target` (`Entity`): The entity being scanned (must be a valid scannable item).
  - `doer` (`Entity`): The entity performing the scan (must have a `"builder"` component).
* **Returns:**
  - `success` (`boolean`): `true` if the recipe was unlocked, `false` otherwise.
  - `reason` (`string`, optional): A string explaining why the scan failed (`"CANTLEARN"` or `"KNOWN"`).

## Events & Listeners
- **Pushes:** `"onrecipescanned"` on the `target` entity with payload `{ scanner = self.inst, doer = doer, recipe = recipe.name }` after a successful scan.
- **No internal event listeners are registered**—the component does not listen for any events via `inst:ListenForEvent`.