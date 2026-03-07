---
id: torchfire_shadow
title: Torchfire Shadow
description: Generates particle visual effects for a torchfire entity, including fire, smoke, and hand animations using custom envelopes and emitters.
tags: [fx, visual, lighting, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fa183201
system_scope: fx
---

# Torchfire Shadow

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`torchfire_shadow` is a prefab generator script responsible for configuring particle visual effects for a torch-style light source. It defines and initializes three distinct particle streams — fire, smoke, and hand glow — using custom colour and scale envelopes, render resources (textures and shaders), and physics-based emitter logic. This script leverages `MakeTorchFire` from `torchfire_common.lua` as a base and extends it with shadow/ambient visuals tailored for dynamic lighting (e.g., for use on player-held torches or environmental torches).

## Usage example
This script is not intended for direct use as a component. Instead, it produces a prefab definition used internally by the engine:

```lua
-- Internal usage (not for modders to call directly)
local TorchShadowFire = require("prefabs/torchfire_shadow")
-- The returned prefab is registered via MakeTorchFire and used via PrefabName("torchfire_shadow")
```

## Dependencies & tags
**Components used:** None — this is a prefab generator, not a runtime component.
**Tags:** None added or checked by this script.

## Properties
No public properties — this file is a script that builds and returns a prefab definition via `MakeTorchFire`.

## Main functions
This file does not define any standalone public methods for modder use. The `common_postinit` and `master_postinit` functions are internal callbacks passed to `MakeTorchFire`.

### `common_postinit(inst)`
*   **Description:** Initializes particle effect emitters and their configuration (textures, shaders, envelopes, blend modes, etc.). Only runs on non-dedicated clients. Calls `InitEnvelope()` once to register colour and scale envelopes with `EnvelopeManager`.
*   **Parameters:** `inst` (entity) — the torchfire instance being initialized.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `TheNet:IsDedicated()` is true (no visual effects on dedicated servers). Ensures `InitEnvelope()` runs only once by setting `InitEnvelope = nil` afterward.

### `master_postinit(inst)`
*   **Description:** Sets the `fx_offset` property on the instance to `-100`, likely controlling the render layer order (e.g., so shadows appear behind other objects).
*   **Parameters:** `inst` (entity) — the torchfire instance.
*   **Returns:** Nothing.

## Events & listeners
None — this is a prefabrication-time setup script with no event listeners or runtime event emission logic.