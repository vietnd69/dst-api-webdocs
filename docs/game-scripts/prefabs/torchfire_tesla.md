---
id: torchfire_tesla
title: Torchfire Tesla
description: Creates a tesla-themed torch fire entity with custom animations, skins, and sound overrides using the shared torchfire system.
tags: [fx, lighting, skinning]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 50d1b5a4
system_scope: fx
---

# Torchfire Tesla

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`torchfire_tesla` is a prefab definition that instantiates a specialized Tesla-themed torch fire effect for use in the game world. It leverages the shared `MakeTorchFire` utility from `torchfire_common.lua` to create a dynamic, animated fire entity with custom visual and audio properties. The prefab adds Tesla-specific visual elements via animation bank overrides and skin symbol substitutions, and applies a unique sound effect loop.

## Usage example
This prefab is typically instantiated via the game's prefab system. A modder would reference it by name when defining an entity that requires a Tesla-style torch fire:

```lua
local inst = Prefab("torchfire_tesla")
-- The prefab is registered automatically via MakeTorchFire
-- It may be attached to a parent item or placed as a standalone FX entity
```

## Dependencies & tags
**Components used:** `animstate` (via `MakeTorchFire` and `common_postinit`)
**Tags:** None identified

## Properties
No public properties

## Main functions
### `common_postinit(inst)`
*   **Description:** Initializes the animation state for the Tesla torch fire, including bank, build, animation, bloom effect, and offset.
*   **Parameters:** `inst` (Entity) — the prefab instance being initialized.
*   **Returns:** Nothing.

### `AssignSkinData(inst, parent)`
*   **Description:** Applies skin symbol overrides for Tesla-specific visual layers (bolt_b, bolt_c, torch_overlay) on the parent's skin, linking them to the Tesla torch skin.
*   **Parameters:**
    *   `inst` (Entity) — the torch fire instance.
    *   `parent` (Entity) — the parent item/entity whose skin is being overridden.
*   **Returns:** Nothing.

### `master_postinit(inst)`
*   **Description:** Exposes `AssignSkinData` as a callable method on the instance and sets a fixed Z-axis offset (`fx_offset = -125`) for proper placement.
*   **Parameters:** `inst` (Entity) — the prefab instance.
*   **Returns:** Nothing.

## Events & listeners
None identified