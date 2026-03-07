---
id: entityproxy
title: Entityproxy
description: A lightweight prefab used as a network proxy for replay functionality, containing only essential transform and animation states without persistence.
tags: [network, replay, prefab]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5aae405f
system_scope: network
---

# Entityproxy

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`Entityproxy` is a minimal prefab intended for use in replay recordings. It provides the minimal entity structure needed to simulate a visible, animated entity in replays — specifically, it holds transform data and animation state but does not persist to world save data or possess gameplay logic. It is primarily used as a container for non-functional visual representation during replay playback.

## Usage example
```lua
-- Typically instantiated internally by the replay system, not directly by mods
local proxy = SpawnPrefab("entityproxy")
proxy.Transform:SetPosition(x, y, z)
proxy.AnimState:SetAnimation("idle")
```

## Dependencies & tags
**Components used:** `replayproxy`
**Tags:** Adds `entityproxy`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `persists` | boolean | `false` | Indicates whether this entity is saved to world data. Set explicitly to `false` for proxy use. |

## Main functions
Not applicable.

## Events & listeners
None identified.