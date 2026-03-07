---
id: quagmire_shadowwaxwell
title: Quagmire Shadowwaxwell
description: Defines the prefabs and visual/audio properties for the Quagmire version of Shadow Maxwell, including animation, sound, and network setup.
tags: [visual, entity, quagmire]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a6badf74
system_scope: entity
---

# Quagmire Shadowwaxwell

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_shadowwaxwell` is a prefab definition for a special version of Maxwell used in the Quagmire DLC. It sets up the entity with transform, animation state, sound emitter, and network components. It configures visual appearance (e.g., overlay colors, hidden body parts), assigns tags (`scarytoprey`, `shadowminion`, `NOBLOCK`), sets the build to `waxwell_shadow_mod`, and delegates master-side initialization to an external `master_postinit` function via an event.

## Usage example
This prefab is not meant to be instantiated manually by mods. It is referenced and spawned by game logic as part of Quagmire events.

```lua
-- Example of spawning the prefab (internal use only; not typical mod usage)
local inst = Prefab("quagmire_shadowwaxwell")()
inst.Transform:SetPos(x, y, z)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** `scarytoprey`, `shadowminion`, `NOBLOCK`

## Properties
No public properties

## Main functions
### `fn()`
*   **Description:** Constructor function for the `quagmire_shadowwaxwell` prefab. Sets up the entity's components, animation, sound, and tags. On the master sim, calls `event_server_data(...).master_postinit(inst)`.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — the fully initialized entity.
*   **Error states:** None documented.

## Events & listeners
- **Listens to:** `event_server_data("quagmire", "prefabs/quagmire_shadowwaxwell").master_postinit(inst)` — used to trigger master-side initialization logic defined externally.
- **Pushes:** None identified