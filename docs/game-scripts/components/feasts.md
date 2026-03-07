---
id: feasts
title: Feasts
description: Manages group coordination, buff application, and announcement logic for winter feast events when multiple players and tables interact.
tags: [event, buff, multiplayer, world]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 01dadf25
system_scope: world
---

# Feasts

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Feasts` component tracks players and Winter Feast tables participating in a shared feast event, maintains table groupings based on proximity, and periodically applies feast buffs to feasting players while managing verbal announcements and food consumption. It runs exclusively on the master simulation (server), as confirmed by its constructor's assertion.

Key responsibilities include:
- Grouping tables within `TUNING.WINTERSFEASTTABLE.TABLE_RANGE` into single feast units.
- Tracking which players are feasting at which tables.
- Coordinating the depletion of food items from tables via `WintersFeastTable:DepleteFood`.
- Applying cumulative feast buffs to players based on number of feasters and distinct food types.
- Triggering spoken announcements (e.g., "I'm feasting!" and buff completion messages) using the `Talker` component.

It listens globally for `feasterstarted` and `feasterfinished` events on `TheWorld` to maintain dynamic feast membership.

## Usage example
```lua
-- Typically added automatically via the winter feast table prefab.
-- Manual addition is not recommended; this component is tightly coupled to Winters Feast tables and players.

local inst = CreateEntity()
inst:AddComponent("feasts")
-- Then register tables and let players trigger 'feasterstarted' events:
inst.components.feasts:RegisterTable(some_table_entity)
TheWorld:PushEvent("feasterstarted", {player = player_entity, target = some_table_entity})
```

## Dependencies & tags
**Components used:** `inventory`, `talker`, `wintersfeasttable`
**Tags:** Checks for `wintersfeasttable` tag on tables; checks for `wintersfeastcookedfood` tag on food items.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (injected) | The entity instance to which this component is attached (always a Winter Feast table entity). |
| `_tablegroups` | `table` | `{}` | Internal grouping of tables (array of arrays), each inner array representing one connected feast unit. |
| `_feasters` | `table` | `{}` | Internal list of `{player = Entity, target = Entity}` entries tracking current feasters. |
| `TICK_RATE` | `number` | `1/3` | Interval in seconds between feast check cycles. |
| `NUM_FEASTERS_MAX_ANNOUNCE_RATE`, `ANNOUNCE_*`, etc. | `number` | Constants | Internal tuning values for announcement timing and verbosity scaling. |

## Main functions
### `RegisterTable(inst)`
* **Description:** Registers a Winter Feast table, computing its proximity to nearby tables and merging any overlapping groups. If multiple tables are within range, they are grouped into a single feast unit.
* **Parameters:** `inst` (`Entity`) — the Winter Feast table to register.
* **Returns:** Nothing.
* **Error states:** Does not validate input; silently ignores non-table entities.

### `UnregisterTable(inst)`
* **Description:** Removes a table from the internal grouping system, splitting its group if necessary and re-grouping remaining tables in that unit based on proximity.
* **Parameters:** `inst` (`Entity`) — the Winter Feast table to unregister.
* **Returns:** Nothing.
* **Error states:** If `inst` is not currently registered, no action occurs.

### `GetTableGroup(inst)`
* **Description:** Returns the group index (1-based) to which the given table belongs. `nil` if the table is not in any group.
* **Parameters:** `inst` (`Entity`) — the table entity to query.
* **Returns:** `number?` — group index or `nil`.

### `GetFeasters()`
* **Description:** Returns the internal list of active feasters.
* **Parameters:** None.
* **Returns:** `table` — array of `{player = Entity, target = Entity}` tables.

### `GetTableGroups()`
* **Description:** Returns the internal table grouping structure.
* **Parameters:** None.
* **Returns:** `table` — array of arrays, each inner array containing `Entity` references to tables in that group.

### `GetFeasterGroup(feaster)`
* **Description:** Returns the group index for the given feasting player’s active table.
* **Parameters:** `feaster` (`Entity`) — the player entity currently feasting.
* **Returns:** `number?` — group index or `nil` if the player is not feasting.

### `GetDebugString()`
* **Description:** Returns a debug-friendly summary of group count.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"groups:3"`.

## Events & listeners
- **Listens to:**
  - `feasterstarted` (on `TheWorld`) — invoked when a player begins feasting. Adds player to `_feasters` and triggers a task loop if not already running.
  - `feasterfinished` (on `TheWorld`) — invoked when a player stops feasting (e.g., logs out). Removes player and optionally schedules a buff completion announcement.

- **Pushes:**
  - `"ruffle"` (on `Entity`) — fires randomly on idle tables when food is depleted, or in sequence when tables join a group.
  - `"feasterfinished"` (on `TheWorld`) — manually pushed when a feaster’s `onremove` event fires.

Event-driven announcements use `GetString` to fetch localized strings (e.g., `"ANNOUNCE_IS_FEASTING"`, `"ANNOUNCE_WINTERS_FEAST_BUFF"`), and call `Talker:Say` with appropriate context. Buff announcements are delayed for non-dark players and cancelled if the player enters darkness.
