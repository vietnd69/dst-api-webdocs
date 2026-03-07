---
id: bearger_fx
title: Bearger Fx
description: Creates and configures reusable visual FX prefabs for Bearger and Mutated Bearger swipe attacks.
tags: [fx, animation, visual, boss]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7fd3a8dc
system_scope: fx
---

# Bearger Fx

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`bearger_fx.lua` is a prefab factory script that generates two distinct FX prefabs (`bearger_swipe_fx` and `mutatedbearger_swipe_fx`) used to visually represent swipe attacks by Bearger and Mutated Bearger respectively. It configures the entity's animation bank, orientation, layering, lighting, and tag properties, and sets up automatic removal upon animation completion. This component is not a gameplay component itself, but rather a helper for spawning FX entities.

## Usage example
```lua
local bearger_swipe = Prefab("bearger_swipe_fx", "prefabs/bearger_fx")
local fx = TheWorld:SpawnPrefab("bearger_swipe_fx")
if fx ~= nil then
    fx.Transform:SetPos(x, y, z)
    -- Optional: trigger custom reverse animation
    if fx.Reverse then
        fx.Reverse(fx)
    end
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX` and `NOCLICK`; checks `TheWorld.ismastersim` to determine server authority.

## Properties
No public properties

## Main functions
### `Reverse(inst)`
*   **Description:** Plays the `atk2` animation on the provided FX entity (used for reversed swipe effect).
*   **Parameters:** `inst` (Entity) – The FX entity instance to animate.
*   **Returns:** Nothing.

### `MakeFX(name, saturation, lightoverride)`
*   **Description:** Returns a Prefab function that constructs an FX entity with specified visual settings (saturation and light override). It sets up the entity with animation, transform, and network capabilities, registers event listeners for cleanup, and optionally adds the `Reverse` method on the master simulation.
*   **Parameters:**
    *   `name` (string) – Name of the prefab to create (e.g., `"bearger_swipe_fx"`).
    *   `saturation` (number) – Saturation multiplier for the animation.
    *   `lightoverride` (number) – Light intensity override value (0 = default).
*   **Returns:** Prefab – A function suitable for use as a Prefab constructor.
*   **Error states:** Returns early on non-master simulations with no further setup; `Reverse` method is only added on the master.

## Events & listeners
- **Listens to:** `animover` – automatically calls `inst.Remove()` on the FX entity when the animation completes.
- **Pushes:** None.