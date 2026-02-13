---
id: acidbatwavemanager
title: Acidbatwavemanager
description: Manages dynamic Acid Bat attack waves during acid rain based on players' inventories, world state, and internal cooldowns.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: world
---

# acidbatwavemanager

## Overview
The `acidbatwavemanager` component is responsible for managing the spawning of Acid Bat waves during acid rain events. It tracks players' inventories for specific items (default: `nitre`), calculates the odds of spawning a wave based on the quantity of these items, issues warnings to players, and then spawns a group of Acid Bats. It handles player joining/leaving, saving/loading wave progress, and integrates with the game's acid rain and general spawning pause systems. This component ensures that the Acid Bat wave mechanic functions dynamically based on player actions and world state.

## Dependencies & Tags
None identified for direct component reliance via `AddComponent` or entity tags. This component primarily interacts with the following systems and entity components:
- `TheWorld` and `TheWorld.Map` for world state and map queries.
- `TUNING` constants for configuration values.
- `AllPlayers` global table for player management.
- Player components: `player.components.inventory`, `player.components.talker`.
- Spawns the `"bat"` prefab.
- Requires `easing` and `util/sourcemodifierlist`.

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `spawn_dist` | number | `TUNING.ACIDBATWAVE_SPAWN_DISTANCE` | The maximum distance from a player at which Acid Bats will attempt to spawn. |
| `max_target_prefab` | number | `TUNING.ACIDBATWAVE_NUMBER_OF_ITEMS_TO_GUARANTEE_WAVE_SPAWN` | The number of `target_prefab` items a player needs to carry to guarantee a bat wave spawn (after cooldown). |
| `cooldown_between_waves` | number | `TUNING.ACIDBATWAVE_COOLDOWN_BETWEEN_WAVES` | The minimum time, in seconds, between successful Acid Bat wave spawns for a single player. |
| `time_for_warning` | number | `TUNING.ACIDBATWAVE_TIME_FOR_WARNING` | The duration, in seconds, between a wave warning being issued and the actual bat spawn. |
| `target_prefab` | string | `"nitre"` | The prefab name of the inventory item that influences Acid Bat wave spawns. |
| `update_time_seconds` | number | `10` | The interval, in seconds, at which the component's `OnUpdate` function performs major logic (e.g., odds calculation, wave attempts). |
| `update_time_accumulator` | number | `0` | An internal timer used to track `update_time_seconds`. |
| `pausesources` | `SourceModifierList` | `SourceModifierList(inst, false, SourceModifierList.boolean)` | Manages various sources that can temporarily pause the spawning of Acid Bat waves. |
| `acidbats` | table | `{}` | A table tracking currently spawned Acid Bat entities managed by this component. |
| `players` | table | `{}` | A cache of all currently joined players in the game. |
| `watching` | table | `{}` | A table of players currently being monitored for Acid Bat wave conditions, storing their associated metadata. |
| `savedplayermetadata` | table | `{}` | Stores wave-related metadata for players who have disconnected, to be loaded upon their return. |

## Main Functions
### `TrackAcidBat(bat)`
*   **Description:** Adds an Acid Bat entity to the component's internal tracking list, allowing it to monitor the bat's lifecycle and potentially save its state.
*   **Parameters:**
    *   `bat` (entity): The Acid Bat entity to track.

### `GetAcidBatSpawnPoint(pt)`
*   **Description:** Calculates a suitable spawn point for an Acid Bat wave around a given world position, ensuring it's within `self.spawn_dist`, walkable, and not near a hole.
*   **Parameters:**
    *   `pt` (vector3): The central world position (e.g., player's location) to find a spawn point around.

### `SpawnAcidBatForPlayerAt(player, pt)`
*   **Description:** Spawns a single "bat" prefab at a specified point, initially removing it from the scene, then returning it after a short random delay with a "fly_back" event.
*   **Parameters:**
    *   `player` (entity): The player for whom the bat is being spawned (used for context, though not directly for positioning here).
    *   `pt` (vector3): The world position where the bat should spawn.

### `CreateAcidBatsForPlayer(player, playermetadata)`
*   **Description:** Determines the number of Acid Bats to spawn for a given player based on their `target_prefab_count` and spawns them.
*   **Parameters:**
    *   `player` (entity): The player for whom bats are being created.
    *   `playermetadata` (table): The player's associated metadata, containing `target_prefab_count`.

### `CountTargetPrefabForPlayer(player)`
*   **Description:** Counts the total number of `self.target_prefab` items in a player's inventory, considering stack sizes, up to `self.max_target_prefab`.
*   **Parameters:**
    *   `player` (entity): The player whose inventory is being checked.

### `CreateMetaDataForPlayer(player)`
*   **Description:** Initializes or retrieves and updates wave-related metadata for a player, including their `target_prefab_count` and `odds_to_spawn_wave`. It also handles restoring saved metadata for returning players.
*   **Parameters:**
    *   `player` (entity): The player for whom metadata is being created/retrieved.

### `StartWatchingPlayer(player)`
*   **Description:** Begins monitoring a player for Acid Bat wave conditions. This involves adding them to the `self.watching` table, creating metadata, and registering inventory change listeners. It also starts the component's `OnUpdate` loop if no players were previously being watched.
*   **Parameters:**
    *   `player` (entity): The player to start watching.

### `StopWatchingPlayer(player)`
*   **Description:** Ceases monitoring a player. It removes them from `self.watching`, unregisters inventory listeners, and saves their metadata if acid rain is active. It also stops the component's `OnUpdate` loop if no players are left being watched.
*   **Parameters:**
    *   `player` (entity): The player to stop watching.

### `StartWatchingPlayers()`
*   **Description:** Iterates through all known players and calls `StartWatchingPlayer` for each, initiating monitoring for all active players.

### `StopWatchingPlayers()`
*   **Description:** Iterates through all known players and calls `StopWatchingPlayer` for each, stopping monitoring for all active players and clearing any saved metadata.

### `OnIsAcidRaining(isacidraining)`
*   **Description:** A callback triggered when the world's `isacidraining` state changes. It calls `StartWatchingPlayers()` when acid rain begins and `StopWatchingPlayers()` when it ends.
*   **Parameters:**
    *   `isacidraining` (boolean): The current state of acid rain in the world.

### `OnPostInit()`
*   **Description:** A lifecycle method called after the component has been fully initialized. It ensures the manager's state (e.g., watching players) is correctly set up based on the initial world `isacidraining` state.

### `UpdateOddsForPlayer(player, playermetadata)`
*   **Description:** Calculates and updates the `odds_to_spawn_wave` for a player based on their `target_prefab_count`, considering their location (cannot spawn if dead/ghost or outside acid rain area). Uses `easing.inQuad` for a non-linear scaling of odds.
*   **Parameters:**
    *   `player` (entity): The player whose odds are being updated.
    *   `playermetadata` (table): The player's associated metadata.

### `TryToSpawnWaveForPlayer(player, playermetadata, t)`
*   **Description:** Manages the wave spawning logic for a player. This includes checking if spawning is paused, handling warning periods, enforcing cooldowns, and performing a luck roll to determine if a wave should be initiated. If a wave is triggered, it issues a warning.
*   **Parameters:**
    *   `player` (entity): The player potentially receiving a wave.
    *   `playermetadata` (table): The player's associated metadata.
    *   `t` (number): The current game time.

### `SpawnWaveForPlayer(player, playermetadata)`
*   **Description:** Initiates the actual spawning of Acid Bats for a player after a warning period has concluded. It clears any active warning timers and then calls `CreateAcidBatsForPlayer`.
*   **Parameters:**
    *   `player` (entity): The player for whom the wave is spawning.
    *   `playermetadata` (table): The player's associated metadata.

### `IssueWarningForPlayer(player, playermetadata, t)`
*   **Description:** Triggers visual and auditory warnings for a player when an Acid Bat wave is imminent. It spawns a visual effect and schedules the player to deliver a warning speech. This function prevents repeated warnings within a short timeframe.
*   **Parameters:**
    *   `player` (entity): The player who should receive the warning.
    *   `playermetadata` (table): The player's associated metadata.
    *   `t` (number): The current game time.

### `OnUpdate(dt)`
*   **Description:** The component's main update loop, called periodically. It handles updating warning effects, accumulating time, and, at `self.update_time_seconds` intervals, updates player odds and attempts to spawn waves for all watched players.
*   **Parameters:**
    *   `dt` (number): The delta time since the last update.

### `SetSaveDataForMetaData(savedata, playermetadata, t)`
*   **Description:** Helper function to populate a `savedata` table with relevant wave-related timings (adjusted to relative time) from a player's metadata for persistence.
*   **Parameters:**
    *   `savedata` (table): The table to populate with save data.
    *   `playermetadata` (table): The player's current metadata.
    *   `t` (number): The current game time, used to convert absolute times to relative.

### `OnSave()`
*   **Description:** Serializes the component's current state, including active player wave timers and tracked Acid Bats, into a `data` table and a list of entity GUIDs for saving.
*   **Parameters:** None.

### `OnLoad(data)`
*   **Description:** Deserializes saved data upon world load, restoring player wave metadata and Acid Bat tracking.
*   **Parameters:**
    *   `data` (table): The table containing saved component data.

### `LoadPostPass(newents, savedata)`
*   **Description:** A post-load function called after all entities have been loaded. It re-establishes tracking for Acid Bat entities that were alive when the game was saved.
*   **Parameters:**
    *   `newents` (table): A map of old GUIDs to newly spawned entities.
    *   `savedata` (table): The component's saved data.

## Events & Listeners
*   **Listens to `self.inst` for:**
    *   `ms_playerjoined` (triggers `self.OnPlayerJoined`) - To track new players.
    *   `ms_playerleft` (triggers `self.OnPlayerLeft`) - To stop tracking disconnected players.
    *   `pausehounded` (triggers `self.OnPauseHounded`) - To pause wave spawning based on external sources.
    *   `unpausehounded` (triggers `self.OnUnpauseHounded`) - To unpause wave spawning based on external sources.
*   **Listens to `TheWorld` for:**
    *   World state `isacidraining` (triggers `self:OnIsAcidRaining`) - To start/stop monitoring players based on acid rain presence.
*   **Listens to `player` entities for:**
    *   `itemget` (triggers `self.OnInventoryStateChanged`) - To update target item count.
    *   `itemlose` (triggers `self.OnInventoryStateChanged`) - To update target item count.
    *   `newactiveitem` (triggers `self.OnInventoryStateChanged`) - To update target item count.
    *   `stacksizechange` (triggers `self.OnInventoryStateChanged`) - To update target item count.
*   **Listens to `bat` entities for:**
    *   `onremove` (triggers `self.OnRemove_Bat`) - To untrack bats when they are removed from the world.
*   **Pushes/Triggers on `bat` entities:**
    *   `fly_back` (in `self.OnBatReturnToScene`) - To signal a bat to fly back into the scene after an initial delayed spawn.