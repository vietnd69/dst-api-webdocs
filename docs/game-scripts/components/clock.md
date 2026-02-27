---
id: clock
title: Clock
description: This component manages the game world's day/dusk/night cycle, moon phases, and overall time progression.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: world
source_hash: b5560eee
---

# Clock

## Overview
The Clock component is a fundamental system responsible for tracking and managing the game's temporal progression. It governs the day, dusk, and night phases, advances game cycles, handles the moon's waxing and waning, and provides mechanisms for other game systems to query and react to time-based events. It synchronizes time across network clients and saves/loads its state for persistent worlds.

## Dependencies & Tags
None identified.

## Properties
No public properties were clearly identified from the source. The component's state is primarily managed through internal network variables and exposed via events or specific getter functions.

## Main Functions
### `GetTimeUntilPhase(phase)`
*   **Description:** Calculates the remaining time in seconds until a specified phase of the day (day, dusk, or night) is reached.
*   **Parameters:**
    *   `phase`: (string) The name of the target phase (e.g., "day", "dusk", "night").

### `AddMoonPhaseStyle(style)`
*   **Description:** Adds a new moon phase style name to the list of available styles. This allows for custom visual representations of moon phases.
*   **Parameters:**
    *   `style`: (string) The name of the new moon phase style to add.

### `OnUpdate(dt)`
*   **Description:** The primary update function called every frame to advance the clock. It manages the reduction of remaining time in the current phase, transitions between phases and cycles, and triggers events for time-related changes. On the master shard, it advances the game's internal clock and moon phase. On clients and secondary shards, it mostly simulates local time and awaits server synchronization for phase/cycle changes.
*   **Parameters:**
    *   `dt`: (number) The delta time since the last update, in seconds.

### `OnSave()`
*   **Description:** Serializes the current state of the clock component for saving the game. This function is only executed on the master simulation.
*   **Parameters:** None.

### `OnLoad(data)`
*   **Description:** Deserializes and restores the state of the clock component from saved game data. This function is only executed on the master simulation. It handles compatibility for older save data regarding moon phase cycles.
*   **Parameters:**
    *   `data`: (table) The table containing the saved clock data.

### `Dump()`
*   **Description:** Prints various internal clock states and debug information to the console. Useful for debugging time-related issues.
*   **Parameters:** None.

### `GetDebugString()`
*   **Description:** Returns a formatted string containing summary debug information about the current clock state, including cycle, phase, remaining time, and moon phase cycle.
*   **Parameters:** None.

## Events & Listeners
This component listens for and pushes several events, both for internal synchronization and for other game systems to react to time changes.

**Listeners:**
*   `segsdirty`: Triggered when the `_segs` network variable is updated, indicating a change in the length of day, dusk, or night segments.
*   `cyclesdirty`: Triggered when the `_cycles` network variable is updated, indicating a change in the current day cycle count.
*   `phasedirty`: Triggered when the `_phase` network variable is updated, indicating a change in the current phase (day, dusk, night).
*   `moonphasedirty`: Triggered when the `_moonphase` or `_mooniswaxing` network variables are updated, indicating a change in the moon's phase or waxing/waning state.
*   `moonphasestyledirty`: Triggered when the `_moonphasestyle` network variable is updated, indicating a change in the active moon phase visual style.
*   `playeractivated` (from `_world`): Forces all internal dirty flags to `true`, ensuring a full sync of clock information to newly active players.
*   `ms_setclocksegs` (from `_world`, master sim only): Used by the master simulation to explicitly set the lengths of the day, dusk, and night segments.
*   `ms_setphase` (from `_world`, master sim only): Used by the master simulation to explicitly set the current time of day phase.
*   `ms_nextphase` (from `_world`, master sim only): Advances the clock immediately to the next phase.
*   `ms_nextcycle` (from `_world`, master sim only): Advances the clock immediately to the next cycle (new day).
*   `ms_setmoonphase` (from `_world`, master sim only): Used by the master simulation to explicitly set the current moon phase.
*   `ms_lockmoonphase` (from `_world`, master sim only): Locks or unlocks the moon phase, preventing it from automatically advancing.
*   `ms_setmoonphasestyle` (from `_world`, master sim only): Used by the master simulation to explicitly set the current moon phase visual style.
*   `ms_simunpaused` (from `_world`, master sim only): Forces a resync of the `_remainingtimeinphase` network variable, correcting client-side simulation drift after a pause.
*   `secondary_clockupdate` (from `_world`, master sim and not master shard only): Receives clock updates from a master shard to keep a secondary shard synchronized.

**Pushed Events:**
*   `ms_cyclecomplete` (to `_world`, master shard only): Triggered when a new day cycle begins, providing the new cycle number.
*   `clocksegschanged` (to `_world`): Triggered when the day/dusk/night segment lengths change, providing a table of new segment values.
*   `cycleschanged` (to `_world`): Triggered when the current day cycle count changes, providing the new cycle number.
*   `phasechanged` (to `_world`): Triggered when the current time of day phase changes (day, dusk, night).
*   `moonphasechanged` (to `_world`): (Deprecated) Triggered when the moon phase changes, providing the new moon phase name.
*   `moonphasechanged2` (to `_world`): Triggered when the moon phase changes, providing a table with the new moon phase name and whether it is waxing.
*   `moonphasestylechanged` (to `_world`): Triggered when the moon phase visual style changes, providing the new style name.
*   `clocktick` (to `_world`, every `OnUpdate`): Provides detailed current time information including the phase name, normalized time within the phase, and overall normalized time within a full day.
*   `master_clockupdate` (to `_world`, master shard only): Sends comprehensive clock data (segs, cycles, phases, times) to secondary shards for synchronization.