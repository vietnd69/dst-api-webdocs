---
id: moonstormlightningmanager
title: Moonstormlightningmanager
description: Manages periodic ground lightning spawns during moonstorms based on player proximity and network node data.
tags: [environment, weather, fx]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 4f9676b2
system_scope: environment
---

# Moonstormlightningmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MoonstormLightningManager` is a component that generates visual lightning effects on the ground during moonstorms. It operates by periodically evaluating player position and lighting strike points within a camera-relative radius where valid ground and moonstorm nodes exist. It relies on the `moonstorms` component's `_moonstorm_nodes` data and dynamically adjusts spawn frequency based on camera distance.

This component is attached to an entity (typically the world or a controller entity) and updates per-frame while active, spawning fx prefabs (`moonstorm_ground_lightning_fx`) at appropriate locations.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("moonstormlightningmanager")
-- The component starts automatically when moonstorms are active (via event listener).
-- No manual activation is required; it responds to "moonstorm_nodes_dirty_relay".
```

## Dependencies & tags
**Components used:** `moonstorms` (via `TheWorld.net.components.moonstorms`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spark.per_sec` | number | `5` | Base rate of lightning attempts per second. |
| `spark.spawn_rate` | number | `0` | Accumulated spawn counter; triggers spawn when `>= 1.0`. |
| `spark.checkfn` | function | `checkground` | Function used to validate if lightning can spawn at a point. |
| `spark.spawnfn` | function | `SpawnLightning` | Function called to spawn the lightning fx. |
| `sparks_per_sec` | number | `1` | Multiplier base (unused in current implementation). |
| `sparks_idle_time` | number | `5` | Unused in current implementation. |
| `sparks_per_sec_mod` | number | `1.0` | Modifiable multiplier for effective spawn rate; can be zeroed to stop spawning. |

## Main functions
### `OnUpdate(dt)`
* **Description:** Called each frame while the component is updating. Handles time-accumulated lightning spawn logic based on camera distance and moonstorm node presence.
* **Parameters:** `dt` (number) – Delta time in seconds since the last frame.
* **Returns:** Nothing.
* **Error states:** Exits early if `ThePlayer` or `TheWorld.Map` is `nil`. Stops updating if `sparks_per_sec_mod <= 0.0`.

## Events & listeners
- **Listens to:** `moonstorm_nodes_dirty_relay` – When received, toggles component update state based on whether moonstorm nodes exist (`_moonstorm_nodes:value()`). Starts updating when nodes are present, stops otherwise. Registered on `TheWorld`.
- **Pushes:** None.
