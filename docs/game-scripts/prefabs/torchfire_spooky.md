---
id: torchfire_spooky
title: Torchfire Spooky
description: Spooky variant of the torch fire effect, producing distinct smoke visuals and particle behavior using custom color and scale envelopes.
tags: [fx, environment, torch]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 16fa1456
system_scope: fx
---

# Torchfire Spooky

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`torchfire_spooky` is a specialized fire effect prefab that extends the base `torchfire_common` implementation with a unique visual style—primarily through custom smoke particle behavior. It defines envelope-based color and scale animation for smoke particles, and sets up a VFX effect emitter system for rendering spooky smoke using a specific shader and texture. This prefab is used for decorative atmospheric effects (e.g., haunted or magical lighting), and only initializes VFX on non-dedicated clients.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("torchfire")
inst:AddTag("torch")
inst:AddComponent("torch")
inst:AddComponent("light")
-- The torchfire_spooky logic is applied during prefab creation in the engine
-- This component is not manually added to entities, but instantiated via the returned prefab definition.
```

## Dependencies & tags
**Components used:** None directly; this is a prefab (not a component) that calls into `MakeTorchFire`.
**Tags:** Adds `torchfire`, `torch` (inherited via `MakeTorchFire` call).
**External assets used:** `fx/smoke.tex`, `shaders/vfx_particle.ksh`.

## Properties
No public properties.

## Main functions
Not applicable. This file returns a prefab definition constructed by `MakeTorchFire`. It defines internal helper functions for effect initialization but no public API methods.

## Events & listeners
Not applicable.