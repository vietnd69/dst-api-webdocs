---
id: decoratedgrave_ghostmanager
title: Decoratedgrave Ghostmanager
description: This component dynamically manages the spawning and despawning of ghost entities from decorated graves based on nearby Wendy players and their skill progression.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: world
source_hash: d53bf7eb
---

# Decoratedgrave Ghostmanager

## Overview
This component is responsible for tracking decorated graves and players with the "ghostlyfriend" tag (specifically Wendy). It continuously monitors the proximity of these players to registered decorated graves and, if the player has a specific skill activated, it will dynamically spawn "graveguard_ghost" entities near the graves, up to a configurable limit. It also manages the despawning of these ghosts if the player moves too far away or if the grave is removed.

## Dependencies & Tags
This component implicitly relies on the following:
*   `player.components.skilltreeupdater`: Checked to determine if a player has activated specific skills (e.g., `wendy_gravestone_1`).
*   `ghost.components.health`: Used to determine if a spawned ghost is dead for despawn timing.
*   `TheWorld`: For checking `ismastersim`.
*   `AllPlayers`: To initialize tracking of existing players.
*   `TUNING.WENDYSKILL_GRAVESTONE_GHOSTCOUNT`: A game tuning value for the maximum number of ghosts a player can have.
*   `TUNING.WENDYSKILL_GRAVEGHOST_DEADTIME`: A game tuning value for ghost despawn time when dead.
*   `SpawnPrefab`: To create `graveguard_ghost` entities.
*   `FindClosestPlayer`: To determine if a ghost needs to despawn.

**Tags:**
*   Checks if a player `HasTag("ghostlyfriend")` to identify eligible ghost-summoning players.
*   Does not add any tags to the entity it is attached to.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `self.inst` | `Entity` | `inst` | A reference to the entity this component is attached to. |

## Main Functions
### `RegisterDecoratedGrave(grave)`
*   **Description:** Registers a decorated grave with the ghost manager. If this is the first grave registered, it will start the component's update loop. The grave is initially marked as not having an active ghost.
*   **Parameters:**
    *   `grave`: (`Entity`) The decorated grave entity to register.

### `UnregisterDecoratedGrave(grave)`
*   **Description:** Unregisters a decorated grave from the ghost manager. This will trigger the removal process for any ghost associated with that grave and clean up internal tracking.
*   **Parameters:**
    *   `grave`: (`Entity`) The decorated grave entity to unregister.

### `OnUpdate(dt)`
*   **Description:** This function is called periodically when the component is updating. It manages the core logic for ghost spawning and despawning. It iterates through registered players and graves, checking player skill status, grave proximity, and current ghost counts to decide whether to spawn new ghosts or despawn existing ones that are too far from any player.
*   **Parameters:**
    *   `dt`: (`number`) The time elapsed since the last update.

### `GetDebugString()`
*   **Description:** Returns a string containing debug information about the current state of the ghost manager, specifically the total number of registered graves and the number of currently active ghosts.
*   **Parameters:** None.

## Events & Listeners
*   `inst:ListenForEvent("ms_playerjoined", OnPlayerJoined)`: Listens for new players joining the master simulation to track them if they are a "ghostlyfriend".
*   `inst:ListenForEvent("ms_playerleft", OnPlayerLeft)`: Listens for players leaving the master simulation to stop tracking them and potentially stop the component's update if no "ghostlyfriends" remain.
*   `inst:ListenForEvent("onremove", OnDecoratedGraveRemoved, grave)`: Dynamically registered for each decorated grave to clean up tracking when a grave is removed.
*   `self.inst:ListenForEvent("onremove", function, new_ghost)`: Dynamically registered for each spawned `graveguard_ghost` to handle its despawn or a temporary state when it's removed.