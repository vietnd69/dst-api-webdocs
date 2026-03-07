---
id: firepit_firebird_puff_fx
title: Firepit Firebird Puff Fx
description: Spawns a non-networked, temporary visual effect (puff animation) on a firepit when a Firebird interacts with it.
tags: [fx, firebird, visual]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 025c427d
system_scope: fx
---

# Firepit Firebird Puff Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`firepit_firebird_puff_fx` is a local-only visual effect prefab that triggers a puff animation when a Firebird interacts with a firepit. It does not persist, does not run on dedicated servers, and is only instantiated on the client side. The effect is parented to the firepit and uses a dynamic animation bank with frame-level synchronization via `proxy` data.

## Usage example
This prefab is instantiated automatically by the game when a Firebird uses a firepit; modders do not typically spawn it manually. For reference, here is how it might be triggered in a custom context:
```lua
local fx = Prefab("firepit_firebird_puff_fx")
    :Spawn()
fx.level:set(2)  -- 1 = small puff, 2 = medium, 3 = large
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `FX` to the spawned puff entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `level` | `net_tinybyte` | `2` | Controls which puff animation variant is played (`1`, `2`, or `3`). |

## Main functions
### `PlayPuffAnim(proxy)`
*   **Description:** Spawns a client-only FX entity, parents it to the firepit, and plays a puff animation using data from the `proxy`. Automatically removes itself after animation completes.
*   **Parameters:** `proxy` (proxy object) – contains GUID and level information needed to position and configure the FX entity.
*   **Returns:** Nothing.
*   **Error states:** Returns early with no effect if `proxy.entity:GetParent()` is `nil`.

## Events & listeners
- **Listens to:** `animover` – triggers `inst.Remove` on animation completion to clean up the FX entity.
- **Pushes:** None identified.