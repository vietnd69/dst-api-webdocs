---
id: forestpetrification
title: Forestpetrification
description: Manages the periodic detection and petrification of forest trees across a large area in the world.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 42cd0af4
---

# Forestpetrification

## Overview
This component controls the global process of forest petrification — scanning a wide region for petrifiable entities, counting them, and transforming a subset (up to 20%) into petrified trees on a cyclical basis, with cooldowns and retry logic to balance performance and behavior.

## Dependencies & Tags
- **Events listened to:**
  - `"ms_registerpetrifiable"` — triggered when a petrifiable entity registers.
  - `"ms_unregisterpetrifiable"` — triggered when a registered petrifiable entity is removed.
- **Tags used internally:**
  - `"petrifiable"` — searched via `TheSim:FindEntities`.
- **Component assumptions (not declared here, but required on targets):**
  - Entities in `_tracked` must have a `petrifiable` component with method `:Petrify(false)`.
  - Entities must expose `Transform:GetWorldPosition()`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `self.inst` | `Entity` | `inst` passed to constructor | Reference to the owning entity (typically `TheWorld` or its master copy). |
| `_tracked` | `array<Entity>` | `{}` | List of registered petrifiable entities, maintained by index (`_petrification_index`). |
| `_cooldowndays` | `number?` | `nil` | Remaining cooldown days before next petrification cycle starts. |
| `_tovisit` | `array<{row, col}>?` | `nil` | BFS frontier of sector coordinates to scan during forest detection phase. |
| `_visited` | `table?` | `nil` | Set of visited (row, col) coordinates to avoid duplicate scans. |
| `_found` | `table<Entity, true>?` | `nil` | Set of unique petrifiable entities discovered in current scan. |
| `_numfound` | `number?` | `nil` | Count of entities found in current scan. |
| `_x0`, `_z0` | `number?` | `nil` | Origin world coordinates used for sector-based spatial search. |
| `_retries` | `number?` | `nil` | Remaining retry attempts if too few trees were found. |

No additional public properties are exposed outside `self.inst`.

## Main Functions
### `RandomizeYearPart(minyears, maxyears)`
* **Description:** Returns a random number of in-game days corresponding to a fraction of the seasonal year (summer + spring + autumn + winter lengths), scaled by `minyears` and `maxyears`. Returns `-1` if parameters are invalid.
* **Parameters:**
  - `minyears` (number): Minimum number of years to wait.
  - `maxyears` (number): Maximum number of years to wait.

### `StartCooldown(days)`
* **Description:** Begins a cooldown period, incrementally counting down via `ms_cyclecomplete` callbacks. If `days` is negative, stops any existing cooldown.
* **Parameters:**
  - `days` (number): Number of in-game days to wait before starting a scan.

### `CheckSector(row, col)`
* **Description:** Explores a sector centered at world coordinates `(_x0 + row*SECTOR_DIST, 0, _z0 + col*SECTOR_DIST)` within radius `SECTOR_RADIUS`. Collects up to `petrifiable` entities in a global `_found` set and adds adjacent sectors to `_tovisit` if still within `MAX_SPAN_SQ`.
* **Returns:** Work cost — `1` if no entities, `2` if entities were found/added.
* **Parameters:**
  - `row` (number): Sector row offset.
  - `col` (number): Sector column offset.

### `StartFindingForest(retries)`
* **Description:** Initializes a new forest scan by selecting a random tracked tree as the origin, resetting search state, and starting updates (`OnUpdate`). Sets `_retries` for fallback behavior.
* **Parameters:**
  - `retries` (number?, optional): Number of remaining retries if initial scan yields too few trees.

### `StopFindingForest()`
* **Description:** Clears all scan-related state (`_tovisit`, `_visited`, etc.) and stops component updates.

### `PetrifyForest()`
* **Description:** Petrifies up to 20% of tracked trees (based on `_found`), spawns an announcement prefab at their centroid, and leaves remaining trees untouched.

### `StopTracking(target)`
* **Description:** Removes `target` from `_tracked`, updating indices to preserve array contiguity. Called on entity removal.

### `FindForest()`
* **Description:** Public method to bypass cooldown and start a forest scan immediately.

### `OnPostInit()`
* **Description:** After initialization, starts the first cooldown cycle using tuned `MIN_YEARS`/`MAX_YEARS`.

### `OnUpdate(dt)`
* **Description:** Processes up to `MAX_WORK` work units per tick while scanning. Handles scan completion, petrification, retry logic, and cooldown restart.

### `LongUpdate(dt)`
* **Description:** Handles multi-day advancement during long dt values (e.g., time skipping). Decrements `_cooldowndays` and triggers scanning once cooldown completes.

### `OnSave()`
* **Description:** Serializes current state: only `_cooldowndays` (or `0` if scanning is active). Returns `nil` if empty.

### `OnLoad(data)`
* **Description:** Restores cooldown if `data.cooldown >= 1`. Clears any active scan.

### `LoadPostPass(newents, data)`
* **Description:** If `data.cooldown == 0` and no scan was ongoing (i.e., saved mid-scan), resumes scanning.

### `GetDebugString()`
* **Description:** Returns a human-readable status: `"Finding forest..."`, `"Cooldown in X day(s)"`, or `"Idle"`.

## Events & Listeners
- **Listens for:**
  - `"ms_registerpetrifiable"` → triggers `OnRegisterPetrifiable`.
  - `"ms_unregisterpetrifiable"` → triggers `OnUnregisterPetrifiable`.
  - `"onremove"` (per target) → triggers `StopTracking`.
  - `"ms_cyclecomplete"` (once cooldown is active) → triggers `OnCycleComplete`.

- **Pushes/triggers:**
  - None directly (no use of `inst:PushEvent`).