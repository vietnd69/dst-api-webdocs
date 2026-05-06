---
id: winona_battery_high
title: Winona Battery High
description: Defines the Winona Battery High structure and item prefab for power generation and circuit management.
tags: [engineering, power, structure, winona, circuit]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: e213b333
system_scope: entity
---

# Winona Battery High

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`winona_battery_high` defines the placeable structure and inventory item for Winona's high-tier battery. It manages fuel consumption, gem socketing (Pure Brilliance and Alter Guardian Hat Shards), and connection to the engineering circuit network. The prefab handles overload mechanics, skill tree efficiency bonuses, and visual/audio feedback for power states. It also includes definitions for the placement placer and shatter FX prefabs.

## Usage example
```lua
local inst = SpawnPrefab("winona_battery_high")
inst.components.fueled:StartConsuming()
inst.components.circuitnode:ConnectTo("engineeringbatterypowered")

local is_overloaded = inst:IsOverloaded()
local element_type = inst:CheckElementalBattery()

inst:ConsumeBatteryAmount({ fuel = 100, shard = 1 }, 1, player)
```

## Dependencies & tags
**External dependencies:**
- `prefabutil` -- helper functions for prefab creation and setup
- `TUNING` -- balance constants for fuel capacity, range, and skill multipliers
- `TheNet` -- checks for engineer player presence and user IDs
- `TheWorld` -- listens for global skill tree change events

**Components used:**
- `deployhelper` -- manages placement preview and validation logic
- `updatelooper` -- handles periodic visual and sound updates
- `portablestructure` -- allows dismantling the structure back into an item
- `inspectable` -- provides status text (e.g., "OVERLOADED", "LOWPOWER")
- `trader` -- accepts gem items via socketing interaction
- `fueled` -- manages charge levels, sections, and consumption rate
- `timer` -- tracks overload duration and shard regeneration delays
- `lootdropper` -- drops socketed gems on destruction
- `workable` -- allows hammering to dismantle the structure
- `circuitnode` -- connects to the engineering power network
- `battery` -- defines power output behavior and usage callbacks
- `burnable` -- handles fire damage, burning, and burnt state
- `hauntable` -- allows ghost players to haunt the structure
- `inventoryitem` -- (Item variant) enables carrying in inventory
- `deployable` -- (Item variant) enables placing into the world

**Tags:**
- `structure` -- identifies entity as a building
- `engineering` -- part of Winona's engineering system
- `engineeringbattery` -- specifically identifies as a power source
- `gemsocket` -- indicates acceptance of gem items
- `trader` -- enables trading/socketing interaction
- `portableitem` -- (Item variant) identifies as carryable
- `NOCLICK` -- temporarily prevents interaction during animations
- `FX` -- (Shatter FX) identifies as visual effect only
- `CLASSIFIED` -- (Helper entities) hides from normal entity searches

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_gems` | table | `{}` | List of currently socketed gem prefabs or save records. |
| `_gemsymfollowers` | table | `{}` | Map of slot index to follower FX entities for socketed gems. |
| `_shard_level` | number | `0` | Count of Alter Guardian Hat Shards currently socketed. |
| `_brilliance_level` | number | `0` | Count of Pure Brilliance gems currently socketed. |
| `_noidledrain` | boolean | `false` | If true, prevents fuel drain when connected loads are idle. |
| `_efficiency` | number | `0` | Skill tree efficiency tier (0-3) applied to consumption. |
| `_engineerid` | string | `nil` | User ID of the Winona who placed or last modified the battery. |
| `_batterytask` | task | `nil` | Periodic task reference for adding battery power to nodes. |
| `_inittask` | task | `nil` | Delayed task reference for initial circuit connection. |
| `_updatingshardload` | boolean | `nil` | Flag indicating if shard load update loop is active. |
| `_lastchargeframe` | number | `nil` | Tracks animation frame for idle charge sound timing. |
| `_hitanim` | string | `nil` | Stores the name of the current hit animation. |
| `_circuittask` | task | `nil` | Task reference for recalculating circuit power load. |
| `helper` | entity | `nil` | Deploy helper entity for placement preview. |
| `scrapbook_anim` | string | `"idle_empty"` | Animation name used for scrapbook display. |
| `scrapbook_specialinfo` | string | `"WINONABATTERYHIGH"` | Info key for scrapbook entry. |

## Main functions
### `fn()`
*   **Description:** Constructor function for the placed structure entity. Attaches all components, initializes state variables, and sets up network replication.
*   **Parameters:** None.
*   **Returns:** Entity instance.
*   **Error states:** None.

### `itemfn()`
*   **Description:** Constructor function for the inventory item variant. Configures physics, inventory component, and deployable logic.
*   **Parameters:** None.
*   **Returns:** Entity instance.
*   **Error states:** None.

### `fxfn()`
*   **Description:** Constructor function for the gem shatter visual effect entity.
*   **Parameters:** None.
*   **Returns:** Entity instance.
*   **Error states:** None.

### `CheckElementalBattery()`
*   **Description:** Returns the type of elemental power source active based on socketed gems.
*   **Parameters:** None.
*   **Returns:** `"brilliance"`, `"shard"`, or `nil`.
*   **Error states:** None.

### `ConsumeBatteryAmount(cost, share, doer)`
*   **Description:** Consumes fuel or shard charge based on usage. Handles overload logic for shards and updates timers. Requires `cost` table with `fuel` and `shard` fields.
*   **Parameters:**
    - `cost` -- table with `fuel` and `shard` amounts.
    - `share` -- number divisor for shared cost (optional).
    - `doer` -- player entity performing the action (optional).
*   **Returns:** None.
*   **Error states:** Errors if `inst.components.fueled` or `inst.components.timer` is missing.

### `IsOverloaded()`
*   **Description:** Checks if the battery is currently in an overloaded state by verifying the overload timer.
*   **Parameters:** None.
*   **Returns:** Boolean.
*   **Error states:** Errors if `inst.components.timer` is missing.

### `OnUsedIndirectly(doer)`
*   **Description:** Updates skill tree bonuses when the battery is used by a device connected to the circuit.
*   **Parameters:** `doer` -- player entity using power.
*   **Returns:** None.
*   **Error states:** None.

### `OnSave(data)`
*   **Description:** Serializes gem data, fuel state, and skill upgrades for persistence.
*   **Parameters:** `data` -- table to populate with save data.
*   **Returns:** None.
*   **Error states:** None.

### `OnLoad(data, ents)`
*   **Description:** Restores gem sockets, fuel level, and skill upgrades from save data.
*   **Parameters:**
    - `data` -- table containing saved state (can be nil).
    - `ents` -- entity reference map (unused).
*   **Returns:** None.
*   **Error states:** None.

### `OnLoadPostPass()`
*   **Description:** Finalizes loading by ensuring circuit connection task runs if not cancelled.
*   **Parameters:** None.
*   **Returns:** None.
*   **Error states:** None.

### `OnEntitySleep()`
*   **Description:** Stops sound loops and update tasks when the entity goes out of simulation range.
*   **Parameters:** None.
*   **Returns:** None.
*   **Error states:** None.

### `OnEntityWake()`
*   **Description:** Restarts sound loops and update tasks when the entity comes back into simulation range.
*   **Parameters:** None.
*   **Returns:** None.
*   **Error states:** None.

## Events & listeners
- **Listens to:**
    - `onbuilt` -- triggers placement animation and circuit connection.
    - `ondeconstructstructure` -- drops socketed gems before removal.
    - `engineeringcircuitchanged` -- recalculates power load and consumption rate.
    - `timerdone` -- handles overload expiry and shard regeneration delays.
    - `winona_batteryskillchanged` -- updates efficiency bonuses when Winona changes skills.
    - `animover` -- manages animation state transitions (e.g., hit, build).
- **Pushes:**
    - None directly (relies on component events like `percentusedchange` and `engineeringcircuitchanged` via circuitnode).