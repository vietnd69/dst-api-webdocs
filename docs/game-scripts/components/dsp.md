---
id: dsp
title: Dsp
description: This component manages dynamic audio digital signal processing (DSP) effects, primarily low-pass and high-pass filters, based on game state and stacked effects.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: audio
source_hash: cfb1f7e7
---

# Dsp

## Overview
The Dsp component is responsible for applying dynamic Digital Signal Processing (DSP) audio effects, specifically low-pass and high-pass filters, to various audio categories within Don't Starve Together. It integrates with the game's audio mixer to modify sound frequencies based on environmental factors like seasons and temperature, as well as specific game-state-driven effects. The component uses a stack-based system to manage and combine multiple concurrent DSP effects, ensuring a layered and responsive audio experience.

## Dependencies & Tags
**Dependencies:**
*   `easing` (Lua library)
*   `TheMixer` (Global audio manager)
*   `playerhearing` (Component, accessed on the active player)

**Tags:** None identified.

## Properties
No public properties were clearly identified from the source. The component primarily operates through its instance (`inst`) and private internal state.

## Main Functions
### `RefreshDSP(duration)`
*   **Description:** Recalculates and applies the current composite low-pass and high-pass DSP filters to the game's audio mixer (`TheMixer`). It consolidates all active DSP effects from `_dsplowstack` and `_dsphighstack`, applying new filters or clearing old ones with a specified transition duration. This function is called internally whenever the DSP stack changes.
*   **Parameters:**
    *   `duration`: (`number`, optional) The transition time in seconds for applying or clearing filters. Defaults to 0.

### `UpdateSeasonDSP(season, duration)`
*   **Description:** Updates the default low-pass and high-pass DSP settings based on the current game season. It retrieves season-specific filter values from the `LOWDSP` and `HIGHDSP` constants and then triggers a `RefreshDSP` to smoothly apply these changes. This function also manages the `temperaturetick` listener for dynamic summer DSP.
*   **Parameters:**
    *   `season`: (`string`) The current season (e.g., `SEASONS.SUMMER`, `SEASONS.WINTER`).
    *   `duration`: (`number`) The transition time in seconds for applying the seasonal filters.

### `GetDebugString()`
*   **Description:** Returns a formatted string representing the currently active low-pass and high-pass DSP filter settings. This is primarily used for debugging purposes to inspect the component's current audio state.
*   **Parameters:** None.

## Events & Listeners
*   `inst:ListenForEvent("playeractivated", OnPlayerActivated)`: Listens for when a player entity becomes the active client player, triggering the setup of DSP-related event listeners for that player.
*   `inst:ListenForEvent("playerdeactivated", OnPlayerDeactivated)`: Listens for when the active client player entity becomes inactive, triggering the cleanup and removal of DSP-related event listeners.
*   `inst:ListenForEvent("seasontick", OnSeasonTick)`: (Listened by the active player's component) Triggers on each game season change, updating the ambient seasonal DSP effects.
*   `inst:ListenForEvent("temperaturetick", OnTemperatureTick)`: (Listened by the active player's component, only active during summer) Triggers on changes in world temperature during summer, dynamically adjusting high-pass frequencies to reflect heat intensity.
*   `inst:ListenForEvent("pushdsp", OnPushDSP, player)`: (Listened by the active player's component, constrained to events sent by a specific `player`) Triggers to add a new set of low-pass or high-pass DSP filters to the component's internal stack. This allows other game systems to layer additional audio effects.
*   `inst:ListenForEvent("popdsp", OnPopDSP, player)`: (Listened by the active player's component, constrained to events sent by a specific `player`) Triggers to remove a specific set of previously pushed DSP filters from the internal stack, effectively disabling that particular audio effect.