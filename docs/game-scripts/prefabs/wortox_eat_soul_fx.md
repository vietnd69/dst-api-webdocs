---
id: wortox_eat_soul_fx
title: Wortox Eat Soul Fx
description: A transient visual effect prefab that plays an eating animation when Wortox consumes a soul.
tags: [fx, visual, wortox, decay]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5d26c393
system_scope: fx
---

# Wortox Eat Soul Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wortox_eat_soul_fx` is a visual effect (FX) prefab used exclusively to render the "eating soul" animation when Wortox consumes a soul. It is a temporary, non-interactive entity that plays a single animation sequence and then destroys itself. It does not persist, support gameplay logic, or interact with other components beyond basic animation lifecycle management.

## Usage example
This prefab is typically instantiated programmatically by Wortox's soul-eating logic. Manual usage is unnecessary for modders.

```lua
-- Not intended for direct instantiation by modders
-- Automatically spawned by Wortox when consuming a soul
local fx = SpawnPrefab("wortox_eat_soul_fx")
if fx ~= nil and fx.MakeMounted then
    fx.MakeMounted(fx)
end
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Adds `DECOR` and `NOCLICK`; removes `NOCLICK` and `DECOR` implicitly via removal.

## Properties
No public properties.

## Main functions
### `MakeMounted(inst)`
*   **Description:** Configures the FX instance for mounted (rotated) playback by setting six-faced orientation and playing the `mounted_eat` animation instead of the default `eat` animation. Used when the effect must align with a mounted entity (e.g., when Wortox is riding a beefalo).
*   **Parameters:** `inst` (Entity) — the FX entity instance on which to apply the modification.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — triggers `inst.Remove` to destroy the entity after the animation completes.
- **Pushes:** None.