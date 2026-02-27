---
id: stormwatcher
title: Stormwatcher
description: Tracks active storm types and levels for an entity and synchronizes storm-related state with the player classified UI component.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: 0ff14481
---

# Stormwatcher

## Overview
This component monitors environmental storm activity (sandstorms and moonstorms) affecting the associated entity. It maintains the current storm type and intensity level, updates derived state (e.g., `stormlevel`, `currentstorm`), and coordinates updates via scheduled polling and event-driven callbacks. It also ensures UI reflection by syncing the storm level and type to the `player_classified.stormlevel` and `player_classified.stormtype` components when present.

## Dependencies & Tags
- `inst:AddComponent("locomotor")` — used to remove speed multipliers when exiting a storm (accessed via `self.inst.components.locomotor`).
- `inst:AddComponent("sandstormwatcher")` — invoked when sandstorm level updates (`self.inst.components.sandstormwatcher:UpdateSandstormLevel()`).
- `inst:AddComponent("moonstormwatcher")` — invoked when moonstorm level updates (`self.inst.components.moonstormwatcher:UpdateMoonstormLevel()`).
- **World Dependencies**:
  - `TheWorld.components.sandstorms` — to check active sandstorms and query storm level/zone presence.
  - `TheWorld.net.components.moonstorms` — to check active moonstorms and query storm level/zone presence.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stormlevel` | number | `0` | Current normalized storm intensity (0 to 1, quantized to 1/7 increments). |
| `delay` | number or `nil` | `nil` | Interpolation delay timer for periodic storm level updates. |
| `currentstorm` | string (STORM_TYPES.*) | `STORM_TYPES.NONE` | The dominant storm type affecting the entity. |
| `currentstorms` | table | `{}` | Map of storm types to boolean flags indicating active presence (e.g., `{[STORM_TYPES.SANDSTORM] = true}`). |
| `laststorm` | string (STORM_TYPES.*) | *(not initialized)* | Tracks the previous storm type for cleanup purposes. |

## Main Functions

### `GetStormLevel(stormtype)`
* **Description:** Returns the current storm intensity level. If a specific `stormtype` is provided, returns the level only if that storm is active; otherwise, returns `0`.
* **Parameters:**  
  `stormtype` (string, optional) — A `STORM_TYPES.*` constant (e.g., `STORM_TYPES.SANDSTORM`). If omitted or matches `self.currentstorm`, returns the global `self.stormlevel`.

### `GetCurrentStorm(inst)`
* **Description:** Determines the dominant storm type affecting the entity by checking both sandstorm and moonstorm subsystems. Asserts the entity cannot be in two storms simultaneously.
* **Parameters:**  
  `inst` (Entity) — The entity instance (typically `self.inst`).

### `CheckStorms(data)`
* **Description:** Compares the currently tracked storm type with the result of `GetCurrentStorm()`. If different, updates `currentstorm`, triggers storm level recalculation, or clears `stormlevel` to `0` if no storm is active.
* **Parameters:**  
  `data` (table, optional) — Storm change event data (unused directly in this function but retained for API consistency).

### `UpdateStorms(data)`
* **Description:** Updates internal tracking of active storms (via `currentstorms` table) based on event data. Enables or disables periodic updates and listens for `changearea` events depending on whether any storms are active.
* **Parameters:**  
  `data` (table, optional) — Must contain `data.stormtype` and `data.setting` (boolean). Updates the `currentstorms` map accordingly.

### `UpdateStormLevel()`
* **Description:** Recalculates and sets the current storm level based on the active storm subsystem. Applies movement speed modifiers when entering a storm and removes them on exit. Delegates to `sandstormwatcher` or `moonstormwatcher` components for UI updates.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Acts as a polling loop for gradual storm level transitions. Decrements the internal `delay` timer; when elapsed, triggers `UpdateStormLevel()` and resets the delay based on current storm intensity.
* **Parameters:**  
  `dt` (number) — Time since last update (delta time).

## Events & Listeners
- **Listens to:**
  - `"ms_stormchanged"` (on `TheWorld`) — Triggers `self:UpdateStorms(data)`.
  - `"changearea"` (on `self.inst`) — Triggers `OnChangeArea`, which calls `self:UpdateStormLevel()` and adjusts update delay.
- **Triggers:**
  - `self.inst:StartUpdatingComponent(self)` — Enables periodic updates when any storm is active.
  - `self.inst:StopUpdatingComponent(self)` — Disables periodic updates when no storms are active.
  - `self.inst:ListenForEvent("changearea", OnChangeArea)` — Registers `changearea` handler during active storm conditions.
  - `self.inst:RemoveEventCallback("changearea", OnChangeArea)` — Removes `changearea` handler when storm ends.