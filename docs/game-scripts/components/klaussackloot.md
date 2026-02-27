---
id: klaussackloot
title: Klaussackloot
description: Generates and manages loot tables for Klaus-related sacks, supporting both regular and Winters' Feast event loot with save/load persistence.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: 60f2e9af
---

# Klaussackloot

## Overview
The `KlausSackLoot` component handles dynamic generation of loot containers for Klaus (and related entities like Krampus, No-Eye, etc.) in Don't Starve Together. It precomputes loot sets—both standard and event-specific (Winters' Feast)—during initialization and provides a `GetLoot()` method to return the current loot configuration. Loot tables are regenerated after retrieval to support multiple uses while ensuring randomness on each call.

## Dependencies & Tags
- Uses global functions: `GetRandomFancyWinterOrnament()`, `GetRandomLightWinterOrnament()`, `GetRandomBasicWinterOrnament()`
- Uses global array: `boss_ornaments`
- Uses global constant: `SPECIAL_EVENTS.WINTERS_FEAST`
- Uses global utility: `IsSpecialEventActive(...)`
- Uses global helper: `FillItems(...)`
- Does not require any specific component on `inst`
- Does not add/remove tags

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this component is attached to (passed to constructor) |
| `wintersfeast_loot` | `table` | `{}` | Loot array specific to Winters' Feast event (populated on construction) |
| `loot` | `table` | `{}` | Standard loot array (populated on construction) |

> Note: `wintersfeast_loot` and `loot` are populated during `:RollKlausLoot()` in the constructor. They are persisted via `OnSave`/`OnLoad`.

## Main Functions

### `:RollKlausLoot()`
* **Description:** Generates two sets of loot tables: `wintersfeast_loot` (for Winters’ Feast event) and `loot` (standard loot). Runs during construction and after every `:GetLoot()` call.
* **Parameters:** None

### `:GetLoot()`
* **Description:** Returns a flattened copy of the currently generated loot (including event loot if Winters' Feast is active), then *re-roll*s the loot for next use.
* **Parameters:** None  
* **Returns:** `table` — Array of loot entries; each entry is either a string (prefab name) or a table (e.g., `{"prefab", count}`).

### `:OnSave()`
* **Description:** Serializes current loot tables for persistence across sessions (e.g., when the sack is in a world save).
* **Parameters:** None  
* **Returns:** `table` — `{ wintersfeast_loot = ..., loot = ... }`

### `:OnLoad(data)`
* **Description:** Restores loot state from saved data if present (e.g., when loading a world with a pre-generated sack).
* **Parameters:**  
  - `data` (`table?`) — Optional saved state containing `wintersfeast_loot` and `loot`.

## Events & Listeners
None identified.