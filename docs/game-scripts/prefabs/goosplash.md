---
id: goosplash
title: Goosplash
description: Spawns particle-style splash FX entities used for visual effects in lava arena encounters.
tags: [fx, environment, lava]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c7454225
system_scope: fx
---

# Goosplash

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`goosplash` is a prefab generator for non-persistent, non-networked visual effects (FX) used in lava arena and similar encounters. It defines multiple variants (`goosplash1` through `goosplash8`) of splash animations, leveraging two animation banks: `gooball_fx` (for high-variant splash layers) and `lavaarena_hits_splash` (for background layer bases). The prefab is constructed dynamically at runtime and is intended to be spawned locally (not on dedicated servers) to reduce overhead. It does not represent a game object with persistent behavior but serves purely as a visual cue.

## Usage example
```lua
-- Example: Spawning a random goosplash effect at the target's position
local proxy = some_entity.Transform -- e.g., from an NPC or projectile
local splash = CreateEntity()
splash.entity:AddTransform()
splash.entity:AddNetwork()
splash:AddTag("FX")
splash:SetPrefabNameOverride("goosplash")
splash.flip = net_tinybyte(splash.GUID, "goosplash.flip")
splash.flip:set(math.random(4))
splash:DoTaskInTime(0.15 + math.random() * 0.05, function()
    PlaySplashAnim(proxy, math.random(8))
end)
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `Network` (via `net_tinybyte`)
**Tags:** Adds `FX`; checks no internal tags beyond that.

## Properties
No public properties are exposed or settable by external code.

## Main functions
This module is a prefab factory and does not expose functional methods on components. All logic resides in local helper functions and is invoked during prefab instantiation.

## Events & listeners
- **Listens to:** `animover` on spawned FX entities — triggers `inst.Remove` to clean up the effect once its animation completes.
- **Pushes:** None identified.