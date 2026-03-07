---
id: saddle_shadow_footprints
title: Saddle Shadow Footprints
description: Manages a set of four animated shadow footprints with fading opacity and randomized appearance for visual effects.
tags: [fx, animation, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ef67b7c9
system_scope: fx
---

# Saddle Shadow Footprints

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`Saddle Shadow Footprints` is a prefab-based FX system that creates a reusable pool of animated shadow footprints. Each instance manages four footprints with dynamic opacity (fade-out), randomized offset variants, and art variants. It uses the `updatelooper` component to drive per-frame opacity updates during playback and integrates with the owner's footprint pool for recycling.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("saddle_shadow_footprint")

-- Attach to an owner entity and assign owner reference
inst:SetFXOwner(some_owner_entity)

-- Start the FX animation
inst:RestartFX()

-- Clean up when done (triggers reuse or removal)
inst:RemoveFromScene()
```

## Dependencies & tags
**Components used:** `updatelooper`  
**Tags:** Adds `FX`, `NOCLICK`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity or `nil` | `nil` | Owner entity; used to access its `footprint_pool` for recycling this instance. |
| `current_offsets` | table (array) | `{}` | Stores the offset variant index for each of the 4 footprints. |

## Main functions
### `SetFXOwner(owner)`
*   **Description:** Assigns the owner entity for this footprint instance, enabling reuse via the owner's footprint pool on animation completion.
*   **Parameters:** `owner` (entity or `nil`) — the entity that manages this footprint's lifecycle and pool.
*   **Returns:** Nothing.

### `RestartFX()`
*   **Description:** Resets and restarts the footprint animation: plays the "ground" animation, re-enables update loop, reveals the scene node, and configures all four footprints with randomized offset and art variants.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnAnimOver()`
*   **Description:** Cleanup callback invoked when the animation completes. Recycles the instance into the owner's footprint pool (if available) or destroys it.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — triggers `OnAnimOver` when the animation finishes.
- **Pushes:** None.