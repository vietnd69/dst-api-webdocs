---
id: crabkingspawner
title: Crabkingspawner
description: Handles the logic for loading and potentially re-spawning the Crab King spawner entity based on saved game data.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: world
source_hash: f25062ff
---

# Crabkingspawner

## Overview
This component is a master simulation-only script that plays a crucial role during the save game loading process. Its primary responsibility is to ensure the `crabking_spawner` entity exists in the world. If, upon loading, a `crabking_spawner` is not found but saved data indicates its previous existence (position and respawn timer), this component will spawn a new `crabking_spawner` prefab and attempt to restore its saved state, guaranteeing the Crab King's spawning mechanism persists across game sessions.

## Dependencies & Tags
None identified for this component itself. It does, however, interact with entities tagged "crabking_spawner" and accesses components `childspawner` and `worldsettingstimer` on the `crabking_spawner` prefab it may spawn.

## Properties
No public properties were clearly identified from the source apart from the standard `self.inst` reference.

| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `inst`   | `Entity` | `nil`         | A reference to the entity this component is attached to. |

## Main Functions
### `LoadPostPass(newents, data)`
*   **Description:** This function is a callback invoked during the post-pass stage of loading a saved game. It checks if a `crabking_spawner` entity currently exists in the world (identified by the "crabking_spawner" tag). If no such entity is found, but the provided `data` contains saved coordinates (`crabkingx`, `crabkingz`) for a previous Crab King spawner, it proceeds to spawn a new `crabking_spawner` prefab at those coordinates. It then attempts to restore the newly spawned spawner's state, specifically its `childspawner.childreninside` count and `worldsettingstimer` for the "regen_crabking" timer, if `timetorespawn` data is available.
*   **Parameters:**
    *   `newents`: (`table`) A table containing references to entities that were newly spawned during the current loading process.
    *   `data`: (`table`) A table containing saved data relevant to this component. It may include `crabkingx` (number, X-coordinate), `crabkingz` (number, Z-coordinate), and `timetorespawn` (number, time remaining on the respawn timer).