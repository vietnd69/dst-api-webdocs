---
id: slingshotaoefx
title: Slingshotaoefx
description: Creates and manages visual effects for slingshot attacks, including target rings, color-coded AOE indicators, and power-up animations.
tags: [fx, combat, visual, slingshot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 95eeeb11
system_scope: fx
---

# Slingshotaoefx

> Based on game build **7140014** | Last updated: 2026-03-07

## Overview
This file defines three prefabs used exclusively for visual feedback during slingshot usage: `slingshot_aoe_fx`, `slingshot_powerup_fx`, and `slingshot_powerup_mounted_fx`. These prefabs render dynamic visual effects such as expanding target rings, colorized aura indicators (for slingshot shot types like Ice, Shadow, Lunar), and power-up animations preceding a slingshot projectile launch. The AOE effect uses the `updatelooper` component for per-frame alpha/colour animation and is parented to the slingshot entity to follow its position. Effects are server-aware (not spawned on dedicated servers) and are non-persistent (`persists = false`).

## Usage example
This file is not intended for runtime component instantiation; it returns prefabs for use in `Prefabs` definitions. A typical usage inside a slingshot action or projectile launch would be:
```lua
local aoe = Prefab("slingshot_aoe_fx")()
aoe.Transform:SetPosition(x, y, z)
aoe:SetColorType("lunar") -- Set to any COLOR_NAMES entry
```

## Dependencies & tags
**Components used:** `updatelooper` (via `inst.components.updatelooper:AddOnUpdateFn`)
**Tags:** Adds `FX`, `NOCLICK` to all effect entities. No per-component behavior beyond standard ECS and network tags.

## Properties
No public properties are defined on the returned prefab instances. All relevant state (`color`, `alpha`, `delta`, `disc`) is encapsulated in local closures and internal structures.

## Main functions
### `SetColorType(inst, colorname)`
*   **Description:** Updates the visual color, bloom, and light override of the AOE effect based on a named color (e.g., `"ice"`, `"lunar"`). Also updates the nested disc effect if present.
*   **Parameters:**  
    `inst` (entity) – the slingshot AOE FX instance.  
    `colorname` (string) – one of `"ice"`, `"slow"`, `"shadow"`, `"horror"`, `"lunar"`; falls back to white if unknown.
*   **Returns:** Nothing.
*   **Error states:** None; invalid `colorname` results in default white coloring.

### `aoefn()`
*   **Description:** Constructor function for the `slingshot_aoe_fx` prefab. Creates a non-persistent FX entity with an animating target ring (`target_fx_ring`), sets up networked color replication, and instantiates the nested disc effect on non-dedicated clients.
*   **Parameters:** None (used as a Prefab factory function).
*   **Returns:** An initialized entity with `colordirty` network variable and a local `disc` child (non-dedicated only).
*   **Error states:** Dedicated servers skip disc creation and do not run client-side animation logic.

### `MakePowerup(name, mounted, assets)`
*   **Description:** Factory function that generates either the standard or mounted slingshot power-up FX prefab. Includes a back-layer animation child (created via `powerup_CreateBack`) to create a layered animation.
*   **Parameters:**  
    `name` (string) – prefab name (e.g., `"slingshot_powerup_fx"`).  
    `mounted` (boolean) – controls animation bank (`"wilsonbeefalo"` if true).  
    `assets` (table) – anim assets table to register with the Prefab.
*   **Returns:** A `Prefab` definition function that returns a non-persistent FX entity.

## Events & listeners
- **Listens to:**  
  - `colordirty` (on non-master simulations) – triggers `OnColorDirty(inst)` to refresh disc visuals.  
  - `animover` (on master simulation) – calls `inst.Remove()` to destroy the effect after its animation completes.
- **Pushes:** None.

