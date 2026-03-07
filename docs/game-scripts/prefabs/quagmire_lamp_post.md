---
id: quagmire_lamp_post
title: Quagmire Lamp Post
description: Creates light-emitting environment assets for the Quagmire biome with predefined visual and luminance properties.
tags: [environment, light, world]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5cacceee
system_scope: environment
---

# Quagmire Lamp Post

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_lamp_post` is a helper function that generates prefabs for Quagmire-region lighting fixtures—specifically the tall `quagmire_lamp_post` and short `quagmire_lamp_short` variants. It constructs entities with transform, animation state, light, and network components, configures them as static lighting objects, and optionally registers the `inspectable` component on the master simulation. The function is used within the prefab return statement to produce two distinct asset instances.

## Usage example
```lua
-- Internally used to define prefabs:
return Prefab("quagmire_lamp_post", LightFn("quagmire_lamp_post", 3.5, 0.58, 0.75, 235), { Asset("ANIM", "anim/quagmire_lamp_post.zip") }),
       Prefab("quagmire_lamp_short", LightFn("quagmire_lamp_short", 2, 0.58, 0.75, 200), { Asset("ANIM", "anim/quagmire_lamp_short.zip") })
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `light`, `network`, `inspectable` (added conditionally on mastersim)
**Tags:** None identified.

## Properties
No public properties. The function is purely procedural and returns prefab definitions—not a reusable component class.

## Main functions
### `LightFn(bank_build, radius, falloff, intensity, color)`
*   **Description:** Factory function that returns an entity initializer. It builds and configures a static light-emitting entity with asset-specific animations and lighting parameters.
*   **Parameters:**
    *   `bank_build` (string) — Animation bank and build name (e.g., `"quagmire_lamp_post"`).
    *   `radius` (number) — Light radius in world units.
    *   `falloff` (number) — Light falloff exponent.
    *   `intensity` (number) — Light intensity multiplier.
    *   `color` (number) — RGB color value (0–255 scale); normalized to `0..1` by dividing by `255`.
*   **Returns:** A function that, when called, constructs and returns a fully initialized `Entity` instance.
*   **Error states:** None identified. Works on both client and server; returns early on non-mastersim after core setup.

## Events & listeners
None identified.

