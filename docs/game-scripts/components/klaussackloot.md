---
id: klaussackloot
title: Klaussackloot
description: Generates and manages loot tables for Klaus boss encounters, including seasonal (Winters' Feast) and standard loot pools.
tags: [loot, boss, event, component]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 60f2e9af
system_scope: world
---

# Klaussackloot

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`KlausSackLoot` is a component that prepares and stores loot rewards for Klaus boss defeats. It handles two distinct loot pools: a seasonal `wintersfeast_loot` (active only during Winters' Feast) and a standard `loot` pool. The component generates deterministic loot sets upon initialization and exposes them via `GetLoot()`, which also triggers a fresh roll for subsequent uses. It supports persistence via `OnSave()`/`OnLoad()` for save/load synchronization.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("klaussackloot")

-- Trigger loot generation
local loot = inst.components.klaussackloot:GetLoot()
-- loot is a table of subtables; each subtable represents one "slot"
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks `SPECIAL_EVENTS.WINTERS_FEAST` (via `IsSpecialEventActive`) but does not modify tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `wintersfeast_loot` | table of tables | `{}` (initialized on first roll) | Seasonal loot generated during Winters' Feast event; each inner table is a loot slot. |
| `loot` | table of tables | `{}` (initialized on first roll) | Standard loot pool; each inner table is a loot slot. |

## Main functions
### `RollKlausLoot()`
*   **Description:** Generates both the `wintersfeast_loot` and `loot` tables based on hardcoded logic and randomization. Called automatically in the constructor and after each `GetLoot()` call.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None identified — always populates both loot tables.

### `GetLoot()`
*   **Description:** Returns the currently computed loot pool. If Winters' Feast is active, includes seasonal loot at the beginning. Immediately triggers a fresh `RollKlausLoot()` call after returning, so results are non-persistent across calls unless saved.
*   **Parameters:** None.
*   **Returns:** `loot` (table of tables) — a flat list of loot slots. Each slot is a table that may contain:
    *   a string (single prefab name), or
    *   a table with `{prefab, count}` (for quantity-based items), or
    *   nested tables (if `FillItems` was used).
*   **Error states:** None identified — always returns a non-empty table.

### `OnSave()`
*   **Description:** Serializes the current state of both loot tables for saving.
*   **Parameters:** None.
*   **Returns:** `table` with keys `wintersfeast_loot` and `loot`, each containing the respective loot tables.

### `OnLoad(data)`
*   **Description:** Restores loot state from saved data. Does nothing if `data` is `nil`.
*   **Parameters:** `data` (table) — expected shape: `{ wintersfeast_loot = ..., loot = ... }`.
*   **Returns:** Nothing.

## Events & listeners
None identified.
