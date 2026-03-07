---
id: worldstate
title: Worldstate
description: Tracks and broadcasts global world state variables such as time, phase, season, weather, and moon cycles for the entire world entity.
tags: [world, time, weather, season]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 44fb663b
system_scope: world
---

# Worldstate

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Worldstate` is a singleton component attached exclusively to `TheWorld` that maintains and propagates global environmental state data—including time, day/night cycles, seasons, weather conditions, and moon phases—to other entities via variable watching. It does not control world behavior directly but serves as a central data store and notification hub. When world state changes (e.g., time advances, season shifts), the component updates its internal `data` table and notifies registered watchers.

## Usage example
```lua
-- Access the world state component on TheWorld
local worldstate = TheWorld.components.worldstate

-- Read current state
local current_phase = worldstate.data.phase
local current_season = worldstate.data.season

-- Register a watcher for seasonal changes
worldstate:AddWatcher("season", self.inst, function(self_comp, season)
    print("Season changed to:", season)
end, self)

-- Get world age in cycles
local age = worldstate:GetWorldAge()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified (does not add/remove tags on itself or other entities)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `data` | table | `{}` | Internal dictionary storing all world state variables (e.g., `time`, `phase`, `season`, `temperature`). |
| `inst` | entity | `TheWorld` | Reference to the world entity this component manages. |

## Main functions
### `GetWorldAge()`
* **Description:** Returns the total world age in game cycles plus fractional time.
* **Parameters:** None.
* **Returns:** `number` — the number of completed cycles + current fractional time (i.e., `1 + cycles + time`).
* **Error states:** None.

### `AddWatcher(var, inst, fn, target)`
* **Description:** Registers a callback function to be invoked whenever the specified world state variable changes.
* **Parameters:**  
  `var` (string) — name of the variable to watch (e.g., `"season"`, `"israining"`, `"isday"`).  
  `inst` (entity) — the entity that owns the watcher callback.  
  `fn` (function) — the callback function to invoke on change; signature: `fn(target, newValue)`.  
  `target` (any) — optional context passed to the callback as the first argument.  
* **Returns:** Nothing.
* **Error states:** None. Multiple watchers per variable/entity are supported.

### `RemoveWatcher(var, inst, fn, target)`
* **Description:** Removes a previously registered watcher callback.
* **Parameters:**  
  `var` (string) — name of the variable the watcher was registered for.  
  `inst` (entity) — the entity that registered the watcher.  
  `fn` (function or `nil`) — the specific callback function to remove. If `nil`, all callbacks for `inst` on this variable are removed.  
  `target` (any or `nil`) — optional context; only removes matches where `target == v[2]`. Ignored if `fn` is `nil`.  
* **Returns:** Nothing.
* **Error states:** No-op if watcher not found.

### `OnSave()`
* **Description:** Returns a copy of the current world state data table for persistence.
* **Parameters:** None.
* **Returns:** `table` — shallow copy of `self.data`.
* **Error states:** None.

### `OnLoad(data)`
* **Description:** Restores world state data from a saved state table.
* **Parameters:** `data` (table) — the saved state dictionary. Only entries matching existing keys in `self.data` are applied.
* **Returns:** Nothing.
* **Error states:** Ignores keys not present in `self.data`.

### `Dump()`
* **Description:** Returns a formatted string of all current world state variables for debugging.
* **Parameters:** None.
* **Returns:** `string` — multi-line tab-separated output of `key` and `value`.
* **Error states:** None.

## Events & listeners
- **Listens to:**  
  `clocktick` — updates `time`, `timeinphase`, and `cycles`.  
  `cycleschanged` — updates `cycles`.  
  `phasechanged` / `cavephasechanged` — updates `phase`, `isday`/`isdusk`/`isnight`, and related booleans. Also triggers cave-specific logic when appropriate.  
  `moonphasechanged2` / `cavemoonphasechanged2` — updates `moonphase`, `iswaxingmoon`, `isfullmoon`, `isnewmoon`, and cave equivalents.  
  `ms_stormchanged` — updates `isalterawake` on moonstorm state change.  
  `nightmareclocktick` / `nightmarephasechanged` — updates `nightmarephase`, `nightmaretime`, and related booleans (`isnightmarecalm`, etc.).  
  `seasontick` — updates `season`, day counts, progress, and length fields.  
  `seasonlengthschanged` — updates `springlength`, `summerlength`, etc.  
  `temperaturetick` — updates `temperature`.  
  `weathertick` — updates `moisture`, `precipitationrate`, `snowlevel`, `lunarhaillevel`, `wetness`, etc.  
  `moistureceilchanged` — updates `moistureceil`.  
  `precipitationchanged` — updates `precipitation`, `israining`, `issnowing`, `islunarhailing`, `isacidraining`.  
  `snowcoveredchanged` — updates `issnowcovered` and triggers `TheSim:HandleAllSnowSymbols(show)`.  
  `wetchanged` — updates `iswet`.  
- **Pushes:** None (no events are fired by this component).
