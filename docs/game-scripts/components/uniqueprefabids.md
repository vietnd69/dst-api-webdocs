---
id: uniqueprefabids
title: Uniqueprefabids
description: Generates and tracks unique numeric IDs per prefab name to ensure distinct identification for spawned entities.
tags: [network, save, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 47e975b9
system_scope: entity
---

# Uniqueprefabids

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`UniquePrefabIDs` maintains a per-prefab instance counter to assign unique, incrementing numeric IDs to newly spawned entities of the same prefab type. This is critical for disambiguating multiple instances (e.g., multiple "rock" prefabs in a level) where a simple prefab name is insufficient. It integrates with DST’s save/load system via `OnSave` and `OnLoad`, ensuring ID continuity across game sessions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("uniqueprefabids")

-- Assign a unique ID for "rock" prefabs
local id = inst.components.uniqueprefabids:GetNextID("rock")
-- id == 1 on first call, 2 on next, etc.

-- Save/load support
local savedata = inst.components.uniqueprefabids:OnSave()
inst.components.uniqueprefabids:OnLoad(savedata)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `topprefabids` | table | `{}` | Dictionary mapping `prefabname` → next unique ID counter value. |

## Main functions
### `GetNextID(prefabname)`
* **Description:** Returns the next sequential numeric ID for the given `prefabname`, incrementing the internal counter.
* **Parameters:** `prefabname` (string) — the name of the prefab (e.g., `"rock"`, `"spider"`).
* **Returns:** (number) — the assigned unique ID for this prefab instance.
* **Error states:** Returns `1` on the first call for a new `prefabname`; increments by `1` on subsequent calls.

### `OnSave()`
* **Description:** Serializes the internal ID counters for saving to disk.
* **Parameters:** None.
* **Returns:** (table) — a table with key `topprefabids` containing the current state of the counter map.

### `OnLoad(data)`
* **Description:** Restores the internal ID counters from saved data, ensuring continued ID sequencing after a reload.
* **Parameters:** `data` (table) — the saved data table, expected to contain `data.topprefabids`.
* **Returns:** Nothing.
* **Error states:** Safely defaults `topprefabids` to `{}` if missing in `data`.

### `GetDebugString()`
* **Description:** Returns a human-readable string listing all tracked prefab IDs and their current counter values.
* **Parameters:** None.
* **Returns:** (string) — formatted as `"prefab1: 2 prefab2: 5 "`.

## Events & listeners
None identified
