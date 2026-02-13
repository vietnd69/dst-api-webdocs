---
id: closeinspector
title: Closeinspector
description: Manages custom inspection logic for an entity, allowing other components to define how it responds to inspection attempts on targets or points.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Closeinspector

## Overview
This component provides a mechanism for an entity to define and execute custom logic when it is "inspected" in close proximity, either by targeting another entity or a specific point. It acts as a configurable interface for defining contextual close-range interactions, typically beyond standard combat or interaction components, allowing other systems to query and trigger these custom behaviors.

## Dependencies & Tags
*   **Dependencies**: None identified.
*   **Tags Added**: `closeinspector` (on initialization and removed on removal).

## Properties
| Property          | Type     | Default Value | Description                                                                                             |
| :---------------- | :------- | :------------ | :------------------------------------------------------------------------------------------------------ |
| `inspecttargetfn` | function | `nil`         | A callback function invoked when `CloseInspectTarget` is called. Expected to return `success` (boolean) and an optional `reason` (string). |
| `inspectpointfn`  | function | `nil`         | A callback function invoked when `CloseInspectPoint` is called. Expected to return `success` (boolean) and an optional `reason` (string).  |

## Main Functions
### `OnRemoveFromEntity()`
*   **Description:** Called automatically when this component is removed from its owning entity. It ensures the `closeinspector` tag is removed from the entity.
*   **Parameters:** None.

### `SetInspectTargetFn(fn)`
*   **Description:** Sets the custom callback function that will be executed when an entity attempts to "close inspect" another target. This function defines the specific logic for target inspection.
*   **Parameters:**
    *   `fn`: (`function`) The callback function to set. It is expected to take `(inst, doer, target)` as arguments (where `inst` is the component's owner, `doer` is the inspecting entity, and `target` is the entity being inspected) and should return `success` (boolean) and an optional `reason` (string).

### `SetInspectPointFn(fn)`
*   **Description:** Sets the custom callback function that will be executed when an entity attempts to "close inspect" a specific point in the world. This function defines the specific logic for point inspection.
*   **Parameters:**
    *   `fn`: (`function`) The callback function to set. It is expected to take `(inst, doer, pt)` as arguments (where `inst` is the component's owner, `doer` is the inspecting entity, and `pt` is a `Vector3` representing the inspected point) and should return `success` (boolean) and an optional `reason` (string).

### `CloseInspectTarget(doer, target)`
*   **Description:** Triggers the custom inspection logic for a target if a callback function (`inspecttargetfn`) has been previously set using `SetInspectTargetFn`.
*   **Parameters:**
    *   `doer`: (`Entity`) The entity initiating the inspection.
    *   `target`: (`Entity`) The entity being inspected.
*   **Returns:** The results (`success`, `reason`) from the `inspecttargetfn` callback if it exists, otherwise `nil`.

### `CloseInspectPoint(doer, pt)`
*   **Description:** Triggers the custom inspection logic for a specific point if a callback function (`inspectpointfn`) has been previously set using `SetInspectPointFn`.
*   **Parameters:**
    *   `doer`: (`Entity`) The entity initiating the inspection.
    *   `pt`: (`Vector3`) The point (coordinates) in the world being inspected.
*   **Returns:** The results (`success`, `reason`) from the `inspectpointfn` callback if it exists, otherwise `nil`.