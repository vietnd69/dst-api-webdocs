---
id: boatpatch
title: Boatpatch
description: Manages the properties of a boat patch item used for repairing boats.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Boatpatch

## Overview
This component identifies an entity as a "boat patch", an item used for repairing boats. It stores the specific type of the patch, which other game systems can use to determine its repair properties.

## Dependencies & Tags
- **Tags:** Adds the `boat_patch` tag to the entity upon initialization.

## Properties
| Property     | Type          | Default Value | Description                                                                |
|--------------|---------------|---------------|----------------------------------------------------------------------------|
| `inst`       | `table`       | `inst`        | The entity instance this component is attached to.                         |
| `patch_type` | `string`      | `nil`         | A string identifier for the type of patch (e.g., "wood", "thulecite"). |

## Main Functions
### `GetPatchType()`
* **Description:** Returns the type of the boat patch.
* **Parameters:** This function does not take any parameters.