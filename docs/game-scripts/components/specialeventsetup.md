---
id: specialeventsetup
title: Specialeventsetup
description: Manages the lifecycle and setup logic for special in-game events such as Halloween and Year of the Catcoon.
tags: [event, world, setup]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: dbfb82a4
system_scope: world
---
# Specialeventsetup

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Specialeventsetup` is a world-level component responsible for initializing and tearing down special in-game events based on the current world configuration. It detects transitions between active and previous events, triggers appropriate setup/shutdown callbacks, and handles biome-specific event initialization logic (e.g., spawning Halloween trinkets or Year of the Catcoon kitcoons). It is only instantiated on the master simulation server and relies on the `TheWorld` global for world state and event configuration.

## Usage example
```lua
-- Typically attached automatically by the game during world initialization.
-- Manual usage is not recommended, but if needed:
local inst = TheWorld
inst:AddComponent("specialeventsetup")
-- Event setup/shutdown is handled automatically on save/load and world change.
```

## Dependencies & tags
**Components used:** `hideandseekhider`, `playerspawner`  
**Tags:** No tags are added or removed directly by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance (always `TheWorld`) this component is attached to. |
| `halloween_bat_grave_spawn_chance` | number | `0` | Accumulating chance for bats spawning from graves during Halloween; persisted across sessions. |
| `prev_event` | `SPECIAL_EVENTS` enum | `SPECIAL_EVENTS.NONE` | The previous special event active in the world. Used to detect transitions. |
| `prev_extra_events` | table | `{}` | List of previously active extra events (e.g., seasonal variants). |

## Main functions
### `SetupNewSpecialEvent(event)`
*   **Description:** Initializes the specified special event (e.g., `HALLOWED_NIGHTS`, `YOT_CATCOON`) if it is not already active. Runs biome-specific logic for spawning event assets (e.g., trinkets or kitcoons).
*   **Parameters:** `event` (SPECIAL_EVENTS enum) – The event to set up.
*   **Returns:** Nothing.
*   **Error states:** Returns early without action if `event` is `nil`.

### `ShutdownPrevSpecialEvent(event)`
*   **Description:** Shuts down cleanup logic for a previously active special event. Currently only stubbed for Halloween (cleanup of leftover trinkets is pending), but supports modded events via a global event.
*   **Parameters:** `event` (SPECIAL_EVENTS enum) – The event to shut down.
*   **Returns:** Nothing.
*   **Error states:** Returns early without action if `event` is `nil`.

### `OnPostInit()`
*   **Description:** Called after the component and world are initialized. Compares `prev_event`/`prev_extra_events` against current world events (`WORLD_SPECIAL_EVENT`, `WORLD_EXTRA_EVENTS`), then triggers setup or shutdown as needed. Also calls `SpecialEventSetup()` on `prefabs/oceanfishdef`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes the component’s state for world save. Includes current event identifiers and Halloween bat spawn chance.
*   **Parameters:** None.
*   **Returns:** `table` containing keys `halloween_bats`, `current_event`, `current_extra_events`.

### `OnLoad(data)`
*   **Description:** Restores the component’s state from a world save. Handles legacy `halloweentrinkets` field for backwards compatibility and updates `prev_event`, `prev_extra_events`, and `halloween_bat_grave_spawn_chance`.
*   **Parameters:** `data` (table or `nil`) – The saved data dictionary.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly (all event listening is handled via `TheWorld:PushEvent` calls).
- **Pushes:**  
  - `"ms_setupspecialevent"` – Fired with the event enum when setup begins (intended for modder hooks).  
  - `"ms_shutdownspecialevent"` – Fired with the event enum when shutdown begins (intended for modder hooks).  
  - `"ms_collectallkitcoons"` – Fired during `YOT_CATCOON` setup to collect existing kitcoons before cleanup/respawn.

### External event integration
- Calls `inst.components.hideandseekhider:GoHide(hiding_spot, timeout_time, isloading)` from `hideandseekhider.lua` during kitcoon hiding logic.
- Calls `TheWorld.components.playerspawner:GetAnySpawnPoint()` as a fallback position when hiding spot placement fails.

