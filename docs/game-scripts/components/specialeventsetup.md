---
id: specialeventsetup
title: Specialeventsetup
description: Initializes and manages the lifecycle of special in-game events like Halloween and Year of the Catcoon, handling setup and teardown logic on the master simulation.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: dbfb82a4
---

# Specialeventsetup

## Overview
This component is responsible for detecting transitions between special events (e.g., from one event to another or to no event) at world startup or save/load time, and invoking appropriate event-specific setup or shutdown functions. It operates exclusively on the master simulation and coordinates the spawning and positioning of event-related entities such as Halloween trinkets, kitcoons (for Year of the Catcoon), and their hiding spots.

## Dependencies & Tags
- Requires `TheWorld.ismastersim` — throws an assertion error if instantiated on the client.
- No explicit component additions (e.g., `AddComponent`) or tags are applied to the instance (`inst`).
- Interacts with the global constants `WORLD_SPECIAL_EVENT`, `WORLD_EXTRA_EVENTS`, and `SPECIAL_EVENTS`.
- Calls `TheWorld:PushEvent()` with custom events: `"ms_setupspecialevent"`, `"ms_shutdownspecialevent"`, and `"ms_collectallkitcoons"` for mod extensibility.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (constructor argument) | Reference to the entity the component is attached to (typically the world root). |
| `halloween_bat_grave_spawn_chance` | `number` | `0` | Accumulating spawn chance for bats emerging from dug graves during Halloween; persists across sessions. |
| `prev_event` | `SPECIAL_EVENTS` enum | `SPECIAL_EVENTS.NONE` | Tracks the last active special event (loaded from save or defaults to `NONE`). |
| `prev_extra_events` | `table` | `{}` | List of previously active extra events, used to detect changes across sessions. |
| `halloweentrinkets` | `any` | `nil` | Deprecated field retained for backward compatibility with older save data; used only during migration to `prev_event`. |

## Main Functions

### `:_SetupHallowedNights()`
* **Description:** Spawns Halloween trinkets and ornaments throughout the world if the current event is Halloween (or if legacy trinket data indicates previous Halloween activity). Also checks for existing trinkets to avoid overspawning if world retained old trinkets. Skips spawning if ≥16 trinkets are already present.
* **Parameters:** None.

### `:_yotcatcoon_HideKitcoon(kitcoon_data, emergency_hidingspot_prefabs)`
* **Description:** Attempts to find a valid hiding spot for a given kitcoon entity by searching biomes for existing suitable spots, then fallback prefabs, then generating emergency hiding spots in a tiered manner (biome → player spawn fallback). Places the kitcoon in the chosen spot using the `hideandseekhider` component.
* **Parameters:**
  * `kitcoon_data` (table): Contains `kitcoon`, `biome_name`, `fallback_prefab`, and tag filters (`hiding_spot_all_tags`, `hiding_spot_notags`, `hiding_spot_some_tags`) and optional filter function `hiding_spot_fn`.
  * `emergency_hidingspot_prefabs` (table): List of prefabs used for emergency fallback hiding spots (e.g., `{"rocks", "twigs", "cutgrass", "log"}`).

### `:_SetupYearOfTheCatcoon()`
* **Description:** Initializes the Year of the Catcoon event by spawning all configured kitcoon prefabs and assigning each a hiding spot using `_yotcatcoon_HideKitcoon`. It first collects existing kitcoons via `"ms_collectallkitcoons"` event, avoids re-spawning them, then spawns missing ones. Also prepares biome-specific hiding spot configurations.
* **Parameters:** None.

### `:SetupNewSpecialEvent(event)`
* **Description:** Invokes the appropriate setup function for a newly activated special event (e.g., `HALLOWED_NIGHTS`, `YOT_CATCOON`) and triggers a moddable `"ms_setupspecialevent"` event for external customization.
* **Parameters:**
  * `event` (`SPECIAL_EVENTS` enum or `nil`): The event to initialize. Returns early if `nil`.

### `:ShutdownPrevSpecialEvent(event)`
* **Description:** Handles cleanup logic when a special event ends (e.g., future cleanup of leftover Halloween trinkets). Triggers moddable `"ms_shutdownspecialevent"` event.
* **Parameters:**
  * `event` (`SPECIAL_EVENTS` enum or `nil`): The event to shut down. Returns early if `nil`.

### `:OnPostInit()`
* **Description:** Compares the previous event state (from save or defaults) with the current world event state. Determines which events have started or ended, and calls `SetupNewSpecialEvent` or `ShutdownPrevSpecialEvent` accordingly. Also calls `SpecialEventSetup()` from oceanfishdef.lua.
* **Parameters:** None.

### `:OnSave()`
* **Description:** Returns a table containing essential state to persist across saves: bat spawn chance, current event, and extra events list.
* **Parameters:** None.

### `:OnLoad(data)`
* **Description:** Restores state from saved data, including deprecated `halloweentrinkets`, `halloween_bat_grave_spawn_chance`, `prev_event`, and `prev_extra_events`.
* **Parameters:**
  * `data` (table or `nil`): Save data loaded from disk. If `nil`, no state restoration occurs.

## Events & Listeners

- **Listens for (via external calls in `OnPostInit`):**
  - `"ms_collectallkitcoons"` — triggers a `"ms_collectallkitcoons"` event on `TheWorld` to gather existing kitcoons before setup.

- **Triggers (via `TheWorld:PushEvent`):**
  - `"ms_setupspecialevent"` — fired in `SetupNewSpecialEvent` after event-specific setup.
  - `"ms_shutdownspecialevent"` — fired in `ShutdownPrevSpecialEvent` after event-specific cleanup.
  - `"ms_collectallkitcoons"` — fired in `:SetupYearOfTheCatcoon` to collect existing kitcoons.