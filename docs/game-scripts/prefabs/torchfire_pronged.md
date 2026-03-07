---
id: torchfire_pronged
title: Torchfire Pronged
description: A fire effect component that generates visual particle effects (smoke, fire, and embers) for a pronged torch variant, built using the shared torchfire system.
tags: [fx, light, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1a2baf0a
system_scope: fx
---

# Torchfire Pronged

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`torchfire_pronged` defines a visual effect prefab that produces realistic particle-based fire, smoke, and ember emissions for a pronged torch. It leverages the `MakeTorchFire` factory from `torchfire_common.lua` to create the base entity, and uses dedicated `common_postinit` and `master_postinit` callbacks to configure particle emitters, shaders, and emission rates. This component is purely visual and does not modify gameplay behavior directly.

## Usage example
```lua
local inst = Prefab("torchfire_pronged")
inst:AddComponent("torchfire_pronged")
-- Note: Typically this prefab is instantiated via the MakeTorchFire factory in torchfire_common.lua
-- and does not require manual component addition by modders.
```

## Dependencies & tags
**Components used:** None (this file is a prefab factory definition, not a component).
**Tags:** None identified.

## Properties
No public properties.

## Main functions
The core logic resides in standalone helper functions and callbacks; no public methods are exposed for modder use.

## Events & listeners
None identified.

