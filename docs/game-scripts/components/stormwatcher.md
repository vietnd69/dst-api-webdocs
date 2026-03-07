---
id: stormwatcher
title: Stormwatcher
description: Tracks active storms on a player entity and synchronizes storm-related properties and speed modifiers.
tags: [storm, player, world, locomotion]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 0ff14481
system_scope: player
---

# Stormwatcher

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Stormwatcher` monitors active environmental storms (sandstorms and moonstorms) affecting a player entity and maintains internal state (`stormlevel`, `currentstorm`) to reflect current storm intensity and type. It integrates with `sandstorms` and `moonstorms` components on the world entity, updates the `sandstormwatcher` and `moonstormwatcher` subcomponents, and modifies the player’s movement speed via the `locomotor` component. It also synchronizes storm properties to the player’s classified replica (`player_classified.stormlevel` and `player_classified.stormtype`) for network replication.

## Usage example
```lua
local inst = TheWorld.Entities[PLAYER_GUID]
if inst.components.stormwatcher then
    local level = inst.components.stormwatcher:GetStormLevel()
    local type = inst.components.stormwatcher.currentstorm
    print("Current storm level:", level, "type:", type)
end
```

## Dependencies & tags
**Components used:** `locomotor`, `sandstorms`, `sandstormwatcher`, `moonstorms` (on `TheWorld.net`), `moonstormwatcher`, `player_classified`  
**Tags:** Checks `player`; uses `player_classified.stormlevel` and `player_classified.stormtype` as replicated setters.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stormlevel` | number | `0` | Current storm intensity, scaled to 1/7 increments (`0`, `1/7`, ..., `1`). |
| `currentstorm` | string (`STORM_TYPES.*`) | `STORM_TYPES.NONE` | Type of the active storm (`NONE`, `SANDSTORM`, or `MOONSTORM`). |
| `currentstorms` | table | `{}` | Mapping of `stormtype → boolean` indicating which storms are active. |
| `delay` | number or nil | `nil` | Countdown timer for throttling `UpdateStormLevel()` calls. |

## Main functions
### `GetStormLevel(stormtype)`
* **Description:** Returns the current storm level if `stormtype` matches the active storm, or `0` otherwise. If `stormtype` is omitted, returns the active storm level regardless of type.
* **Parameters:** `stormtype` (string, optional) — `STORM_TYPES.SANDSTORM` or `STORM_TYPES.MOONSTORM`.
* **Returns:** number — `0` or the current storm level (0–1, scaled to 1/7 increments).
* **Error states:** None.

### `GetCurrentStorm(inst)`
* **Description:** Determines the dominant storm affecting the given entity by querying `sandstorms` and `moonstorms` components. Ensures only one storm type is active at a time.
* **Parameters:** `inst` (Entity) — entity to check for storm presence.
* **Returns:** string — `STORM_TYPES.SANDSTORM`, `STORM_TYPES.MOONSTORM`, or `STORM_TYPES.NONE`.
* **Error states:** Throws an assertion error if both `SANDSTORM` and `MOONSTORM` are detected on the entity simultaneously.

### `CheckStorms(data)`
* **Description:** Verifies whether the current active storm matches the actual state. Updates `currentstorm` and triggers `UpdateStormLevel()` if a mismatch is detected.
* **Parameters:** `data` (table, optional) — unused in this implementation.
* **Returns:** Nothing.
* **Error states:** None.

### `UpdateStorms(data)`
* **Description:** Updates internal tracking of active storms (`currentstorms`) based on incoming event data (typically from `"ms_stormchanged"`). Controls whether the component should be updated periodically and manages `"changearea"` event registration.
* **Parameters:** `data` (table, optional) — must contain `data.stormtype` and `data.setting` (boolean) if present.
* **Returns:** Nothing.

### `UpdateStormLevel()`
* **Description:** Recalculates the player’s current storm level by querying the appropriate world component (`sandstorms` or `moonstorms`). Applies speed modifiers to `locomotor` and updates `sandstormwatcher`/`moonstormwatcher`. Removes speed modifiers when exiting a storm.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

### `OnUpdate(dt)`
* **Description:** Periodic update handler that throttles storm level recalculation based on `delay`. Resets `delay` for subsequent updates.
* **Parameters:** `dt` (number) — time elapsed since last frame.
* **Returns:** Nothing.
* **Error states:** None.

## Events & listeners
- **Listens to:**  
  - `"ms_stormchanged"` (on `TheWorld`) — triggers `UpdateStorms(data)` to track new storm activations.  
  - `"changearea"` (on `inst`) — triggers `OnChangeArea`, which updates storm level and adjusts update interval when entering/exiting areas.  
- **Pushes:** Events are not pushed directly by this component, but it triggers updates in `sandstormwatcher`/`moonstormwatcher`, which fire `"sandstormlevel"` and `"moonstormlevel"` events respectively.
