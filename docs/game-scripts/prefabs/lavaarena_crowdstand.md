---
id: lavaarena_crowdstand
title: Lavaarena Crowdstand
description: Provides client-side visual decoration for the Lava Arena spectator stands, including banners, fences, and audience members.
tags: [decor, fx, client, arena, network]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3d833348
system_scope: fx
---

# Lavaarena Crowdstand

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lavaarena_crowdstand` is a prefab that creates client-side visual decorations for the Lava Arena spectator stands. It does not represent a functional entity with gameplay logic but instead contributes purely cosmetic elements (e.g., banners, decorative fences, and audience members) to enhance the arena environment. The component is instantiated via its standalone prefabs and relies on network synchronization for position/orientation, with all scene-graph elements parented to the main stand entity.

Key behaviors:
- `lavaarena_crowdstand`: Main stand entity; triggers client-side decoration generation (`populate_stand_client`) after a 0-tick delay.
- `lavaarena_teambanner`: Dedicated banner decoration.
- `lavaarena_spectator`: Animated spectator entity.
- `lavaarena_groundtargetblocker`: Non-simulating blocker for ground targeting (e.g., prevents player movement or placement inside the stand).

The client-side logic in `populate_stand_client` uses the `lavaarenaevent` component to orient the stand toward the arena center.

## Usage example
This component is not added directly to entities via `AddComponent`. Instead, its prefabs are instantiated during Lava Arena world generation or event setup, and the game internally handles their lifecycle. A typical usage pattern is handled server-side in worldgen tasks and event scripts, such as:

```lua
-- Server-side setup (not part of this file)
local stand = SpawnPrefab("lavaarena_crowdstand")
stand.Transform:SetPosition(x, y, z)
stand.stand_width:set(2)
stand.stand_height:set(3)

-- The client will automatically generate decorations for this stand
```

## Dependencies & tags
**Components used:** `lavaarenaevent` (via `GetArenaCenterPoint`), `net_tinybyte`, `event_server_data`.
**Tags:** Adds `CLASSIFIED`, `NOCLICK`, `DECOR`, `FX`, depending on the prefab variant.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stand_width` | `net_tinybyte` | `1` | Networked width parameter (grid units); controls horizontal fence/banner count. |
| `stand_height` | `net_tinybyte` | `1` | Networked height parameter (grid units); controls vertical fence/banner count. |

## Main functions
None. This is a prefab definition file, not a component script with methods. All logic is encapsulated in local functions (`stand_fn`, `teambanner_fn`, etc.) that construct prefabs.

## Events & listeners
None identified.

