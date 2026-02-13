---
id: brightmarespawner
title: Brightmarespawner
description: Manages the dynamic spawning and population control of Gestalts (Brightmares) around players experiencing lunacy.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: world
---

# Brightmarespawner

## Overview
The `Brightmarespawner` is a master-side component responsible for managing the entire lifecycle of Brightmare Gestalts in the world. It monitors players who enter the "lunacy" sanity mode and periodically attempts to spawn Gestalts near them based on their sanity percentage. The component controls population density, ensuring that the number of Gestalts near a player does not exceed configured limits. It also provides utility functions for existing Gestalts to find new player targets or relocation points.

This component only becomes active when at least one player is in lunacy mode.

## Dependencies & Tags
None identified.

## Properties

| Property | Type   | Default Value | Description                                          |
| -------- | ------ | ------------- | ---------------------------------------------------- |
| `inst`   | entity | `inst`        | A reference to the entity instance this component is on. |

## Main Functions

### `FindBestPlayer(gestalt)`
* **Description:** Searches for the most suitable player for a given Gestalt to target. The "best" player is determined by proximity, their current sanity level, and the number of other Gestalts already in their vicinity. It will only consider players who are valid targets (e.g., not dead, not a ghost) and are currently in lunacy.
* **Parameters:**
    * `gestalt` (entity): The Gestalt entity that is searching for a new target.

### `FindRelocatePoint(gestalt)`
* **Description:** Calculates a valid spawn point near a Gestalt's current tracking target. This is used when a Gestalt needs to teleport or reposition itself. The distance of the new point is determined by tuning values and whether the Gestalt is trying to morph.
* **Parameters:**
    * `gestalt` (entity): The Gestalt entity that needs a new location.

### `GetDebugString()`
* **Description:** Returns a string formatted for debugging, indicating the total number of Gestalts currently being tracked by the spawner.
* **Parameters:** None.

## Events & Listeners
*   **`ms_playerjoined`**: When a player joins the server, the component begins listening to that player's `sanitymodechanged` event to track if they enter lunacy.
*   **`ms_playerleft`**: When a player leaves, the component stops tracking them and their associated events.
*   **`sanitymodechanged` (on player entity)**: Listens for players entering or exiting the lunacy state. It adds players to an internal tracking table when they enter lunacy and removes them when they leave, starting or stopping the spawning logic accordingly.
*   **`onremove` (on Gestalt entity)**: Listens for when a spawned Gestalt is removed from the world, so it can be removed from the internal tracking table.