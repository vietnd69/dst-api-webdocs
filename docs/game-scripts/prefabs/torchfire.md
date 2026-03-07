---
id: torchfire
title: Torchfire
description: Creates and manages the visual particle effects for a torch fire, including smoke and flame emissions on the client.
tags: [fx, visual, lighting, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4683e3eb
system_scope: fx
---

# Torchfire

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`torchfire` is a client-side prefab component that generates and manages the visual particle effects (smoke and flame) for a torch. It is instantiated via `MakeTorchFire()` from `torchfire_common.lua` and attaches a `VFXEffect` to its entity, configuring emitters for smoke and fire with specific textures, envelopes, and emission rates. The component is strictly for visual rendering — it does not run on dedicated servers and exits early if `TheNet:IsDedicated()` returns `true`.

## Usage example
This prefab is used internally by the game and typically not added manually by modders. It is included as part of torch-related prefabs (e.g., `torch`, `firepit`) via `MakeTorchFire()`.

```lua
-- Example internal usage (as seen in torchfire.lua itself)
local MakeTorchFire = require("prefabs/torchfire_common")
return MakeTorchFire("torchfire", assets, nil, common_postinit, master_postinit)
```

## Dependencies & tags
**Components used:** None directly accessed via `inst.components.X`. It uses `inst.entity:AddVFXEffect()` and `EmitterManager`.
**Tags:** None added, removed, or checked.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fx_offset` | number | `-110` (in `master_postinit`) | Vertical offset applied to the fire's visual position; used for alignment with the torch entity's attachment point. |

## Main functions
This file does not define any public methods. All logic is encapsulated in internal functions (`emit_smoke_fn`, `emit_fire_fn`, `InitEnvelope`, `common_postinit`, `master_postinit`) called during prefab initialization via `MakeTorchFire()`.

## Events & listeners
None. This component does not register or push any events.