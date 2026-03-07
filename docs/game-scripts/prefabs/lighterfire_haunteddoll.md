---
id: lighterfire_haunteddoll
title: Lighterfire Haunteddoll
description: Creates and manages a haunted-doll-specific particle fire effect with dynamic smoke emission based on movement.
tags: [fx, lighting, movement]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d652d45d
system_scope: fx
---

# Lighterfire Haunteddoll

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lighterfire_haunteddoll` defines a specialized fire effect used by the Haunted Doll lighter item. It builds on the shared `MakeLighterFire` function from `lighterfire_common.lua` and customizes particle behavior by registering unique color/scale envelopes, configuring dual-emitter VFX (flame and smoke), and implementing movement-sensitive smoke emission logic. The component is not a standalone entity component but a prefab initialization function used during entity construction.

## Usage example
This is not a component but a prefab generator. It is used internally when defining the Haunted Doll lighter prefab. Modders should not instantiate it directly. To reuse this effect logic, define a new prefab using `MakeLighterFire` and provide a custom `common_postinit`:

```lua
local MakeLighterFire = require("prefabs/lighterfire_common")

local function my_custom_postinit(inst)
    -- ... custom VFX setup ...
end

return MakeLighterFire("my_lighter", ASSETS, nil, my_custom_postinit, my_master_postinit)
```

## Dependencies & tags
**Components used:** None — this file defines a prefab initialization hook, not a component.
**Tags:** None — no tags are added or removed.

## Properties
No public properties are defined.

## Main functions
No standalone functions are exported as public API. All functions are internal helpers or passed as callbacks to `MakeLighterFire`.

## Events & listeners
No event listeners or events are registered.

