---
id: lavaarena_groundlifts
title: Lavaarena Groundlifts
description: Factory function for creating ground lift effect prefabs used in the Lava Arena boss encounter.
tags: [boss, fx, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 41afaa60
system_scope: environment
---

# Lavaarena Groundlifts

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lavaarena_groundlifts` is a Prefab factory module that defines and registers five distinct ground lift effect prefabs for use in the Lava Arena boss encounter. Each variant is customized with specific animation, sound, and tag configurations. These prefabs are instantiated via the `MakeGroundLift` factory function and used as visual and behavioral elements during boss attacks.

The prefabs are self-contained and do not implement additional logic in this file; server-side initialization is delegated to `master_postinit` in the `event_server_data("lavaarena", ...)` handler.

## Usage example
```lua
-- Example of spawning one of the ground lift prefabs in the world
local inst = SpawnPrefab("lavaarena_groundlift")
inst.Transform:SetPosition(x, y, z)
inst:Show()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `notarget`, `hostile`, `groundspike`, `object`, `stone`; conditionally adds `CLASSIFIED` if no animation.

## Properties
No public properties

## Main functions
### `MakeGroundLift(name, radius, hasanim, hassound, excludesymbols)`
*   **Description:** Factory function that constructs and returns a `Prefab` definition for a ground lift effect. It configures entity structure, tags, animations, and delegates server-side initialization.
*   **Parameters:**
    *   `name` (string) - Name of the prefab (e.g., `"lavaarena_groundlift"`).
    *   `radius` (number) - Radius value used during server-side initialization (semantic use not defined in this file).
    *   `hasanim` (boolean) - Whether the entity should include `AnimState` component and load animation assets.
    *   `hassound` (boolean) - Whether the entity should include `SoundEmitter` component.
    *   `excludesymbols` (table or `nil`) - List of animation symbols to hide in the `AnimState`.
*   **Returns:** A `Prefab` object (returned by `Prefab(name, fn, assets)`).
*   **Error states:** None documented.

## Events & listeners
None identified

