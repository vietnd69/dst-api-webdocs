---
id: ambientsound
title: Ambientsound
description: Mixes and plays dynamic ambient, wave, sanity, and enlightenment sounds around the player based on environment and player state.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: player
source_hash: 533a5b6a
---

# ambientsound

## Overview
The `ambientsound` component is responsible for managing the dynamic ambient soundscape around the player in Don't Starve Together. It continuously monitors the player's position, the surrounding world tiles, current season, weather conditions, time of day, and the player's sanity/lunacy levels to mix and play appropriate background sounds. This component aims to create an immersive auditory experience by fading between different environmental sounds, including tile-specific ambients, wave sounds, and unique sanity/enlightenment effects. It typically resides on the `ThePlayer` entity on the client side to provide local ambient audio.

## Dependencies & Tags
*   **Component Dependencies:**
    *   `inst.Map`: Requires access to the entity's map data to determine tile types.
    *   `inst.SoundEmitter`: Heavily relies on this component for playing, stopping, and setting parameters/volumes for sounds.
    *   `inst.state`: Accesses the entity's state (specifically `phase`) to determine light attenuation.
    *   `inst.net.components.lunarhailbirdsoundmanager`: Conditionally accessed to determine if birdless ambience should be applied.
    *   `ThePlayer.LightWatcher`: Accessed for the player's current light value to attenuate night/dusk ambience.
    *   `ThePlayer.replica.sanity`: Accessed for the player's sanity and lunacy state.
*   **Global Dependencies:**
    *   `easing`: A utility library for interpolation, used for volume transitions.
    *   `WORLD_TILES`: Global constants defining various tile types.
    *   `TileGroupManager`: Used to check if a tile is impassable (for wave sounds).
    *   `TheNet`: Used to check the server game mode (e.g., "quagmire") for ambient sound overrides.
    *   `TheSim`: Used to set global reverb presets.
*   **Tags:**
    *   Checks if the entity `inst` has the tag `"cave"` to determine if wave sounds should be enabled initially.
    *   Checks if `ThePlayer` has the tag `"dappereffects"` to modify sanity/lunacy sound parameters.
    None identified for addition/removal by this component.

## Properties
| Property   | Type      | Default Value | Description                                                    |
| :--------- | :-------- | :------------ | :------------------------------------------------------------- |
| `self.inst` | `Entity`  | `inst`        | A reference to the entity this component is attached to.       |

## Main Functions

### `self:SetReverbPreset(preset)`
*   **Description:** Sets a global reverb preset for the simulation, affecting how sounds generally echo or resonate within the game world.
*   **Parameters:**
    *   `preset` (`string`): The name of the reverb preset to apply (e.g., `"default"`, `"cave"`).

### `self:SetWavesEnabled(enabled)`
*   **Description:** Enables or disables the playing of wave sounds based on the environment.
*   **Parameters:**
    *   `enabled` (`boolean`): `true` to enable wave sounds, `false` to disable them.

### `self:OnPostInit()`
*   **Description:** A lifecycle method called after the component has been fully initialized. It triggers an initial update of the ambient sounds to ensure the correct sounds start playing immediately and any initial fading finishes quickly.
*   **Parameters:** None.

### `self:OnUpdate(dt)`
*   **Description:** The core update loop for the ambient sound component, called every frame (`dt` is delta time). This function is responsible for:
    *   Detecting player movement to trigger a recalculation of the ambient sound mix.
    *   Scanning tiles around the player to identify dominant tile types (within a `HALF_TILES` radius, default 5 tiles).
    *   Selecting the appropriate ambient sound for each tile based on season, weather (rain/heavy rain), and potential tile overrides.
    *   Calculating volumes for up to `MAX_MIX_SOUNDS` (default 3) based on tile presence, sorted by count.
    *   Adjusting wave sound volume (`_wavesvolume`) based on the count of impassable tiles (`wavecount`).
    *   Attenuating overall ambient volume (`_ambientvolume`) based on the player's light level during dusk/night phases, using `easing.outCubic` for smooth transitions.
    *   Starting, stopping, and adjusting volumes of ambient, wave, sanity, and enlightenment sounds via `inst.SoundEmitter`.
    *   Updating "daytime" parameters for ambient sounds based on the world phase and birdless ambience state.
    *   Updating sanity and enlightenment sound parameters based on `ThePlayer.replica.sanity` state.
*   **Parameters:**
    *   `dt` (`number`): The delta time (time elapsed since the last frame) in seconds.

### `self:GetDebugString()`
*   **Description:** Generates a formatted string containing debug information about the current state of the ambient sound component. This includes rain status, season, overall ambient volume, daytime parameters, wave volume, and a list of active ambient sounds with their calculated volumes and daytime parameters.
*   **Parameters:** None.

### `StartEnlightenmentSound()` (Internal)
*   **Description:** Starts playing the enlightenment-specific looping ambient sound (`ENLIGHTENMENT_SOUND`) with the "ENLIGHT" sound tag.
*   **Parameters:** None.

### `SetEnlightenment(sanity)` (Internal)
*   **Description:** Sets the "sanity" parameter for the active enlightenment sound, typically controlling its intensity or pitch based on the player's lunacy level.
*   **Parameters:**
    *   `sanity` (`number`): A normalized value (e.g., 0-1) representing the player's enlightenment/lunacy state.

### `StartSanitySound()` (Internal)
*   **Description:** Starts playing the sanity-specific looping ambient sound (`SANITY_SOUND`) with the "SANITY" sound tag.
*   **Parameters:** None.

### `SetSanity(sanity)` (Internal)
*   **Description:** Sets the "sanity" parameter for the active sanity sound, typically controlling its intensity or pitch based on the player's sanity level.
*   **Parameters:**
    *   `sanity` (`number`): A normalized value (e.g., 0-1) representing the player's sanity state.

### `StartWavesSound()` (Internal)
*   **Description:** Starts playing the current wave ambient sound (`_wavessound`) with the "waves" sound tag.
*   **Parameters:** None.

### `StopWavesSound()` (Internal)
*   **Description:** Stops the currently playing wave ambient sound.
*   **Parameters:** None.

### `SetWavesVolume(volume)` (Internal)
*   **Description:** Sets the volume of the active wave ambient sound.
*   **Parameters:**
    *   `volume` (`number`): The desired volume level (0-1).

## Events & Listeners
*   `inst:ListenForEvent("overrideambientsound", OnOverrideAmbientSound)`: Listens for requests to temporarily override the ambient sound associated with a specific tile type.
*   `inst:ListenForEvent("setambientsounddaytime", OnSetAmbientSoundDaytime)`: Listens for events to manually set the "daytime" parameter for ambient sounds.
*   `inst:ListenForEvent("seasontick", OnSeasonTick)`: Listens for changes in the world's season to update season-specific ambient sounds.
*   `inst:ListenForEvent("weathertick", OnWeatherTick)`: Listens for weather updates to determine if heavy rain is occurring, affecting rain-specific ambient sound selection.
*   `inst:ListenForEvent("precipitationchanged", OnPrecipitationChanged)`: Listens for changes in precipitation type to enable/disable rain ambient sounds.
*   `inst:ListenForEvent("updateambientsoundparams", OnUpdateAmbientSoundParams)`: Listens for a general request to update ambient sound parameters (e.g., daytime).
*   `inst:WatchWorldState("phase", OnPhaseChange)`: Monitors changes in the world's day/dusk/night phase to adjust light attenuation and daytime sound parameters.