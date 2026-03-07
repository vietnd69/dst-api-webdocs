---
id: statueharp
title: Statueharp
description: A breakable decorative statue that drops marble loot when mined and supports dynamic animation states and Charlie-induced modifications.
tags: [environment, loot, structure]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 506e4ea2
system_scope: environment
---

# Statueharp

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`statueharp` is a static environmental object representing a harp-shaped marble statue. It serves as a breakable object in the world, designed to be mined using the `MINE` action. When destroyed, it spawns visual feedback (`rock_break_fx`) and drops a configurable amount of `marble` loot. The prefab also implements experimental logic for Charlie-induced modifications (e.g., vine overlays and premature partial destruction) via the `doCharlieTest` callback and supports persistent state saving/loading.

## Usage example
```lua
local inst = Prefab("statueharp", fn, assets, prefabs)
-- This prefab is instantiated automatically by the game engine via its Prefab definition.
-- External code interacts with it only through its components:
inst.components.workable:WorkedBy(player, amount)
inst.components.lootdropper:DropLoot(position)
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `inspectable`  
**Tags:** Adds `statue`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `charlies_work` | boolean | `false` | Indicates if Charlie's modification (vine build + potential early damage) has been applied. |
| `charlie_test` | boolean | `false` | Tracks whether the Charlie test has been run (set once per instance lifetime). |
| `scrapbook_build` | string | `"statue_small_harp_build"` | Build name used for scrapbook rendering. |
| `scrapbook_anim` | string | `"full"` | Animation name used for scrapbook rendering. |

## Main functions
### `OnWorked(inst, worker, workleft)`
*   **Description:** Callback invoked when the statue is mined. If `workleft <= 0`, it spawns an FX, drops loot, and removes the statue. Otherwise, it plays an appropriate animation based on remaining work.
*   **Parameters:**  
    `inst` (Entity) – the statue entity.  
    `worker` (Entity or `nil`) – the entity performing the work (may be `TheWorld` in test scenarios).  
    `workleft` (number) – remaining work required to fully break the statue.  
*   **Returns:** Nothing.

### `OnWorkLoad(inst)`
*   **Description:** Load-time callback that re-applies the `OnWorked` logic upon world load, ensuring correct animation state matches saved `workleft`.
*   **Parameters:**  
    `inst` (Entity) – the statue entity.  
*   **Returns:** Nothing.

### `doCharlieTest(inst)`
*   **Description:** Runs once at spawn time to randomly apply Charlie’s modifier: adds a vine build override and may simulate partial mining if the statue is intact. Only runs if `inst.charlie_test` is `false`.
*   **Parameters:**  
    `inst` (Entity) – the statue entity.  
*   **Returns:** Nothing.
*   **Error states:** No-op if `inst.charlie_test` is already `true`.

### `invokecharliesanger(inst)`
*   **Description:** Applies the Charlie-specific vine build (`statue_small_harp_vine_build`) as an override.
*   **Parameters:**  
    `inst` (Entity) – the statue entity.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:** None (no `inst:PushEvent` calls).