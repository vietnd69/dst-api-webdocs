---
id: mossling_spin_fx
title: Mossling Spin Fx
description: Creates a visual and audio effect for the mossling's spin attack animation, playing a looping animation and periodic electric sound.
tags: [fx, audio, visual]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c1ed41de
system_scope: fx
---

# Mossling Spin Fx

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`mossling_spin_fx` is a prefabricated entity used to render a visual and audio effect during the mossling's spin attack. It uses an animation bank (`mossling_spin_fx`), plays a looping spin animation, emits sound at fixed intervals, and automatically removes itself when the animation completes. The entity is non-persistent and only runs logic on the master simulation.

## Usage example
```lua
local inst = SpawnPrefab("mossling_spin_fx")
if inst then
    inst.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `FX`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `soundcount` | number | `0` | Tracks how many times the sound has played (limit: 2). |
| `task` | Task | `nil` | Scheduled task for periodic sound playback. |

## Main functions
No main public functions beyond the constructor.

## Events & listeners
- **Listens to:** `animover` — triggers removal of the entity (via `inst.Remove`).
- **Pushes:** None.