---
id: constructionbuilder
title: Constructionbuilder
description: This component manages an entity's capability to initiate, maintain, and complete construction projects by handling a temporary material container and interacting with construction sites.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: player
source_hash: f7a6c9cc
---

# Constructionbuilder

## Overview
The `Constructionbuilder` component provides the core logic for an entity (typically a player) to engage in construction. It manages the state of an ongoing build project, including the temporary container that holds construction materials, and interacts directly with the `constructionsite` component of the target structure being built. This component handles starting, stopping, finishing, and persisting construction progress.

## Dependencies & Tags
This component relies on or interacts with the following:
*   **`constructionsite` (component)**: Expected to be present on the target entity being built.
*   **`container` (component)**: Expected to be present on the `constructioninst` (the temporary prefab spawned to hold materials).
*   **`inventory` (component)**: Expected to be present on the `inst` (the builder entity) when stopping construction to return items.
*   **`constructionbuilderuidata` (client-side component)**: This client-side component is expected to exist and is used to update the UI with information about the current construction container and target.

**Tags Checked:**
*   `burnt`: Checked on the target entity to prevent construction on burnt objects.

## Properties
No public properties were clearly identified from the source. The component primarily uses internal state variables which are managed through its methods.

## Main Functions
### `onconstructioninst(self, constructioninst)`
*   **Description:** This internal setter function is triggered when `self.constructioninst` is updated. It delegates to the `constructionbuilderuidata` component to set the current construction container for UI display.
*   **Parameters:**
    *   `constructioninst` (Entity): The temporary prefab instance (e.g., a "build" container) associated with the current construction project.

### `onconstructionsite(self, constructionsite)`
*   **Description:** This internal setter function is triggered when `self.constructionsite` is updated. It delegates to the `constructionbuilderuidata` component to set the current target construction site for UI display.
*   **Parameters:**
    *   `constructionsite` (Entity): The target entity with a `constructionsite` component currently being built.

### `CanStartConstruction()`
*   **Description:** Determines if the entity is in a valid state to begin a new construction project. It checks if the entity's state graph is in the "construct" state and if there isn't an ongoing construction already.
*   **Parameters:** None

### `IsConstructing(constructioninst)`
*   **Description:** Checks if the entity is currently constructing a *specific* temporary `constructioninst`.
*   **Parameters:**
    *   `constructioninst` (Entity): The specific temporary prefab instance to check against.

### `IsConstructingAny()`
*   **Description:** Checks if the entity is currently involved in *any* construction project. This is true if `self.constructioninst` is set and the entity's state graph is in the "constructing" state.
*   **Parameters:** None

### `StartConstruction(target)`
*   **Description:** Initiates a construction project towards a specified target entity. It verifies the target's validity, spawns a temporary `constructioninst` prefab (e.g., a container for materials), sets it up as a child of the builder, opens its container for the builder, and updates the state graph. Returns `true` on success, or `false` with a reason string if construction cannot start.
*   **Parameters:**
    *   `target` (Entity): The entity with a `constructionsite` component that is intended to be built.

### `StopConstruction()`
*   **Description:** Halts any ongoing construction project. If a `constructioninst` is active, it drops its contents (either to the builder's inventory or onto the ground) and removes itself. It also cleans up references to the `constructionsite` and notifies it that construction has stopped.
*   **Parameters:** None

### `FinishConstruction()`
*   **Description:** Prepares the construction for final completion. It verifies that a construction is active, the container is not empty, and the target `constructionsite` is enabled. It then closes the construction container and transitions the builder's state graph to "construct_pst". This is typically a precursor to `OnFinishConstruction`.
*   **Parameters:** None

### `OnFinishConstruction()`
*   **Description:** Finalizes the construction project. This method is typically called after the builder has completed the "construct_pst" animation state. It gathers all items from the temporary `constructioninst` container, notifies the `constructionsite` to perform its build logic (consuming the items), and then cleans up the temporary `constructioninst` and references.
*   **Parameters:** None

### `OnSave()`
*   **Description:** Serializes the current construction state for saving. It returns a save record for the active `constructioninst` if one exists and its container is not empty.
*   **Parameters:** None

### `OnLoad(data)`
*   **Description:** Deserializes and restores a previously saved construction state. It spawns the `constructioninst` from the provided save data and re-establishes its connection to the builder entity.
*   **Parameters:**
    *   `data` (table): The save data containing information about the `constructioninst`.

## Events & Listeners
*   **Listens For:**
    *   `onremove` (from `self.constructionsite`): If the target `constructionsite` entity is removed while construction is active, `StopConstruction()` is called.
*   **Pushes/Triggers:**
    *   `stopconstruction` (on `self.inst`): Pushed when `StopConstruction()` is called, indicating that construction has ceased.