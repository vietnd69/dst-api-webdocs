---
id: ambientlighting
title: Ambientlighting
description: Calculates and interpolates global ambient lighting colours based on time of day, season, weather, and player night vision state.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: world
---

# ambientlighting

## Overview
The `ambientlighting` component is responsible for dynamically controlling the game's ambient and visual ambient lighting. It adjusts these lighting parameters based on various in-game factors such as the time of day, season, moon phase, weather effects (e.g., light percentage during rain), player night vision status, and screen flash events. It manages the smooth transitions between different lighting states through color interpolation.

## Dependencies & Tags
*   **Relies on Global State**: Interacts heavily with `TheWorld` (implicitly through `inst:ListenForEvent` for global events), `TheSim` (for setting ambient colors), and `Profile` (for screen flash intensity settings).
*   **Player Components**: When a player is activated, it listens to events on the player entity itself, specifically interacting with `player.components.playervision` to determine night vision status and overrides.
*   **Tags**: Checks `inst:HasTag("cave")` to apply different lighting logic for cave environments.

## Properties
| Property   | Type          | Default Value | Description                                                    |
| :--------- | :------------ | :------------ | :------------------------------------------------------------- |
| `self.inst`| `Entity`      | `inst`        | A reference to the parent entity this component is attached to.|

## Main Functions
### `self:OnUpdate(dt)`
*   **Description:** This function is called every frame the component is actively updating. It manages the smooth interpolation of `_realcolour` and `_overridecolour` towards their target values. It also handles the timing and intensity of screen flash effects. If no color lerping or flashing is active, it stops further updates until a new lighting change is triggered.
*   **Parameters:**
    *   `dt`: (`number`) The time elapsed since the last frame.

### `self:LongUpdate(dt)`
*   **Description:** This function is called during a "long update," typically when the game is resuming from a pause or a significant time jump. It immediately resolves any pending color interpolations by setting the current colours to their target values, resets the flash state, and stops the component from updating until needed again. This ensures lighting is correct instantly after a pause.
*   **Parameters:**
    *   `dt`: (`number`) The time elapsed since the last long update.

### `self:GetVisualAmbientValue()`
*   **Description:** Returns a numerical representation of the current visual ambient light intensity. This value is derived from the `_overridecolour` (which includes night vision effects) or the `_flashcolour` if a screen flash is active. It's an average of the RGB components, potentially scaled by `lightpercent`.
*   **Parameters:** None.

## Events & Listeners
This component listens for a variety of events from `TheWorld` and activated players to update the ambient lighting state.

*   `inst:ListenForEvent("phasechanged", OnPhaseChanged)`: Triggered when the time of day (day, dusk, night) changes. Updates `_phase` and `_isfullmoon`.
*   `inst:ListenForEvent("moonphasechanged2", OnMoonPhaseChanged2)`: Triggered when the moon phase changes. Updates `_moonphase` and recalculates full moon status.
*   `inst:ListenForEvent("weathertick", OnWeatherTick)`: Triggered by the weather system, providing updates on `data.light` (e.g., during rain), which affects the overall light intensity.
*   `inst:ListenForEvent("screenflash", OnScreenFlash)`: Triggered when a screen flash effect occurs. Initializes the flash state, intensity, and duration.
*   `inst:ListenForEvent("seasontick", OnSeasonTick)` (only if not a "cave" entity): Triggered when the season changes. Updates `_season`.
*   `inst:ListenForEvent("playeractivated", OnPlayerActivated)`: Triggered when a player entity becomes the active player. It then listens for `nightvision` and `nightvisionambientoverrides` events on that specific player.
*   `inst:ListenForEvent("playerdeactivated", OnPlayerDeactivated)`: Triggered when a player entity is no longer the active player. It removes the `nightvision` and `nightvisionambientoverrides` event listeners from that player.
*   `player:ListenForEvent("nightvision", OnNightVision)`: Listened on the *active player entity*. Triggered when the player's night vision status changes (e.g., wearing/removing a Mole Hat). Adjusts `_overridecolour` to use `NIGHTVISION_COLOURS`.
*   `player:ListenForEvent("nightvisionambientoverrides", OnNightVisionAmbientOverrides)`: Listened on the *active player entity*. Triggered when the player's night vision color overrides change, allowing specific items or effects to alter the night vision palette.
*   `inst:ListenForEvent("overrideambientlighting", OnOverrideAmbientLighting)`: Allows external sources to temporarily override the global ambient lighting color. *Note: The source code indicates this is "NOT safe to use!"*.
*   `inst:ListenForEvent("continuefrompause", OnContinueFromPause)`: Triggered when the game resumes from a paused state, updating screen flash intensity scaling from profile settings.