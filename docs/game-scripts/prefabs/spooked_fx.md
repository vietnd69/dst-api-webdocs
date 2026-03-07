---
id: spooked_fx
title: Spooked Fx
description: Creates short-lived, client-side visual and audio effect prefabs for the Spooked event's spider and worm spawn animations.
tags: [fx, event, animation, audio, client]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d29495bc
system_scope: fx
---

# Spooked Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`spooked_fx.lua` defines two prefabs for localized visual and audio effects used during the Spooked event. These prefabs are client-side only and do not persist or simulate on the server. They are created with a transform, animation state, and sound emitter, and automatically destroy themselves upon animation completion. The prefabs are specifically used for spider and worm spawn visuals in seasonal content.

## Usage example
```lua
-- Example usage: Spawning the spider rock FX at a given position
local fx = SpawnPrefab("spooked_spider_rock_fx")
if fx ~= nil then
    fx.Transform:SetPosition(x, y, z)
end

-- Example usage: Spawning the worm FX
local fx = SpawnPrefab("spooked_worms_fx")
if fx ~= nil then
    fx.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `soundemitter`, `network`
**Tags:** Adds `FX` and `NOCLICK` to spawned entities.

## Properties
No public properties.

## Main functions
### `MakeFx(name, build, anim, sound)`
*   **Description:** Factory function that constructs and returns a `Prefab` definition for a client-side effect entity. Sets up the required components, animation bank and build, plays the animation, adds tags, registers wake/sleep callbacks (server-only), and listens for `animover` to remove the entity.
*   **Parameters:**  
    `name` (string) – Unique prefab name (e.g., `"spooked_spider_rock_fx"`).  
    `build` (string) – Animation bank/build name (e.g., `"spider_rock_fx"`).  
    `anim` (string) – Animation name to play on spawn (e.g., `"spiders_spawn"`).  
    `sound` (string) – Sound event path to play on wake (e.g., `"hallowednights2025/spooks/spiders"`).
*   **Returns:** `Prefab` – A prefabricated entity definition ready for use with `SpawnPrefab`.
*   **Error states:** Returns `nil` on the server only when `TheWorld.ismastersim` is false (though the prefab itself is only ever instantiated client-side by design).

## Events & listeners
- **Listens to:** `animover` – Triggers `inst.Remove()` to destroy the effect once the animation finishes playing.
- **Pushes:** None.