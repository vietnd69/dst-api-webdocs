---
id: cave_exit
title: Cave Exit
description: Manages the visual and logical state of the cave exit portal, synchronizing its animation and status with world migration events.
tags: [world, portal, migration]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 16967887
system_scope: world
---

# Cave Exit

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `cave_exit` prefab represents the portal used to migrate from the Caves to the Surface (or vice versa in some contexts). It is an entity with no custom component logic — instead, it delegates state management to the `worldmigrator` component and exposes its status via the `inspectable` component. Its primary responsibility is to reflect the current migration state (`OPEN`, `FULL`, or `CLOSED`) through visual animations, while responding to migration-related events.

## Usage example
```lua
local cave_exit = SpawnPrefab("cave_exit")
cave_exit.Transform:SetPosition(x, y, z)
cave_exit:AddTag("STRUCTURE")
cave_exit:AddTag("MIGRATION_PORTAL")
```

## Dependencies & tags
**Components used:** `worldmigrator`, `inspectable`
**Tags:** Conditionally adds `NOCLICK` and `CLASSIFIED` on non-sharded servers; `STRUCTURE` and `MIGRATION_PORTAL` typically added externally.

## Properties
No public properties defined on the prefab itself. The `worldmigrator` component exposes `shard_name` (set to `"Master"`), and `inspectable.getstatus` is assigned a function reference.

## Main functions
### `GetStatus(inst)`
*   **Description:** Returns the current migration status string (`"OPEN"`, `"FULL"`, or `nil`) based on the state of the attached `worldmigrator` component.
*   **Parameters:** `inst` (Entity) — the cave exit entity instance.
*   **Returns:** `"OPEN"` if `worldmigrator:IsActive()`, `"FULL"` if `worldmigrator:IsFull()`, otherwise `nil`.
*   **Error states:** Returns `nil` if neither migration active nor full.

## Events & listeners
- **Listens to:** `migration_available` — triggers the `open` function (plays `"open"` animation).
- **Listens to:** `migration_unavailable` — triggers the `close` function (plays `"no_access"` animation).
- **Listens to:** `migration_full` — triggers the `full` function (plays `"over_capacity"` animation).
- **Listens to:** `migration_activate` — triggers the `activate` function (no-op).
- **Pushes:** None.

## Implementation Notes
- The prefab is only fully simulated on the master (server) instance. On non-mastersim clients, physics and minimap are disabled, and the entity is scaled to zero — effectively hiding it unless migration shards are enabled.
- The `scrapbook_speechstatus` and `scrapbook_anim` fields are initialized for potential use in the Scrapbook UI, reflecting `"OPEN"` and `"open"` respectively.
- Visual state is handled entirely via `AnimState` with animations `"open"`, `"no_access"`, and `"over_capacity"`.