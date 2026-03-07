---
id: quagmire_altar_statue
title: Quagmire Altar Statue
description: Helper function for creating decorative and environmental prefabs in the Quagmire and Park biomes with configurable animation banks, physics, and rotation behavior.
tags: [environment, static, decoration]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7a48b650
system_scope: environment
---

# Quagmire Altar Statue

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_altar_statue.lua` defines a reusable prefab factory function `MakeStatue` used to create a family of static environmental assets for the Quagmire and Park biomes. It sets up basic entity properties — transforms, animation states, physics (optional), and network replication — and conditionally adds components such as `inspectable` and `savedrotation` on the master simulation. The returned prefabs serve as in-world decorative or structural objects (e.g., statues, fountains, cart models) with no active gameplay logic beyond visual and spatial presence.

## Usage example
```lua
local quagmire_altar_statue1 = require "prefabs/quagmire_altar_statue"

-- The module returns multiple prefabs directly; typically used as:
local statue = Prefab("my_custom_statue", function()
    return MakeStatue("my_custom_statue", "my_build_bank", "idle", true)
end)
```

## Dependencies & tags
**Components used:** `inspectable`, `savedrotation`
**Tags:** None identified.

## Properties
No public properties — this is a factory function returning prefabs, not a component class.

## Main functions
### `MakeStatue(name, build_bank, anim, save_rotation, physics_rad)`
*   **Description:** Constructs and returns a `Prefab` for a static decorative or environmental entity (e.g., a statue or fountain). Configures its animations, physics, and entity structure.
*   **Parameters:**
    * `name` (string) — Unique prefab name (e.g., `"quagmire_altar_statue1"`).
    * `build_bank` (string) — Animation bank and build name used for `AnimState`.
    * `anim` (string or `nil`) — Animation name to play on spawn; defaults to `"idle"` if `nil`.
    * `save_rotation` (boolean) — If `true`, enables two-faced orientation and adds the `savedrotation` component.
    * `physics_rad` (number) — If non-zero, adds obstacle physics with radius `physics_rad`; otherwise no physics.
*   **Returns:** `Prefab` — A fully configured prefab definition ready for registration in the game.
*   **Error states:** None documented. Invalid parameters may cause runtime asset errors (e.g., missing animation bank) but no explicit validation is present.

## Events & listeners
None identified.