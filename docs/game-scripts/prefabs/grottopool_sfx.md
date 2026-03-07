---
id: grottopool_sfx
title: Grottopool Sfx
description: Creates a non-networked, non-persistent entity that acts as a classified FX-only sound emitter.
tags: [audio, fx]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a1e9307e
system_scope: fx
---

# Grottopool Sfx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`grottopool_sfx` is a lightweight prefab factory function used to instantiate a specialized entity dedicated solely to emitting sound effects (SFX) in the game world. It is a non-persistent (`persistence = false`), non-networked FX entity tagged as both `CLASSIFIED` and `FX`. It incorporates the `fader` component — likely to manage volume fades over time — and includes basic transform and sound emitter capabilities. This entity is intended for transient audio feedback in localized environments such as grotto pools.

## Usage example
```lua
local sfx_entity = SpawnPrefab("grottopool_sfx")
sfx_entity.Transform:SetPosition(x, y, z)
sfx_entity:ListenForEvent("soundplayed", function() print("SFX triggered") end)
```

## Dependencies & tags
**Components used:** `transform`, `soundemitter`, `fader`  
**Tags:** Adds `CLASSIFIED` and `FX`. Checks none directly.

## Properties
No public properties.

## Main functions
Not applicable — this is a prefab factory function; no instance methods are defined. The returned `inst` has all standard entity methods (e.g., `ListenForEvent`, `PushEvent`) and component methods from `fader`, `transform`, and `soundemitter`.

## Events & listeners
Not applicable — no event listeners are defined *within* this component. Users of the prefab may register listeners on the returned entity instance. The component does not push events.