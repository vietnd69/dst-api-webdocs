---
id: dynamicmusic
title: Dynamicmusic
description: This component manages dynamic music playback and stingers based on player actions, location, and various world states within Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: audio
source_hash: 8358ff31
---

# Dynamicmusic

## Overview
The Dynamicmusic component is responsible for orchestrating the game's adaptive soundtrack. It listens to player actions, environmental changes, and specific game events to play context-appropriate music, such as "busy" themes for working, "danger" themes for combat, or specific event-triggered tracks. It manages the starting, stopping, and intensity of these musical cues, ensuring a dynamic auditory experience based on the current gameplay situation.

## Dependencies & Tags
This component implicitly relies on the existence of a `TheFocalPoint.SoundEmitter` for audio playback. It interacts with various other components through events, primarily `player.components.areaaware` for location-based music and `player.replica.combat` for combat-related music.

**Tags monitored/used:**
*   `inst:HasTag("cave")`: Determines if the entity is in a cave environment.
*   `player:HasTag("attack")`: Checked to detect player attacking actions.
*   `player:HasTag("working")`: Checked to detect player working actions (e.g., chopping, mining).
*   `_combat` (on target): Indicates a target entity is involved in combat.
*   `epic` (on entities): Triggers "epic fight" music.
*   `noepicmusic` (on entities): Prevents "epic fight" music.
*   `crewmember` (on entities): Used to detect nearby pirate crew for warning music.
*   `NON_DANGER_TAGS` (on attacker): Excludes certain attackers from triggering danger music, including `"noepicmusic"`, `"shadow"`, `"shadowchesspiece"`, `"smolder"`, `"thorny"`, `"nodangermusic"`.

## Properties
No public properties were clearly identified from the source. The `self.inst` reference is standard for components. All other variables are local (private) to the component's scope.

## Main Functions
The component's core logic is encapsulated in several internal functions that manage different music states. These functions are typically triggered by specific events or world state changes.

### `StartBusy(player)`
*   **Description:** Initiates or extends the "busy" music, which plays during general working activities. The specific track depends on the player's current location (forest, cave, ruins, lunar island) and the current season.
*   **Parameters:**
    *   `player`: The player entity whose actions trigger the busy music.

### `StopBusy(inst, istimeout)`
*   **Description:** Stops the currently playing "busy" music. If `istimeout` is true and `_extendtime` is still active, the music may be extended instead of immediately stopping.
*   **Parameters:**
    *   `inst`: The component's parent instance (entity).
    *   `istimeout`: A boolean indicating if the stop request came from a timeout task.

### `ExtendBusy()`
*   **Description:** Extends the duration of the currently playing "busy" music by an additional 10 seconds.

### `StartOcean(player)`
*   **Description:** Initiates or extends "ocean" themed busy music, typically associated with sailing or being on water.
*   **Parameters:**
    *   `player`: The player entity triggering the ocean music.

### `StartFeasting(player)`
*   **Description:** Initiates or extends "feasting" themed busy music, associated with the player actively feasting.
*   **Parameters:**
    *   `player`: The player entity triggering the feasting music.

### `StartRacing(player)`
*   **Description:** Initiates "racing" themed music.
*   **Parameters:**
    *   `player`: The player entity triggering the racing music.

### `StartHermit(player)`
*   **Description:** Initiates "hermit" themed music.
*   **Parameters:**
    *   `player`: The player entity triggering the hermit music.

### `StartTraining(player)`
*   **Description:** Initiates "training" themed music.
*   **Parameters:**
    *   `player`: The player entity triggering the training music.

### `StartFarming(player)`
*   **Description:** Initiates "farming" themed music.
*   **Parameters:**
    *   `player`: The player entity triggering the farming music.

### `StartCarnivalMusic(player, is_game_active)`
*   **Description:** Plays carnival-themed music, switching between ambient and minigame tracks based on `is_game_active`.
*   **Parameters:**
    *   `player`: The player entity.
    *   `is_game_active`: Boolean indicating if a carnival minigame is active.

### `StartStageplayMusic(player, mood_index)`
*   **Description:** Plays stageplay-themed music based on a provided mood index (1: Happy, 2: Mysterious, 3: Dramatic, 4: Confession).
*   **Parameters:**
    *   `player`: The player entity.
    *   `mood_index`: A number representing the desired stageplay mood.

### `StartPillowFightMusic(player)`
*   **Description:** Plays music specifically for a pillow fight event.
*   **Parameters:**
    *   `player`: The player entity.

### `StartRideoftheValkyrieMusic(player)`
*   **Description:** Plays specific "Ride of the Valkyrie" music, typically associated with Wigfrid.
*   **Parameters:**
    *   `player`: The player entity.

### `StartBoatRaceMusic(player)`
*   **Description:** Plays music specifically for a boat race event.
*   **Parameters:**
    *   `player`: The player entity.

### `StartBalatroMusic(player)`
*   **Description:** Plays music for the Balatro minigame.
*   **Parameters:**
    *   `player`: The player entity.

### `StartDanger(player)`
*   **Description:** Initiates "danger" music (either "epic fight" or general danger) based on nearby hostile entities or player combat. The specific track depends on location (ruins, cave) and season.
*   **Parameters:**
    *   `player`: The player entity whose actions or proximity to danger trigger the music.

### `StopDanger(inst, istimeout)`
*   **Description:** Stops the currently playing "danger" music. If `istimeout` is true and `_extendtime` is still active, the music may be extended instead of immediately stopping.
*   **Parameters:**
    *   `inst`: The component's parent instance (entity).
    *   `istimeout`: A boolean indicating if the stop request came from a timeout task.

### `StartTriggeredDanger(player, data)`
*   **Description:** Plays specific, pre-defined danger music tracks, often used for boss fights or unique events. The `data` table specifies the music name and intensity level.
*   **Parameters:**
    *   `player`: The player entity.
    *   `data`: A table containing `name` (string key for `TRIGGERED_DANGER_MUSIC` table) and `level` (number, defaults to 1) for the specific music track. Also includes `duration`.

### `StartPirates(player)`
*   **Description:** Initiates a periodic task to check for nearby pirate entities and plays pirate-themed warning music if found.
*   **Parameters:**
    *   `player`: The player entity.

### `StopPirates()`
*   **Description:** Stops the periodic pirate check and the associated pirate warning music.

### `OnEnableDynamicMusic(inst, enable)`
*   **Description:** Enables or disables the entire dynamic music system. Disabling will stop any currently playing dynamic music.
*   **Parameters:**
    *   `inst`: The component's parent instance.
    *   `enable`: Boolean; `true` to enable, `false` to disable.

## Events & Listeners
This component primarily functions by listening to various events from its parent instance (`inst`) and the currently active player entity (`player`).

*   `inst:ListenForEvent("playeractivated", OnPlayerActivated)`: Triggers when a player activates, setting up listeners for that specific player.
*   `inst:ListenForEvent("playerdeactivated", OnPlayerDeactivated)`: Triggers when a player deactivates, removing listeners from that player.
*   `inst:ListenForEvent("enabledynamicmusic", OnEnableDynamicMusic)`: Triggers to enable or disable the component's music functionality.
*   `player:ListenForEvent("buildsuccess", StartBusy)`: Starts busy music when the player successfully builds an item.
*   `player:ListenForEvent("gotnewitem", ExtendBusy)`: Extends busy music when the player receives a new item.
*   `player:ListenForEvent("performaction", CheckAction)`: Checks player actions (attacking, working) to potentially start busy or danger music.
*   `player:ListenForEvent("attacked", OnAttacked)`: Starts danger music if the player is attacked by a valid hostile entity.
*   `player:ListenForEvent("goinsane", OnInsane)`: Plays a sanity stinger when the player goes insane.
*   `player:ListenForEvent("goenlightened", OnEnlightened)`: Plays a lunacy stinger when the player becomes enlightened.
*   `player:ListenForEvent("triggeredevent", StartTriggeredDanger)`: Plays specific danger music tracks based on event data.
*   `player:ListenForEvent("playboatmusic", StartTriggeredWater)`: Initiates ocean-themed music if the player is on a platform.
*   `player:ListenForEvent("isfeasting", StartTriggeredFeasting)`: Starts feasting music if the player is in a feasting state.
*   `player:ListenForEvent("playracemusic", StartRacing)`: Starts racing music.
*   `player:ListenForEvent("playhermitmusic", StartHermit)`: Starts hermit-themed music.
*   `player:ListenForEvent("playtrainingmusic", StartTraining)`: Starts training music.
*   `player:ListenForEvent("playpiratesmusic", StartPirates)`: Starts periodic checks for pirates to play warning music.
*   `player:ListenForEvent("playfarmingmusic", StartFarming)`: Starts farming music.
*   `player:ListenForEvent("hasinspirationbuff", OnHasInspirationBuff)`: Adjusts danger music parameters based on the Wathgrithr inspiration buff.
*   `player:ListenForEvent("playcarnivalmusic", StartCarnivalMusic)`: Plays carnival-themed music.
*   `player:ListenForEvent("stageplaymusic", StartStageplayMusic)`: Plays stageplay-themed music based on mood.
*   `player:ListenForEvent("playpillowfightmusic", StartPillowFightMusic)`: Plays pillow fight music.
*   `player:ListenForEvent("playrideofthevalkyrie", StartRideoftheValkyrieMusic)`: Plays Ride of the Valkyrie music.
*   `player:ListenForEvent("playboatracemusic", StartBoatRaceMusic)`: Plays boat race music.
*   `player:ListenForEvent("playbalatromusic", StartBalatroMusic)`: Plays Balatro minigame music.
*   `inst:WatchWorldState("phase", OnPhase)`: (When not in cave) Triggers a stinger for day or dusk transitions.
*   `inst:WatchWorldState("season", OnSeason)`: (When not in cave) Clears the busy theme when the season changes.