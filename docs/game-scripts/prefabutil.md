---
id: prefabutil
title: Prefabutil
description: Helper utilities for constructingplacer prefabs and deployable item prefabs in DST.
tags: [prefab, utility, placement]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: e385e41d
system_scope: world
---

# Prefabutil

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`prefabutil` provides helper functions (`MakePlacer` and `MakeDeployableKitItem`) to create standardized prefabs for in-world placement helpers (e.g., preview ghosts) and deployable item prefabs (e.g., blueprints for structures). These utilities set up common components, animations, tags, and configuration flags required for placement and deployment workflows in the game’s ECS architecture.

Key relationships include usage of the `placer`, `deployable`, `inventoryitem`, `stackable`, and `fuel` components.

## Usage example
```lua
-- Create a standard ghost/placer for a wall structure
return MakePlacer(
    "wall_ghost",
    "wall",
    "wall",
    "idle",
    false,
    true,   -- snap to grid
    true,   -- snap to meters
    1,      -- scale
    nil,    -- fixed camera offset
    "four", -- facing
    nil,    -- postinit
    nil,    -- offset
    nil     -- onfailedplacement
)

-- Create a deployable blueprint item
return MakeDeployableKitItem(
    "wall_blueprint",
    "wall",
    "wall",
    "wall",
    "idle",
    assets,
    { size = 0.5, y_offset = 0.25, scale = 0.9 },
    { "INVENTORABLE", "BLUEPRINT" },
    { fuelvalue = 2 }, -- makes it burnable
    {
        deploymode = "grid",
        deployspacing = 1.0,
        usegridplacer = true,
    },
    TUNING.STACK_SIZE_SMALLITEM
)
```

## Dependencies & tags
**Components used:** `placer`, `deployable`, `inventoryitem`, `stackable`, `fuel`, `inspectable`, `transform`, `animstate`, `network`, `floatable` (via `MakeInventoryFloatable`), `burnable`/`propagator` (via `MakeSmallBurnable`/`MakeSmallPropagator`), `hauntable` (via `MakeHauntableLaunch`).
**Tags:** `CLASSIFIED`, `NOCLICK`, `placer` (added to placer prefabs); `deploykititem`, plus any provided via `tags` (for deployable kits).

## Properties
No public properties — this module exposes only factory functions.

## Main functions
### `MakePlacer(name, bank, build, anim, onground, snap, metersnap, scale, fixedcameraoffset, facing, postinit_fn, offset, onfailedplacement)`
*   **Description:** Creates a non-persistent, preview/entity ghost prefab for placement. Sets up transform, animstate, orientation, and attaches the `placer` component with configurable snapping, orientation, and offset behavior.
*   **Parameters:**
    *   `name` (string) — prefab name used for registration.
    *   `bank` (string) — animation bank.
    *   `build` (string) — animation build (defaults to `bank` if `anim` is nil).
    *   `anim` (string?) — animation to play; if nil, no animation is set.
    *   `onground` (boolean) — if true, sets `ANIM_ORIENTATION.OnGround`.
    *   `snap` (boolean) — whether grid snapping is enabled (`placer.snaptogrid`).
    *   `metersnap` (boolean) — whether meter snapping is enabled (`placer.snap_to_meters`).
    *   `scale` (number?) — uniform scale multiplier; skips if `nil` or `1`.
    *   `fixedcameraoffset` (any?) — stored in `placer.fixedcameraoffset`.
    *   `facing` (string?) — valid values: `"two"`, `"four"`, `"six"`, `"eight"`. Controls facing modes via `Transform` methods.
    *   `postinit_fn` (function?) — optional post-initialization callback for custom setup.
    *   `offset` (number?) — if provided, overrides `placer.offset`.
    *   `onfailedplacement` (function?) — callback invoked on invalid placement (stored in `placer.onfailedplacement`).
*   **Returns:** `Prefab` — a prefab definition callable with optional `assets` later during registration.
*   **Error states:** None documented.

### `MakeDeployableKitItem(name, prefab_to_deploy, bank, build, anim, assets, floatable_data, tags, burnable, deployable_data, stack_size, PostMasterSimfn)`
*   **Description:** Creates a deployable item (e.g., blueprint) prefab that can be used to spawn a structure on deployment. Handles inventory, physics, buoyancy, fuel, stackability, deployment behavior, and network synchronization.
*   **Parameters:**
    *   `name` (string) — prefab name.
    *   `prefab_to_deploy` (string) — name of the structure prefab this item spawns.
    *   `bank` (string) — animation bank.
    *   `build` (string?) — animation build; defaults to `bank`.
    *   `anim` (string?) — animation name; defaults to `"idle"`.
    *   `assets` (table?) — asset list for registration.
    *   `floatable_data` (table?) — table with `size`, `y_offset`, `scale`; passed to `MakeInventoryFloatable` if provided.
    *   `tags` (table?) — list of string tags added via `inst:AddTag`.
    *   `burnable` (table?) — if truthy, enables `fuel` component; expects `.fuelvalue` for fuel strength.
    *   `deployable_data` (table?) — optional configuration for the `deployable` component:
        *   `.custom_candeploy_fn` — custom deployment check function.
        *   `.usedeployspacingasoffset` — adds `"usedeployspacingasoffset"` tag.
        *   `.common_postinit` — generic postinit callback.
        *   `.deploymode` — deployment mode (e.g., `"grid"`).
        *   `.deployspacing` — deployment grid spacing.
        *   `.restrictedtag` — tag restriction for placement.
        *   `.usegridplacer` — use grid-based placement logic.
        *   `.deploytoss_symbol_override` — override symbol for toss animation.
        *   `.master_postinit` — master-side postinit callback.
        *   `.OnSave`, `.OnLoad` — save/load hooks.
    *   `stack_size` (number?) — max stack size; if provided, adds `stackable` component and sets `maxsize`.
    *   `PostMasterSimfn` (function?) — master-only postinit callback.
*   **Returns:** `Prefab` — a prefab definition with the same deployment logic attached.
*   **Error states:** Returns a non-persisting entity on clients (`TheWorld.ismastersim` is false); no explicit error conditions.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None directly; however, via the `deployable` component, it triggers the `onbuilt` event on the deployed structure with `{ builder = deployer, pos = pt, rot = rot, deployable = inst }`.