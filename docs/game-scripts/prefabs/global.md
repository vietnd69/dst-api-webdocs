---
id: global
title: Global
description: Defines the global asset prefab that preloads all core game resources including sounds, images, shaders, animations, and fonts on game initialization.
tags: [assets, prefab, resources]
sidebar_position: 10

last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: da466e92
system_scope: environment
---

# Global

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`global` is a special prefab that does not spawn an entity but instead registers all core game assets for preloading during initialization. It ensures sounds, images, shaders, animations, fonts, and character portraits are available before gameplay begins. This prefab is referenced by the engine's asset loading system and should not be spawned at runtime. Modders can reference its asset patterns when defining custom prefab dependencies.

## Usage example
```lua
-- This prefab is not spawned directly; it is registered for asset preloading.
-- To reference similar asset patterns in your mod:

local assets = {
    Asset("ATLAS", "images/your_mod.xml"),
    Asset("IMAGE", "images/your_mod.tex"),
    Asset("ANIM", "anim/your_anim.zip"),
    Asset("SOUNDPACKAGE", "sound/your_mod.fev"),
    Asset("FILE", "sound/your_mod.fsb"),
    Asset("SHADER", "shaders/your_shader.ksh"),
}

return Prefab("your_prefab", function(inst)
    -- Your prefab logic here
end, assets)
```

## Dependencies & tags
**External dependencies:**
- `fonts` -- loads `FONTS` table for font asset registration
- `skin_assets` -- returns table of skin-related asset definitions
- `cooking` -- provides `cookbook_recipes` for recipe image assets
- `klump_files` -- provides Quagmire event recipe images (conditional on `QUAGMIRE_USE_KLUMP`)

**Components used:**
- None -- this prefab does not attach components to any entity

**Tags:**
- None -- this prefab does not add, remove, or check entity tags

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No properties are defined. This is a prefab registration file with no Class() constructor or instance properties. |

## Main functions
None identified. This is a prefab registration file that only contains a local assets table and a return statement; no local functions are defined.

## Events & listeners
- **Listens to:** None identified. This file does not subscribe to any entity or world events.
- **Pushes:** None identified. This file does not fire any events during execution.