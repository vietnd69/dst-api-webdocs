---
id: deerclopsspawner
title: Deerclopsspawner
description: This component manages the spawning conditions, warning phases, and targeting logic for the Deerclops boss in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: world
source_hash: a4dce30e
---

# Deerclopsspawner

## Overview
The `Deerclopsspawner` component is responsible for orchestrating the appearance and behavior of the Deerclops boss within the game world. It is a master simulation-only component that tracks game time, player activity, and season changes (primarily winter) to determine when and where Deerclops should spawn. It manages the warning phases, selects a target player based on nearby structures, and handles the actual entity spawning or retrieval of a stored Deerclops.

## Dependencies & Tags
This component internally references `TheWorld.components.worldsettingstimer` to manage attack timers. It queries players for their `areaaware` and `talker` components, and interacts with the `knownlocations` component of the spawned Deerclops.

*   **Searched Tags:**
    *   `structure`: Used to identify potential base locations near players for targeting.
    *   `deerclops`: Used to check if a Deerclops is already present in the world.

## Properties
No public properties were clearly identified from the source, other than the standard `self.inst` reference to the component's parent entity.

## Main Functions
### `OnPostInit()`
*   **Description:** Called after the component has been fully initialized and loaded. It calculates the `_attackdelay` based on winter length and configures the `worldsettingstimer` for Deerclops attacks. It also attempts to start attacks if conditions are met.
*   **Parameters:** None.

### `DoWarningSpeech(_targetplayer)`
*   **Description:** Triggers specific warning speech from players near the chosen `_targetplayer`, indicating an imminent Deerclops attack.
*   **Parameters:**
    *   `_targetplayer`: The `Player` entity currently targeted by the Deerclops spawner for an upcoming attack.

### `DoWarningSound(_targetplayer)`
*   **Description:** Spawns a `deerclopswarning` sound prefab at the `_targetplayer`'s location. The sound's level (1-4) depends on the remaining time until Deerclops attacks, providing escalating audio warnings.
*   **Parameters:**
    *   `_targetplayer`: The `Player` entity currently targeted for a Deerclops attack.

### `OnUpdate(dt)`
*   **Description:** The primary update loop for the component. It monitors the Deerclops attack timer, manages the warning phase, picks or re-evaluates attack targets, and triggers warning speeches/sounds as needed. If an active Deerclops is present or no timer is running, it stops further updates.
*   **Parameters:**
    *   `dt`: The delta time (time elapsed since the last frame) in seconds.

### `LongUpdate(dt)`
*   **Description:** This function simply calls `self:OnUpdate(dt)`. It is part of the game's update loop, which may be called less frequently than `OnUpdate` for certain components.
*   **Parameters:**
    *   `dt`: The delta time (time elapsed since the last long update) in seconds.

### `OnSave()`
*   **Description:** Prepares the component's state for saving. It returns a table containing the current `_warning` status and any `_storedhassler` (Deerclops entity saved to be re-spawned later). It also lists the GUID of an `_activehassler` for the entity system to save.
*   **Parameters:** None.

### `OnLoad(data)`
*   **Description:** Loads the component's state from saved game data. It restores the `_warning` flag and any `_storedhassler` record. It also handles retrofitting `timetoattack` from older save versions.
*   **Parameters:**
    *   `data`: A table containing the saved data for this component.

### `LoadPostPass(newents, savedata)`
*   **Description:** Called after all entities in a save have been loaded and their GUIDs mapped to new entities. It uses the `savedata.activehassler` GUID to re-establish a reference to the active Deerclops entity if it was saved and re-spawned.
*   **Parameters:**
    *   `newents`: A table mapping old GUIDs to newly loaded entity references.
    *   `savedata`: The saved data originally passed to `OnLoad`.

### `GetDebugString()`
*   **Description:** Returns a string providing current debug information about the Deerclops spawner's state, including its dormancy, remaining time to attack, current target, and active/stored Deerclops status.
*   **Parameters:** None.

### `SummonMonster(player)`
*   **Description:** A debug or administrative function to immediately trigger a Deerclops attack, setting the timer to 10 seconds and ensuring the component is actively updating.
*   **Parameters:**
    *   `player`: (Optional) A `Player` entity, likely intended as a target hint, though the function itself doesn't explicitly use it for targeting.

### `SetAttacksPerWinter(attacks)`
*   **Description:** (Deprecated) This function is marked as deprecated in the source code. Its intended purpose was likely to set the number of Deerclops attacks per winter season.
*   **Parameters:**
    *   `attacks`: The number of attacks.

### `OverrideAttacksPerSeason(name, num)`
*   **Description:** (Deprecated) This function is marked as deprecated in the source code. Its intended purpose was likely to override the number of attacks for a specific season.
*   **Parameters:**
    *   `name`: The name of the season.
    *   `num`: The number of attacks.

### `OverrideAttackDuringOffSeason(name, bool)`
*   **Description:** (Deprecated) This function is marked as deprecated in the source code. Its intended purpose was likely to enable or disable attacks during off-seasons.
*   **Parameters:**
    *   `name`: The name of the season.
    *   `bool`: A boolean indicating whether attacks should occur.

## Events & Listeners
*   `ms_playerjoined` (listened by `OnPlayerJoined`): Triggered when a player joins the master simulation.
*   `ms_playerleft` (listened by `OnPlayerLeft`): Triggered when a player leaves the master simulation.
*   `season` (listened by `OnSeasonChange` via `WatchWorldState`): Triggered when the world's season changes.
*   `hasslerremoved` (listened by `OnHasslerRemoved`): Triggered when a "hassler" (e.g., Deerclops) entity is removed from the world.
*   `hasslerkilled` (listened by `OnHasslerKilled`): Triggered when a "hassler" (e.g., Deerclops) entity is killed.
*   `storehassler` (listened by `OnStoreHassler`): Triggered when a "hassler" (e.g., Deerclops) is prepared to be stored (e.g., for saving or teleportation).
*   `megaflare_detonated` (listened by `OnMegaFlare`): Triggered when a megaflare event detonates in the world, potentially spawning a Deerclops if conditions are met.