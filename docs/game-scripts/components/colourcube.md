---
id: colourcube
title: Colourcube
description: This component manages ambient, insanity, and lunacy visual post-processing effects based on the player's state and environmental conditions.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: player
---

# Colourcube

## Overview
The Colourcube component is responsible for controlling various post-processing visual effects in Don't Starve Together. It dynamically applies different "colour cube" filters and screen distortions (like fisheye) to the game world as perceived by the active player. These effects are triggered by changes in game state, including time of day, season, moon phase, the player's sanity level (including lunacy mode), environmental factors like moon storms or rain domes, and specific component overrides. It blends between these visual states smoothly to enhance the game's atmosphere and player feedback.

## Dependencies & Tags
This component relies on the `easing` library for smooth transitions.
It checks if its associated entity `inst` has the `"cave"` tag to determine initial behaviour and effect tables.

## Properties
No public properties were clearly identified from the source other than the instance itself (`self.inst`). All other initialized variables are `local` within the component's closure, making them internal state.

| Property   | Type     | Default Value                                        | Description                                                          |
| :--------- | :------- | :--------------------------------------------------- | :------------------------------------------------------------------- |
| `self.inst`| `Entity` | The entity this component is attached to.            | A reference to the entity that owns this component.                  |

## Main Functions

### `self:OnUpdate(dt)`
*   **Description:** This function is called every frame to update the component's state. It manages the blending of colour cubes, updates distortion effects (time, speed, intensity), and adjusts lunacy intensity based on delta time. It triggers a sanity update if other effects necessitated a post-processor change.
*   **Parameters:**
    *   `dt`: (`number`) The time elapsed since the last frame.

### `self:LongUpdate(dt)`
*   **Description:** This function is currently implemented to call `self:OnUpdate` with the remaining blend time, suggesting it might be used for specific blend-related updates, though its direct purpose here seems to be a fallback or specific-case update.
*   **Parameters:**
    *   `dt`: (`number`) The delta time, specifically passed as `_remainingblendtime` from `OnUpdate`.

### `self:SetDistortionModifier(modifier)`
*   **Description:** Sets a global modifier for the distortion effects. After setting, it forces an update of the sanity-related distortion parameters on the currently activated player.
*   **Parameters:**
    *   `modifier`: (`number`) A numerical value to modify distortion intensity.

### `self:GetDebugString()`
*   **Description:** Returns a formatted string containing various internal state variables for debugging purposes, including override statuses, remaining blend time, and the current and target colour cube textures for ambient, sanity, and lunacy channels.
*   **Parameters:** None.

## Events & Listeners
This component listens for several events to react to game state changes and player actions.

*   `inst:ListenForEvent("playeractivated", OnPlayerActivated)`: Triggered when a player becomes the active player, initiating event listeners specific to that player.
*   `inst:ListenForEvent("playerdeactivated", OnPlayerDeactivated)`: Triggered when a player ceases to be the active player, removing player-specific event listeners and resetting effects.
*   `inst:ListenForEvent("phasechanged", OnPhaseChanged)`: Triggered when the game's day/dusk/night phase changes, updating ambient colour cubes.
*   `inst:ListenForEvent("moonphasechanged2", OnMoonPhaseChanged2)`: Triggered when the moon phase changes, specifically checking for full moon.
*   `inst:ListenForEvent("moonphasestylechanged", OnMoonPhaseStyleChanged)`: Triggered when the moon phase style changes (e.g., "alter_active" for a lunar event).
*   `inst:ListenForEvent("seasontick", OnSeasonTick)`: Triggered when the game season changes (only outside of caves), updating ambient colour cubes.
*   `inst:ListenForEvent("overridecolourcube", OnOverrideColourCube)`: Allows external entities to temporarily override the active colour cube texture.
*   `inst:ListenForEvent("overridecolourmodifier", OnOverrideColourModifier)`: Allows external entities to temporarily override the global colour modifier.

When a player is activated, the component also listens to these events *on the activated player*:
*   `player:ListenForEvent("sanitydelta", OnSanityDelta)`: Triggered when the player's sanity changes, adjusting sanity and lunacy distortion effects.
*   `player:ListenForEvent("ccoverrides", OnOverrideCCTable)`: Allows external components on the player (e.g., `playervision`) to provide an overriding colour cube table.
*   `player:ListenForEvent("ccphasefn", OnOverrideCCPhaseFn)`: Allows external components on the player to provide an overriding function for determining the current colour cube phase. This can include listening to dynamic events specified by the override function.
*   `player:ListenForEvent("stormlevel", OnStormLevelChanged)`: Triggered when the player's storm level changes, specifically checking for moon storms.
*   `player:ListenForEvent("enterraindome", OnEnterRainDome)`: Triggered when the player enters a rain dome, affecting fisheye intensity.
*   `player:ListenForEvent("exitraindome", OnExitRainDome)`: Triggered when the player exits a rain dome, affecting fisheye intensity.