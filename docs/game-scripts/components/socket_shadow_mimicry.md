---
id: socket_shadow_mimicry
title: Socket Shadow Mimicry
description: Manages shadow mimic spawner entities for specific prefab configurations.
tags: [wx78, shadow, spawner]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: 070e38cd
system_scope: entity
---

# Socket Shadow Mimicry

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Socket_Shadow_Mimicry` is a specialized component that spawns and manages a shadow mimic spawner entity for WX-78 backup body prefabs. It attaches the spawner as a child entity and handles cleanup when the component is removed from its parent. This component is prefab-specific and only activates for `wx78_backupbody` entities.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("socket_shadow_mimicry")
-- Component automatically spawns wx78_mimicspawner if inst.prefab == "wx78_backupbody"
-- Cleanup happens automatically OnRemoveFromEntity
```

## Dependencies & tags
**External dependencies:**
- `SpawnPrefab` -- spawns the mimic spawner entity for wx78_backupbody

**Components used:**
- None identified

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The owning entity instance. Standard component property. |
| `spawner` | entity | `nil` | Reference to the spawned `wx78_mimicspawner` entity. Only set for `wx78_backupbody` prefab. |

## Main functions
### `OnRemoveFromEntity()`
*   **Description:** Lifecycle cleanup method called when the component is removed from its entity. Removes the spawner entity if it exists to prevent orphaned entities.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None. Guards against nil spawner with `if self.spawner then` check.

## Events & listeners
- **Listens to:** None identified
- **Pushes:** None identified