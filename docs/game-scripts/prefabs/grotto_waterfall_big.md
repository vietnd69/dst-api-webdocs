---
id: grotto_waterfall_big
title: Grotto Waterfall Big
description: A decorative environment prefab representing a large grotto waterfall with looping animation and networked rendering.
tags: [environment, decoration, visual]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7247ecf8
system_scope: environment
---

# Grotto Waterfall Big

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`grotto_waterfall_big` is a static, non-interactive environment entity used for visual decoration in the game world. It provides a large waterfall animation using a pre-defined anim bank and is rendered with two-sided orientation. It is networked (client/server synced), pristined (its state is authoritative and identical across clients), and excluded from player interaction via the `NOCLICK` tag. It is not a component but a full prefab definition.

## Usage example
This prefab is not instantiated directly by modders. It is registered and used internally by world generation code (e.g., grotto room layouts) as a static environment asset.

```lua
-- Example (internal use only — not modder-facing)
local waterfall = SpawnPrefab("grotto_waterfall_big")
waterfall.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `network`  
**Tags:** Adds `NOCLICK` (prevents player interaction via click or hover)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `no_wet_prefix` | boolean | `true` | Disables the "wet" animation prefix (used for precipitation effects) on this entity. |

## Main functions
Not applicable. This is a prefab constructor function, not a component with callable methods.

## Events & listeners
Not applicable. This entity has no event handlers or listeners defined.