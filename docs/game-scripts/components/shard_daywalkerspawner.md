---
id: shard_daywalkerspawner
title: Shard Daywalkerspawner
description: Manages networked location state for the Daywalker boss between cave and surface spawns.
tags: [boss, network, map]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9ecab008
system_scope: network
---

# Shard Daywalkerspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`shard_daywalkerspawner` is a networked component that tracks and synchronizes the Daywalker boss’s current spawn location across server shards. It ensures consistent state between master and non-master shards by maintaining a numeric location enum (`cavejail` or `forestjunkpile`) and exposing it via a replicated variable. It only exists on the master simulation (`TheWorld.ismastersim`), and coordinates location updates when the Daywalker is defeated.

## Usage example
```lua
-- Typically added automatically to the Daywalker entity by its prefab.
-- Example of reading location on any shard:
if inst.components.shard_daywalkerspawner then
    local location_name = inst.components.shard_daywalkerspawner:GetLocationName()
    print("Daywalker is at:", location_name)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `DAYWALKERLOCATION` | table | `{ cavejail = 0, forestjunkpile = 1 }` | Enum mapping string keys to location IDs. |
| `DAYWALKERLOCATION_LOOKUP` | table | populated at runtime | Reverse lookup from numeric ID to location name. |
| `location` | `net_tinybyte` | `0` | Replicated numeric location value synced across shards. |

## Main functions
### `GetLocation()`
* **Description:** Returns the current numeric location ID (`0` for `cavejail`, `1` for `forestjunkpile`).  
* **Parameters:** None.  
* **Returns:** `number` — the current location enum value.  

### `GetLocationName()`
* **Description:** Returns the string name corresponding to the current location.  
* **Parameters:** None.  
* **Returns:** `string` — either `"cavejail"` or `"forestjunkpile"`.  

### `SetLocation(location)`
* **Description:** Sets the location, accepting either a numeric enum or its string name. Triggers network sync via `location:set()`.  
* **Parameters:**  
  - `location` (`number|string`) — numeric enum or `"cavejail"`/`"forestjunkpile"` string.  
* **Returns:** Nothing.  

### `GetDebugString()`
* **Description:** Returns a human-readable debug string including shard role and current location.  
* **Parameters:** None.  
* **Returns:** `string` — formatted like `"Mastershard: 1, Location: cavejail"`.  

## Events & listeners
- **Listens to:**  
  - `master_shardbossdefeated` (only on mastershard) — triggers location toggle when Daywalker is defeated.  
  - `locationdirty` (only on non-mastershard) — stub handler; no functional effect.  

- **Pushes:** None. (Event handling modifies local state but does not emit additional events.)
