---
id: hats_lavaarena
title: Hats Lavaarena
description: Defines and registers lava arena-specific hat prefabs, each initialized with shared animation, physics, and network setup, then delegated to a master-only post-initialization function for gameplay logic.
tags: [lavaarena, hat, inventory]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c64ae55a
system_scope: inventory
---

# Hats Lavaarena

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`hats_lavaarena.lua` is a prefab factory module that dynamically generates hat prefabs for the Lava Arena event. It uses the `MakeHat` closure to standardize asset loading, transform/animation/network setup, inventory physics, and tag assignment across all hat prefabs. Master-only post-initialization (`master_postinit`) is invoked only on the server to apply event-specific logic.

## Usage example
```lua
-- This file is not meant to be used directly; it returns a list of prefabs:
return MakeHat("feathercrown"),
    MakeHat("lightdamager"),
    -- ... other hats
```
In practice, these prefabs are referenced as `"lavaarena_feathercrownhat"`, `"lavaarena_lightdamager"`, etc., and loaded via the Lava Arena event system.

## Dependencies & tags
**Components used:** `transform`, `animstate`, `network`, `inventoryPhysics`
**Tags:** Adds `hat` to each instance.

## Properties
No public properties — this module is a factory function and does not define persistent component state.

## Main functions
### `MakeHat(name)`
* **Description:** Constructs and returns a prefab definition for a lava arena hat variant. Performs common setup (assets, anim, physics) and delegates to `master_postinit` on the server.
* **Parameters:** `name` (string) — base name of the hat (e.g., `"feathercrown"`).
* **Returns:** Prefab — a fully configured prefab definition.
* **Error states:** If `TheWorld.ismastersim` is `false` (client), the function returns early with a minimal entity and does not invoke `master_postinit`.

## Events & listeners
None — this module does not register or dispatch events directly.