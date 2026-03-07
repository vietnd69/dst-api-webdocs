---
id: quagmire_hoe
title: Quagmire Hoe
description: A tool prefab used in Quagmire game mode to interact with soil and terrain, featuring dedicated animation and network state management.
tags: [tool, quagmire, terrain, inventory]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b446c294
system_scope: world
---

# Quagmire Hoe

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_hoe` is a prefab definition for a tool used in the Quagmire game mode. It provides the visual and physical representation of a hoe, including animations, sound, and basic physics. The prefab adds a `sharp` tag unconditionally and conditionally adds the `weapon` tag in non-Quagmire modes for optimization (note: the primary Quagmire mode excludes it). It is intended to be used as an inventory item and integrates with the game's entity system via standard DST ECS patterns.

## Usage example
The prefab is typically instantiated by the game engine during world init or inventory spawning, and not manually created by mods:
```lua
-- Example usage (internal game use):
local inst = Prefab("quagmire_hoe", fn, assets, prefabs)
-- The engine calls fn() to build the instance, which:
--   - Adds transforms, animstate, sound, network, and inventory physics
--   - Sets animations from anim/quagmire_hoe.zip
--   - Tags the instance appropriately
--   - Optionally defers to master_postinit in Quagmire mode
```

## Dependencies & tags
**Components used:** `animstate`, `transform`, `soundemitter`, `network`
**Tags:** Adds `sharp`; conditionally adds `weapon` only when `TheNet:GetServerGameMode() ~= "quagmire"`.

## Properties
No public properties.

## Main functions
Not applicable — this file defines a prefab constructor function (`fn`), not a component with public methods.

## Events & listeners
Not applicable — no event listeners or pushes are present in this file.

