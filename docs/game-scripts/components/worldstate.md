---
id: worldstate
title: Worldstate
description: Manages and exposes global world state variables—including time, phase, season, weather, and cave/moon conditions—via a central data store and change notification system.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 44fb663b
---

# Worldstate

## Overview
The `Worldstate` component serves as the central authority for world-wide state data in *Don't Starve Together*. It holds and maintains runtime values for time of day, phase (day/dusk/night), moon phase, season, weather, temperature, cave-specific conditions, nightmare cycle, and more. It exposes these values through a `data` table and supports reactive change notifications via a watcher system—allowing other systems to respond when world state changes.

## Dependencies & Tags
- `inst`: Must be the world entity (`TheWorld`), verified by an assertion in the constructor.
- Tags checked: `"cave"` — determines initial phase and event handler routing for cave vs. surface.
- **No external components are added or required** on the world entity itself; it operates solely on events broadcast by other world-level systems (e.g., `clocktick`, `seasontick`, `weathertick`, `moonphasechanged2`, etc.).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `TheWorld` | Reference to the world entity; required and validated at construction. |
| `data` | `table` | `{}` | Central dictionary of world state variables. |
| `_watchers` | `table` | `{}` | Private registry mapping variable names → entity → list of `{fn, target}` callback tuples. |
| `data.time` | `number` | `0` | Elapsed tick count within the current world day. |
| `data.timeinphase` | `number` | `0` | Elapsed ticks within the current phase (day/dusk/night). |
| `data.cycles` | `number` | `0` | Number of full world days elapsed. |
| `data.phase` | `string` | `"day"` (surface) or `"night"` (cave) | Current major phase (`"day"`, `"dusk"`, `"night"`). |
| `data.isday` | `boolean` | `true` (surface) / `false` (cave) | Whether the world is currently in day phase. |
| `data.isdusk` | `boolean` | `false` | Whether the world is currently in dusk phase. |
| `data.isnight` | `boolean` | `false` (surface) / `true` (cave) | Whether the world is currently in night phase. |
| `data.moonphase` | `string` | `"new"` | Current moon phase (`"new"`, `"waxing"`, `"full"`, `"waning"`). |
| `data.iswaxingmoon` | `boolean` | `true` | Whether the moon is waxing (growing). |
| `data.isfullmoon` | `boolean` | `false` | Whether it is currently a full moon. |
| `data.isnewmoon` | `boolean` | `false` | Whether it is currently a new moon. |
| `data.isalterawake` | `boolean` | `false` | Whether the Moon Altar is active (e.g., during a Moonstorm). |
| `data.cavephase` | `string` | `"day"` | Current cave phase (only `"day"` used for caves). |
| `data.iscaveday` | `boolean` | `true` | Whether it is daytime in the caves. |
| `data.iscavedusk` | `boolean` | `false` | Whether it is dusk in the caves. |
| `data.iscavenight` | `boolean` | `false` | Whether it is nighttime in the caves. |
| `data.cavemoonphase` | `string` | `"new"` | Moon phase as observed in caves. |
| `data.iscavewaxingmoon` | `boolean` | `false` | Whether the cave moon is waxing. |
| `data.iscavefullmoon` | `boolean` | `false` | Whether it is full moon in the caves. |
| `data.iscavenewmoon` | `boolean` | `false` | Whether it is new moon in the caves. |
| `data.nightmarephase` | `string` | `"none"` | Current nightmare phase (`"none"`, `"calm"`, `"warn"`, `"wild"`, `"dawn"`). |
| `data.nightmaretime` | `number` | `0` | Elapsed tick count within the current nightmare cycle. |
| `data.nightmaretimeinphase` | `number` | `0` | Elapsed ticks within the current nightmare phase. |
| `data.isnightmarecalm`, `data.isnightmarewarn`, `data.isnightmarewild`, `data.isnightmaredawn` | `boolean` | `false` | Boolean flags for the current nightmare phase. |
| `data.season` | `string` | `"autumn"` | Current season (`"spring"`, `"summer"`, `"autumn"`, `"winter"`). |
| `data.isspring`, `data.issummer`, `data.isautumn`, `data.iswinter` | `boolean` | `false` / `true` | Season flags. Default: `isautumn = true`. |
| `data.elapseddaysinseason` | `number` | `0` | Number of days elapsed in the current season. |
| `data.remainingdaysinseason` | `number` | `ceil(TUNING.AUTUMN_LENGTH * 0.5)` | Approximate days remaining in the current season. |
| `data.seasonprogress` | `number` | `0` | Fraction (0.0–1.0) of season elapsed. |
| `data.springlength`, `data.summerlength`, `data.autumnlength`, `data.winterlength` | `number` | `TUNING.*_LENGTH` | Configured lengths (in ticks) for each season. |
| `data.temperature` | `number` | `TUNING.STARTING_TEMP` | Current world temperature. |
| `data.moisture`, `data.moistureceil` | `number` | `0`, `8 * TUNING.TOTAL_DAY_TIME` | Current moisture level and its upper bound. |
| `data.pop` | `number` | `0` | Probability of precipitation (0.0–1.0). |
| `data.precipitationrate` | `number` | `0` | Rate at which precipitation accumulates. |
| `data.precipitation` | `string` | `"none"` | Type of precipitation (`"none"`, `"rain"`, `"snow"`, `"lunarhail"`, `"acidrain"`). |
| `data.israining`, `data.issnowing`, `data.islunarhailing`, `data.isacidraining` | `boolean` | `false` | Precipitation type flags. |
| `data.issnowcovered` | `boolean` | `false` | Whether the world surface is covered in snow. |
| `data.snowlevel` | `number` | `0` | Snow accumulation level. |
| `data.lunarhaillevel`, `data.lunarhailrate` | `number` | `0` | Lunar hail accumulation level and rate. |
| `data.wetness` | `number` | `0` | Current wetness level of the world. |
| `data.iswet` | `boolean` | `false` | Whether the world is currently wet. |

## Main Functions

### `GetWorldAge()`
* **Description:** Returns the total age of the world in world days (1-indexed), computed as `1 + cycles + time`.  
* **Parameters:** None.  
* **Returns:** `number` — The world’s age in days.

### `AddWatcher(var, inst, fn, target)`
* **Description:** Registers a callback function to be invoked whenever the specified world state variable changes. The callback is triggered with `(target, newValue)` as arguments. Additionally, if the variable change corresponds to a named toggle (e.g., `"day"` → `"startday"`), the appropriate start/stop watcher callbacks are invoked.  
* **Parameters:**  
  - `var` (`string`) — The world state variable name (e.g., `"season"`, `"israining"`) to watch.  
  - `inst` (`Entity`) — The owner of the watcher (used for grouping/removal).  
  - `fn` (`function`) — The callback function to invoke on change.  
  - `target` (`any`, optional) — The `self` context when `fn` is called.

### `RemoveWatcher(var, inst, fn, target)`
* **Description:** Removes a previously registered watcher callback. If `fn` is `nil`, all watchers for `inst` under `var` are removed. If no watchers remain for `var`, the entire entry is deleted.  
* **Parameters:**  
  - `var` (`string`) — Variable name being watched.  
  - `inst` (`Entity`) — Entity that registered the watcher.  
  - `fn` (`function` or `nil`) — Specific callback to remove; if `nil`, all callbacks for `inst` under `var` are removed.  
  - `target` (`any`, optional) — Context to match; if provided, only matching watcher entries are removed.

### `OnSave()`
* **Description:** Serializes the current `data` table for persistence (e.g., save files).  
* **Parameters:** None.  
* **Returns:** `table` — A shallow copy of `self.data`.

### `OnLoad(data)`
* **Description:** Restores world state from persisted data. Only values present in the current `self.data` table are updated (prevents undefined keys).  
* **Parameters:**  
  - `data` (`table`) — Saved world state data.

### `Dump()`
* **Description:** Returns a formatted, debug-friendly string listing all key-value pairs in `self.data`, sorted alphabetically.  
* **Parameters:** None.  
* **Returns:** `string` — One `key \t value` pair per line.

## Events & Listeners
- `clocktick` → `OnClockTick`  
- `cycleschanged` → `OnCyclesChanged`  
- `phasechanged` → `OnPhaseChanged` (surface) or `OnCavePhaseChanged` (cave)  
- `moonphasechanged2` → `OnMoonPhaseChanged2` (surface) or `OnCaveMoonPhaseChanged2` (cave)  
- `ms_stormchanged` → `OnAlterAwake`  
- `nightmareclocktick` → `OnNightmareClockTick`  
- `nightmarephasechanged` → `OnNightmarePhaseChanged`  
- `seasontick` → `OnSeasonTick`  
- `seasonlengthschanged` → `OnSeasonLengthsChanged`  
- `temperaturetick` → `OnTemperatureTick`  
- `weathertick` → `OnWeatherTick`  
- `moistureceilchanged` → `OnMoistureCeilChanged`  
- `precipitationchanged` → `OnPrecipitationChanged`  
- `snowcoveredchanged` → `OnSnowCoveredChanged`  
- `wetchanged` → `OnWetChanged`