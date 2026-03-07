---
id: groundpoundringfx
title: Groundpoundringfx
description: Creates a non-networked visual effect entity that plays an animation at the position of a proxy entity, typically used for ground pound冲击 effects in Don't Starve Together.
tags: [fx, visual, boss, groundpound]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f8afa883
system_scope: fx
---

# Groundpoundringfx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`groundpoundringfx` is a Prefab that spawns a temporary, non-persistent visual effect. It uses an `FX`-tagged entity to render a ring animation (`bearger_ring_fx`) aligned with a proxy entity's position. The effect is only spawned on non-dedicated clients, and runs for a fixed duration of 3 seconds before removal. It supports fast-forward mode for time-compressed playback.

## Usage example
```lua
-- Example: spawn the ground pound ring effect at a target position or entity
local fx = SpawnPrefab("groundpoundring_fx")
if fx ~= nil then
    -- Set proxy GUID if needed; typically set by the parent prefab via Transform:SetFromProxy
    fx.FastForward() -- Optional: skip animation to frame 5
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX` to spawned effect entities; checks `fastforward` state on proxy via `_fastforward:value()`.

## Properties
No public properties

## Main functions
### `PlayRingAnim(proxy)`
*   **Description:** Creates and configures a local visual entity to render the ring animation at the proxy's position. It sets animation bank, build, orientation, layer, and sort order. Listens for `animover` to self-remove and optionally fast-forwards based on proxy state.
*   **Parameters:** `proxy` (entity) — entity whose position/orientation is used as the anchor for the effect.
*   **Returns:** Nothing.
*   **Error states:** Does not error; silently skips if proxy is `nil`.

### `FastForward(inst)`
*   **Description:** Sets the `_fastforward` networked boolean flag to `true`, signaling that the animation should be fast-forwarded to frame 5.
*   **Parameters:** `inst` (entity) — the groundpoundringfx instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — triggers `inst.Remove` to delete the animation entity when the animation completes.
- **Pushes:** None.