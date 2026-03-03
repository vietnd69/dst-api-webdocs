---
id: deathloothandler
title: Deathloothandler
description: Stores and persists loot information associated with an entity's death, such as item prefabs and an optional level value.
tags: [loot, persistence, death]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 4d253328
system_scope: entity
---

# Deathloothandler

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`DeathLootHandler` is a lightweight component responsible for storing and persisting loot data tied to a death event. It does not generate or drop items itself—instead, it collects and retains references to loot item prefabs and an optional difficulty level for later processing. It supports save/load operations via `OnSave` and `OnLoad`, enabling persistence across game sessions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("deathloothandler")
inst.components.deathloothandler:StoreLoot({"meat", "bone"})
inst.components.deathloothandler:SetLevel(2)
-- Later, to retrieve stored loot:
local loot = inst.components.deathloothandler:GetLoot()
local level = inst.components.deathloothandler:GetLevel()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `level` | number | `0` | An optional numeric level associated with the loot context (e.g., difficulty or stage). |
| `loot` | table | `{}` | A list of strings, each representing a prefab name of a loot item. |

## Main functions
### `StoreLoot(prefabs)`
* **Description:** Appends one or more item prefabs to the internal loot list.  
* **Parameters:** `prefabs` (table of strings) — list of prefab names to store.  
* **Returns:** Nothing.  
* **Error states:** No explicit validation; inserting invalid/`nil` values may cause errors downstream.

### `GetLoot()`
* **Description:** Returns the currently stored loot list.  
* **Parameters:** None.  
* **Returns:** table — the list of stored loot prefab names. May be empty.

### `SetLevel(num)`
* **Description:** Sets the numeric level value associated with this loot.  
* **Parameters:** `num` (number) — the level to store (e.g., difficulty or spawn tier).  
* **Returns:** Nothing.

### `GetLevel()`
* **Description:** Returns the stored level value.  
* **Parameters:** None.  
* **Returns:** number — the current level, or `0` if unset.

### `OnSave()`
* **Description:** Prepares the component’s state for serialization. Returns a table containing `level` and `loot` if `level > 0`, otherwise returns `nil`. The returned table also signals that the component should be added if missing during load.  
* **Parameters:** None.  
* **Returns:** table? — `nil` if `level <= 0`; otherwise `{ level = number, loot = table, add_component_if_missing = true }`.

### `OnLoad(data)`
* **Description:** Restores the component’s state from a previously saved data table.  
* **Parameters:** `data` (table?) — saved component state, or `nil`.  
* **Returns:** Nothing.  
* **Error states:** If `data.level` or `data.loot` is absent, defaults to `0` or `{}`, respectively.

## Events & listeners
None identified
