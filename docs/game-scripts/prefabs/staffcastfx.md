---
id: staffcastfx
title: Staffcastfx
description: Creates temporary visual FX entities for spellcasting animations using staff, coin toss, and pocketwatch animations.
tags: [fx, animation, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9854a619
system_scope: fx
---

# Staffcastfx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`staffcastfx` is a utility prefab factory function that generates short-lived visual FX entities for character spellcasting actions. It is used to instantiate animated FX projectiles or effects (e.g., staff beams, coin toss sparks, pocketwatch warp glows) that attach transiently to spellcasters. The component is implemented as a set of `Prefab` constructors returned at module load, each configured for a specific animation sequence and playback context (e.g., mounted vs. on-foot). These FX entities are non-persistent, tagged as `"FX"`, and automatically removed upon animation completion.

## Usage example
```lua
-- Instantiate a basic staff FX effect (on-foot)
local fx = Prefab("staffcastfx")()
fx.Transform:SetPosition(x, y, z)

-- Instantiate a mounted coin toss FX effect
local mount_fx = Prefab("cointosscastfx_mount")()
mount_fx.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `"FX"` to created entities.

## Properties
No public properties

## Main functions
### `MakeStaffFX(anim, build, bank, ismount)`
*   **Description:** Factory function that returns a closure for creating FX entities with specified animation parameters. Used internally to define the full suite of FX prefabs.
*   **Parameters:**
    *   `anim` (string) – Animation name to play (e.g., `"staff"`, `"cointoss"`).
    *   `build` (string or `nil`) – Animation build name; defaults to `"staff"` if `nil`.
    *   `bank` (string or `nil`) – Animation bank name; defaults to `"staff_fx"` if `nil`.
    *   `ismount` (boolean) – If `true`, entity is six-faced; otherwise four-faced.
*   **Returns:** A function that, when invoked, constructs and returns a new FX entity.
*   **Error states:** Returns the entity immediately on non-master sim without full initialization (client-side optimization).

### `SetUp(inst, colour)`
*   **Description:** Helper to set the tint colour of the FX entity using a 3-element colour table.
*   **Parameters:**
    *   `inst` (Entity) – The FX entity instance.
    *   `colour` (table of numbers) – RGB colour values (each in `[0,1]` range).
*   **Returns:** Nothing.
*   **Error states:** None; silently applies multcolour if `AnimState` is present.

## Events & listeners
- **Listens to:** `animover` – Removes the entity when the animation completes.
- **Pushes:** None.