---
id: replayproxy
title: Replayproxy
description: Stores and provides access to the GUID and prefab name of a real entity during replay playback.
tags: [network, replay, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 44b469f0
system_scope: network
---

# Replayproxy

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ReplayProxy` is a lightweight component that acts as a proxy container for identifying the original entity during replay playback. It stores the unique GUID and prefab name of the real entity being replayed, allowing systems to reference the source entity without requiring direct network synchronization.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("replayproxy")
inst.components.replayproxy:SetRealEntityGUID(12345)
inst.components.replayproxy:SetRealEntityPrefabName("wavingtree")
local guid = inst.components.replayproxy:GetRealEntityGUID()
local display_name = inst.components.replayproxy:GetRealEntityPrefabName()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `real_entity_guid` | number or `nil` | `nil` | The unique identifier of the real entity being replayed. |
| `real_entity_prefab_name` | string | `""` | The prefab name of the real entity. |

## Main functions
### `SetRealEntityGUID(guid)`
*   **Description:** Sets the GUID of the real entity this proxy represents.
*   **Parameters:** `guid` (number or `nil`) — the unique identifier of the real entity.
*   **Returns:** Nothing.

### `GetRealEntityGUID()`
*   **Description:** Returns the stored GUID of the real entity.
*   **Parameters:** None.
*   **Returns:** `number` or `nil` — the GUID previously set via `SetRealEntityGUID`.

### `SetRealEntityPrefabName(name)`
*   **Description:** Sets the prefab name of the real entity.
*   **Parameters:** `name` (string) — the prefab name of the real entity.
*   **Returns:** Nothing.

### `GetRealEntityPrefabName()`
*   **Description:** Returns a formatted string combining the GUID and prefab name.
*   **Parameters:** None.
*   **Returns:** `string` — formatted as "`guid` - `prefab`", e.g., `"12345 - wavingtree"`.

## Events & listeners
None identified
