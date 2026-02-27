---
id: worldtemperature
title: Worldtemperature
description: Computes and manages world temperature by combining seasonal, phase, noise, and modifier factors, while driving seasonal visual bloom effects.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 29f04e55
---

# Worldtemperature

## Overview
This component calculates and broadcast the current world temperature in real time, incorporating seasonal progression, day/night cycles, noise-based variation, and global modifiers. It also drives seasonal bloom effects during summer days and synchronizes temperature data across networked clients and the server.

## Dependencies & Tags
- `TheWorld` (global reference)
- Listens for events: `"seasontick"`, `"clocktick"`, `"phasechanged"` (from `TheWorld`), and `"ms_simunpaused"` (server only).
- Pushes events: `"temperaturetick"` (with calculated temperature), `"overridecolourmodifier"` (summer bloom effect).
- Adds network variable: `_noisetime` (float, GUID-bound) for deterministic noise synchronization.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity the component is attached to (typically the world). |
| `_world` | `TheWorld` | `TheWorld` | Global world instance reference (private). |
| `_ismastersim` | `boolean` | `TheWorld.ismastersim` | Whether this instance is the master simulation (private). |
| `_noisetime` | `net_float` | `0` | Networked noise time counter, used for deterministic temperature noise (private). |
| `_seasontemperature` | `number` | Calculated at init | Current temperature contribution from the season (private). |
| `_phasetemperature` | `number` | `0` | Current temperature contribution from day/night phase (private). |
| `_globaltemperaturemult` | `number` | `1` | Global multiplier applied to final temperature (public via `SetTemperatureMod`) (private). |
| `_globaltemperaturelocus` | `number` | `0` | Global temperature offset/locus applied to final temperature (public via `SetTemperatureMod`) (private). |
| `_season` | `string` | `"autumn"` | Current season name (private). |
| `_daylight` | `boolean` | `true` | Whether the current phase is daylight (private). |

## Main Functions

### `SetTemperatureMod(multiplier, locus)`
* **Description:** Applies a global temperature modifier (multiplier and locus offset) to the final temperature calculation and immediately pushes a new temperature update. Used for effects like global warming, special biomes, or events.
* **Parameters:**
  - `multiplier` (`number`): Scaling factor applied to the temperature delta (default `1`).
  - `locus` (`number`): Constant offset applied before scaling (default `0`).

### `OnUpdate(dt)`
* **Description:** Periodically updates the noise time, recalculates summer bloom, and pushes the current temperature to listeners. Runs on both client and server (server handles authoritative syncing; client simulates and adjusts based on server syncs).
* **Parameters:**
  - `dt` (`number`): Delta time in seconds since the last update.

### `GetDebugString()`
* **Description:** Returns a formatted string for debugging tools, showing the current calculated temperature along with active modifiers.
* **Returns:** `string` — e.g., `"23.45C mult: 1.10 locus 2.0"`

### `OnSave()`
* **Description:** (Server only) Serializes core state for save file compatibility.
* **Returns:** `table` — containing `daylight`, `season`, `seasontemperature`, `phasetemperature`, and `noisetime`.

### `OnLoad(data)`
* **Description:** (Server only) Restores component state from a saved data table upon world load.
* **Parameters:**
  - `data` (`table`): Serialized component state from `OnSave()`.

## Events & Listeners
- **Listens:**
  - `"seasontick"` (from `TheWorld`) → updates `_seasontemperature` and season tracking
  - `"clocktick"` (from `TheWorld`) → updates `_phasetemperature` based on time-of-day phase
  - `"phasechanged"` (from `TheWorld`) → updates `_daylight` flag
  - `"ms_simunpaused"` (server only) → forces resync of networked noise time
- **Triggers:**
  - `"temperaturetick"` (to `TheWorld`) — carries the newly calculated temperature value
  - `"overridecolourmodifier"` (to `TheWorld`) — carries summer bloom intensity value (only active in summer daylight)