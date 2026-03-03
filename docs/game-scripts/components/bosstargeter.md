---
id: bosstargeter
title: Bosstargeter
description: Tracks and manages boss entities for gameplay systems that need to know when a boss is present in the world.
tags: [boss, combat, world, ai]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d41d8cd9
system_scope: world
---

# Bosstargeter

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`bosstargeter` is a world-scoped component that monitors the presence of boss entities in the game world. It maintains a list of active bosses and notifies other systems (such as quests, world events, or UI elements) when boss-related conditions change, such as when a boss spawns or dies. It is typically added to a world-level entity that persists across levels.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("bosstargeter")

-- System that uses the bosstargeter
if inst.components.bosstargeter:GetNumBosses() > 0 then
    -- Trigger boss-related event or UI state
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `boss` when a boss entity is registered; removes `boss` when a boss dies and is unregistered.

## Properties
No public properties

## Main functions
### `RegisterBoss(inst)`
*   **Description:** Registers an entity as a boss, marking it with the `boss` tag and adding it to the internal boss list.
*   **Parameters:** `inst` (entity) - the entity to register as a boss.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `inst` is `nil` or already registered as a boss.

### `UnregisterBoss(inst)`
*   **Description:** Unregisters a boss entity, removing the `boss` tag and decrementing the boss count. Called automatically when a registered boss dies.
*   **Parameters:** `inst` (entity) - the boss entity to unregister.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `inst` is `nil` or not registered.

### `GetNumBosses()`
*   **Description:** Returns the current number of active boss entities in the world.
*   **Parameters:** None.
*   **Returns:** `number` — the count of active bosses.

### `HasActiveBosses()`
*   **Description:** Checks whether at least one boss is currently active.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if any boss is active, otherwise `false`.

### `GetBossList()`
*   **Description:** Returns a shallow copy of the list of registered boss entities.
*   **Parameters:** None.
*   **Returns:** `table` — an array of entity instances currently registered as bosses.

## Events & listeners
- **Listens to:** `eventrespawn` — calls `UnregisterBoss` when a boss respawns (to handle cleanup before re-registration); `onremove` — unregisters a boss when its entity is removed from the world.
- **Pushes:** `boss_count_changed` — fired whenever the number of active bosses changes, with `data.count = new_count`.
