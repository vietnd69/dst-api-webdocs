---
id: firehits
title: Firehits
description: Spawns a local visual effect entity that plays a randomized animation synchronized to a proxy entity's position and orientation.
tags: [fx, visual, server_sync]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d1a2b8c1
system_scope: fx
---

# Firehits

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`firehits` is a lightweight visual FX prefab responsible for playing one of several lava arena-style hit animations. It is instantiated only on the client (not on dedicated servers) and attaches to a proxy entity to inherit its transform. It uses networked metadata (`variation`) to select an animation variant and scaling direction. This prefab does not persist or participate in game logic—it exists solely for rendering.

## Usage example
This prefab is typically spawned internally by game systems (e.g., lava arena events), but a typical usage pattern is:

```lua
-- Assume proxy is a valid entity with transform and networked `variation` property
local hit = SpawnPrefab("firehit")
hit.variation:Set(5) -- Selects animation variant based on value
hit.Transform:SetPosition(proxy.Transform:GetWorldPosition())
-- Animation plays automatically once spawned and removed on animover
```

## Dependencies & tags
**Components used:** None (no external component methods called).  
**Tags:** Adds `FX` to spawned effect entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `variation` | `net_tinybyte` | `0` | Networked byte (0–255) used to select animation variant and optional horizontal flip. Value integer division by 2 determines the animation number (`hit_N`), while odd/even determines scale direction (`x = -1` if odd). |

## Main functions
### `PlayFXAnim(proxy)`
*   **Description:** Internal helper function that creates a non-persistent FX entity, attaches anim state, and plays a randomly selected hit animation. Automatically removes itself when animation completes.
*   **Parameters:** `proxy` (entity) — the source entity whose transform and `variation` value are used to configure the effect.
*   **Returns:** Nothing.
*   **Error states:** None; fails silently if `proxy` is invalid (but caller must ensure validity).

## Events & listeners
- **Listens to:** `animover` — triggers `inst.Remove` to dispose the effect entity after animation finishes.
- **Pushes:** None.