---
id: lantern_tesla_fx
title: Lantern Tesla Fx
description: Generates lightweight visual FX entities for the Tesla Lantern when held or placed on the ground.
tags: [fx, visual, lighting, lantern]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 953ff361
system_scope: fx
---

# Lantern Tesla Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lantern_tesla_fx.lua` is a prefab generator that creates specialized, short-lived visual effect (FX) entities for the Tesla Lantern. It produces two variants: one for when the lantern is held and one for when it is placed on the ground. These FX entities are purely visual, possess no gameplay logic, and are removed automatically from the world when no longer needed. They utilize dynamic animations and bloom rendering to simulate the lantern's energetic glow and electrical effects.

## Usage example
This component does not require manual usage — it is invoked internally by the game when the Tesla Lantern changes state (e.g., held vs. grounded). A typical workflow (e.g., as used elsewhere in the codebase) is:
```lua
-- Internally called to spawn FX variants:
local held_fx_prefab = require("prefabs/lantern_tesla_fx").held
local ground_fx_prefab = require("prefabs/lantern_tesla_fx").ground

local held_fx = TheWorld:SpawnPrefab(held_fx_prefab)
local ground_fx = TheWorld:SpawnPrefab(ground_fx_prefab)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `FX`.

## Properties
No public properties.

## Main functions
### `MakeFX(suffix)`
*   **Description:** Returns a configured `Prefab` function that spawns a visual FX entity. The suffix (`"held"` or `"ground"`) determines the animation bank and playset.
*   **Parameters:** `suffix` (string) — specifies the variant (`"held"` or `"ground"`), appended to the prefab name and animation string.
*   **Returns:** A `Prefab` function ready for use by `TheWorld:SpawnPrefab()`.
*   **Error states:** None — this is a deterministic factory function.

## Events & listeners
- **Pushes:** None — FX entities are not event-generators.
- **Listens to:** None — FX entities are passive and self-contained.