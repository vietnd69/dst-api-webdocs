---
id: wx78_abilitycooldown
title: Wx78 Abilitycooldown
description: Invisible networked prefab entity that tracks WX-78 player ability cooldown state via netvars and wall update ticks.
tags: [prefab, wx78, cooldown, network]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 6ae19d5b
system_scope: entity
---

# Wx78 Abilitycooldown

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`wx78_abilitycooldown.lua` registers an invisible, non-persisting prefab entity used to track individual ability cooldowns for the WX-78 character. The prefab uses network variables (`net_hash`, `net_byte`, `net_ushortint`) to synchronize cooldown state between server and clients. On the server, it runs wall update ticks via the `updatelooper` component to decrement cooldown progress; on clients, it listens for dirty events to update local preview state. The prefab is classified and hidden from normal entity queries.

## Usage example
```lua
-- Spawn a cooldown tracker (typically done internally by WX-78 components):
local cooldown = SpawnPrefab("wx78_abilitycooldown")

-- Server: Initialize with ability name and duration in seconds
if TheWorld.ismastersim then
    cooldown:InitAbilityCooldown("overcharge", 10)
end

-- Read cooldown state (both client and server):
local name = cooldown:GetAbilityName()
local duration = cooldown:GetLength()
local percent = cooldown:GetPercent()

-- Client receives updates via namedirty/pctdirty events automatically
```

## Dependencies & tags

**Components used:**
- `updatelooper` -- registers `OnWallUpdate` callback for periodic cooldown decrement

**Tags:**
- `CLASSIFIED` -- added in `fn()`; hides entity from normal queries and targeting

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `pct` | number | `1` | Local preview state for cooldown percentage (0-1). Reverted on server sync. |
| `syncdelay` | number | `1` | (master only) Delay counter before next network sync; decrements each wall update. |
| `_name` | net_hash | --- | Networked ability name string. Dirty event: `namedirty`. |
| `_pct` | net_byte | `180` | Networked cooldown percentage scaled to 0-180 range. Dirty event: `pctdirty`. |
| `_len` | net_ushortint | --- | Networked cooldown duration in deciseconds (duration * 10). No dirty event. |
| `SYNC_INTERVAL` | constant (local) | `1` | Default sync delay interval in seconds between network updates. |

## Main functions
### `fn()`
* **Description:** Prefab constructor. Creates invisible classified entity, initializes network variables, attaches updatelooper component, and sets up master/client split logic. Server sets up sync delay and server interface methods; client registers dirty event listeners. Returns `inst` for prefab framework.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — runs on every host with appropriate branching.

### `GetAbilityName()`
* **Description:** Returns the ability name stored in the `_name` netvar. Safe to call on both client and server.
* **Parameters:** None
* **Returns:** string ability name from `inst._name:value()`
* **Error states:** None.

### `GetLength()`
* **Description:** Returns the cooldown duration in seconds. Reads `_len` netvar (stored as deciseconds) and divides by 10.
* **Parameters:** None
* **Returns:** number duration in seconds
* **Error states:** None.

### `GetPercent()`
* **Description:** Returns the current cooldown progress as a percentage (0-1 range). Reads local `inst.pct` value.
* **Parameters:** None
* **Returns:** number between 0 and 1
* **Error states:** None.

### `SetPercent(percent, overtime)`
* **Description:** Updates cooldown percentage with network sync. Behavior depends on percent value:
  - `percent <= 0` — removes entity on master; sets local state to 0 on client
  - `percent >= 1` — caps at 1, sets `_pct` to 180, resets `syncdelay` if present
  - `0 < percent < 1` — sets `inst.pct`, scales to 0-180 range for `_pct`, resets `syncdelay` unless `overtime` is true
* **Parameters:**
  - `percent` -- number cooldown percentage (0-1 range)
  - `overtime` -- boolean if true, uses `set_local` to avoid network sync
* **Returns:** nil
* **Error states:** None — handles all percent ranges with guards.

### `InitAbilityCooldown(abilityname, duration)`
* **Description:** (master only) Initializes a new cooldown with the given ability name and duration. Sets `_name` and `_len` netvars, clamping duration to 0-65535 deciseconds range.
* **Parameters:**
  - `abilityname` -- string ability identifier
  - `duration` -- number duration in seconds (converted to deciseconds internally)
* **Returns:** nil
* **Error states:** Errors if called on client without master guard (source does not guard this function).

### `RestartAbilityCooldown(duration)`
* **Description:** (master only) Resets an existing cooldown with a new duration. Updates `_len` netvar and sets percent to 1 (full cooldown).
* **Parameters:** `duration` -- number new duration in seconds
* **Returns:** nil
* **Error states:** Errors if called on client without master guard (source does not guard this function).

### `OnNameDirty(inst)` (local)
* **Description:** Client-only event handler for `namedirty` event. When the ability name changes on the server, registers this cooldown entity with the player's `wx78_abilitycooldowns` component.
* **Parameters:** `inst` -- this cooldown entity
* **Returns:** nil
* **Error states:** None — guards against missing `ThePlayer` or missing component.

### `OnPctDirty(inst)` (local)
* **Description:** Client-only event handler for `pctdirty` event. Updates local `inst.pct` from the networked `_pct` value (scaled from 0-180 range back to 0-1).
* **Parameters:** `inst` -- this cooldown entity
* **Returns:** nil
* **Error states:** None.

### `OnWallUpdate(inst, dt)` (local)
* **Description:** Wall update callback registered with updatelooper. Decrements cooldown percentage over time based on elapsed time and cooldown length. Fires every wall tick. Logic:
  - Scales `dt` by time scale
  - If `pct > 0` and `_len <= 0`, sets percent to 0 (removes entity on master)
  - Otherwise decrements `pct` by `dt / (length in seconds)`, passing `overtime=true` when `syncdelay` reaches 0
  - Decrements `syncdelay` counter each tick
* **Parameters:**
  - `inst` -- this cooldown entity
  - `dt` -- number delta time since last update
* **Returns:** nil
* **Error states:** None.

## Events & listeners
**Listens to (client only):**
- `namedirty` — triggers `OnNameDirty`; registers cooldown with player's `wx78_abilitycooldowns` component. Data: none
- `pctdirty` — triggers `OnPctDirty`; updates local `pct` from networked `_pct` value. Data: none

**Pushes (via netvar setters):**
- `namedirty` — fired when `_name:set()` is called on master
- `pctdirty` — fired when `_pct:set()` is called on master