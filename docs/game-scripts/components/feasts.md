---
id: feasts
title: Feasts
description: Manages the seasonal winter feast mechanics, including grouping nearby feasting tables, tracking feasting players, applying buffs, and handling announcements during feasts.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 01dadf25
---

# Feasts

## Overview  
This component handles the server-side logic for the Winter Feast event in *Don't Starve Together*. It organizes nearby `wintersfeasttable` entities into dynamic groups based on proximity, tracks which players are actively feasting at which tables, applies cooperative feast buffs to players, triggers animations (e.g., "ruffle" events) on tables, and periodically announces feasting status and buff availability to players.

## Dependencies & Tags  
- Requires `TheWorld.ismastersim` (only instantiated on the master server simulation).  
- Does **not** add or remove component tags on the host entity (`inst`).  
- Relies on the following components existing on other entities:  
  - `wintersfeasttable` (on `wintertable` entities — via `components.wintersfeasttable`)  
  - `inventory` (to retrieve cooked feast food from tables)  
  - `talker` (for voice announcements)  
  - `debuff` (to apply "wintersfeastbuff")  

## Properties  

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The host entity (typically the world). |
| `_tablegroups` | `table<table<Entity>>` | `{}` | Groups of tables within range of each other; each inner table is a cluster of adjacent feasting tables. |
| `_feasters` | `table<table{player, target}>` | `{}` | List of active feasters, each entry containing a player and the table they’re feasting at. |
| `TICK_RATE` | `number` | `1/3` | Frequency (in seconds) of internal feast checks. |

## Main Functions  

### `RegisterTable(inst)`
* **Description:** Adds a `wintertable` entity to the active feast system. Scans for nearby tables within range, merges any existing table groups if overlapping, and initializes table group membership and ruffle animations.  
* **Parameters:**  
  - `inst` (`Entity`): The winter feasting table to register.

### `UnregisterTable(inst)`
* **Description:** Removes a table from the system and reorganizes remaining tables in its group into new valid proximity-based groups (if possible).  
* **Parameters:**  
  - `inst` (`Entity`): The table to unregister.

### `GetTableGroup(inst)`
* **Description:** Returns the group index (1-based) containing the given table, or `nil` if not registered.  
* **Parameters:**  
  - `inst` (`Entity`): The table to look up.

### `GetFeasters()`
* **Description:** Returns the internal list of all active feasters (`_feasters`).  
* **Parameters:** None.

### `GetTableGroups()`
* **Description:** Returns the full list of table groups (`_tablegroups`).  
* **Parameters:** None.

### `GetFeasterGroup(feaster)`
* **Description:** Returns the group index containing the table the given player is currently feasting at. Returns `nil` if player isn’t feasting.  
* **Parameters:**  
  - `feaster` (`Entity`): The player entity.

### `GetDebugString()`
* **Description:** Returns a debug string summarizing table group count: `"groups:<N>"`.  
* **Parameters:** None.

---

## Public Methods  

The following are exposed via `inst.components.feasts:<method>()`.

### `:GetTableGroup(inst)`
* **Alias of** `self:GetTableGroup(inst)` (internal). Returns group index.

### `:GetFeasters()`
* **Alias of** `self:GetFeasters()`. Returns `_feasters` list.

### `:GetTableGroups()`
* **Alias of** `self:GetTableGroups()`. Returns `_tablegroups`.

### `:GetFeasterGroup(feaster)`
* **Alias of** `self:GetFeasterGroup(feaster)`. Returns group index or `nil`.

### `:RegisterTable(inst)`
* **Alias of** `self:RegisterTable(inst)`. Adds table to the system.

### `:UnregisterTable(inst)`
* **Alias of** `self:UnregisterTable(inst)`. Removes table from the system.

---

## Events  

The component listens for the following **world-level** events:

| Event | Source | Handler | Description |
|-------|--------|---------|-------------|
| `feasterstarted` | `wintersfeasttable` | `OnFeasterAdded` | Triggered when a player begins feasting at a registered table. Adds player to `_feasters`. Starts internal tick loop and announces buffs. |
| `feasterfinished` | `wintersfeasttable` | `OnFeasterRemoved` | Triggered when a player stops feasting (or table is destroyed). Removes player from `_feasters`. Cancels pending buff announcement and tick task if no feasters remain. |

### `OnFeasterAdded(inst, data)`
* Adds new feaster to `_feasters`.  
* Starts `Tick` loop (`1/3` sec) if not already active.  
* Ensures `data.player` is not in dark (darkness prevents buff announcement).  
* Initiates delayed announcement: `ANNOUNCE_WINTERS_FEAST_BUFF`.

### `OnFeasterRemoved(inst, data)`
* Removes feaster from `_feasters`.  
* Cancels `ANNOUNCE_WINTERS_FEAST_BUFF` task if still pending.  
* If no feasters remain: cancels `ticktask`, cancels `buffannounce` task.

---

## Buff Logic  
- Buff is announced every `DELAY_ANNOUNCE_BUFF + random(0, DELAY_ANNOUNCE_BUFF_VARIANCE)` seconds while at least one feaster exists and the player is not in darkness.  
- The actual buff application (`"wintersfeastbuff"`) is **handled by the `wintersfeasttable` component** on each feaster, not by this component. This component only *triggers announcement* and *coordinates feaster counting*.

---

## Performance Notes  
- Uses `TheSim:FindEntities` during `RegisterTable`, which may be costly if many tables are present.  
- Table grouping logic uses nested loops and frequent `table.insert`/`table.remove` on small arrays (typically < 10 groups), so performance is acceptable for normal play.  
- `feasterstarted/finished` are server-side events only.

---

## Known Limitations  
- Only works on the **master simulation** (`ismastersim`). Clients do not execute this component.  
- Ruffle animation timing is approximate (based on distance remapping, but fixed rate `0..1s`, no delta compensation).  
- If a player feasts at two tables simultaneously (e.g., switching mid-feast), duplicate entries may exist until `feasterfinished` fires.  
- The `gettablegroup` helper function is referenced but not defined in this snippet — must be defined elsewhere (likely in the same `feasts.lua` file).

---

## Example Usage (Server-Side)

```lua
-- Register a new feasting table:
inst.components.feasts:RegisterTable(table_entity)

-- Check feasters:
local feasters = inst.components.feasts:GetFeasters()
print("Feasters:", #feasters)

-- Announce manually (not recommended unless debugging):
inst.components.talker:Say("Feast is happening!")
```

---

## Source File  
`components/wintersfeast/feasts.lua`  
Located in the game’s default `scripts/components/` or modded override paths.

--- 

Let me know if you'd like a diagram of the table-grouping algorithm or unit tests for edge cases!