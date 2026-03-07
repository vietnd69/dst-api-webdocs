---
id: hammer
title: Hammer
description: A durable tool and weapon used for destroying structures and enemies; has finite durability and triggers skin overrides when equipped.
tags: [combat, tool, inventory, durability, equipment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7ec3e66c
system_scope: inventory
---

# Hammer

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `hammer` prefab implements a multi-purpose tool and weapon entity. It integrates with the `tool`, `weapon`, `equippable`, `finiteuses`, and `inventoryitem` components to provide hit-based structure destruction, finite durability management, equipping animations/skins, and removal upon exhaustion. It is typically used by players and allies as a primary destruction tool.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("hammer") -- Note: This is a prefab, not a component
-- Instead, instantiate via: TheWorld:SpawnPrefab("hammer")
```
In practice, hammers are instantiated via `SpawnPrefab("hammer")`, and their behavior is controlled through component interactions on the instance.

## Dependencies & tags
**Components used:** `weapon`, `inventoryitem`, `tool`, `finiteuses`, `inspectable`, `equippable`  
**Tags added:** `hammer`, `tool`, `weapon`  
**Tags checked:** `usesdepleted` (via `finiteuses` component lifecycle)

## Properties
No public properties are exposed directly by this prefab.

## Main functions
No public methods are defined directly in this file. All behavior is implemented via component callbacks and default component logic (e.g., `SetOnEquip`, `SetConsumption`).

## Events & listeners
- **Listens to:** None directly (event handling is delegated to components and callbacks).
- **Pushes:**  
  - `equipskinneditem` when equipped with a skin (via `owner:PushEvent`)  
  - `unequipskinneditem` when unequipped with a skin (via `owner:PushEvent`)  
  - Events from component lifecycle: `percentusedchange` (via `finiteuses`), `actionfail` (via `tool` on depletion), `usefinished` (via `finiteuses` when finished).