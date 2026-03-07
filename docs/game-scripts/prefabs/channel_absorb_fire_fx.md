---
id: channel_absorb_fire_fx
title: Channel Absorb Fire Fx
description: Creates an animated visual effect used during channeling absorption events, playing different sub-animations depending on the fire state.
tags: [fx, visual, entity]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 90296e18
system_scope: fx
---

# Channel Absorb Fire Fx

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`channel_absorb_fire_fx` is a lightweight entity used to display an animated visual effect during channeling absorption actions. It supports multiple animation states — pre-loop, loop, and post-loop — and provides helper prefabs for fire, smoulder, and embers variants. The component is self-contained, with no external component dependencies or event passing beyond its own lifecycle.

## Usage example
```lua
-- Spawns the base fire effect at position (x, y, z)
local fx = SpawnPrefab("channel_absorb_fire_fx")
fx.Transform:SetPosition(x, y, z)

-- To trigger the post-loop animation and remove the entity after it completes:
if fx.KillFX then
    fx:KillFX()
end
```

## Dependencies & tags
**Components used:** `animstate`, `transform`, `follower`, `network`  
**Tags:** Adds `FX`, `NOCLICK`.

## Properties
No public properties.

## Main functions
### `KillFX()`
*   **Description:** Plays the `channel_pst` animation and schedules the entity for removal when the animation ends. Prevents duplicate calls via `inst.killed` flag.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No-op if `inst.killed` is already `true`.

## Events & listeners
- **Listens to:** `animover` — to remove the entity once the animation completes (both in `KillFX()` and `CommonFX()` variants).
- **Pushes:** None.