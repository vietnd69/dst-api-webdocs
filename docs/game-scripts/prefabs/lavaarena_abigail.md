---
id: lavaarena_abigail
title: Lavaarena Abigail
description: A prefabricated entity instance for a ghostly variant of Abigail used exclusively in the Lava Arena event.
tags: [boss, ghost, event, companion, lighting]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 928e481b
system_scope: entity
---

# Lavaarena Abigail

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lavaarena_abigail` is a prefab definition for a custom, event-specific variant of Abigail used in the Lava Arena minigame. It creates an invisible, ghostly entity with a distinct visual appearance (using the `ghost_abigail_build` asset), ghost physics, and lighting properties suitable for spectral characters. This prefab does not implement gameplay logic directly; instead, it delegates initialization to a master post-initialization callback (`master_postinit`) when running on the server.

## Usage example
This prefab is instantiated internally by the game during Lava Arena events. Modders can reference or extend it as a base for custom ghostly companion entities.

```lua
local inst = CreatePrefabInstance("lavaarena_abigail")
-- The entity is initially hidden (`inst:Hide()`) and requires manual showing
inst:Show()
```

## Dependencies & tags
**Components used:** None (only generic engine components: `transform`, `animstate`, `soundemitter`, `light`, `network`)
**Tags:** Adds the following tags: `character`, `scarytoprey`, `girl`, `ghost`, `noauradamage`, `notraptrigger`, `abigail`, `NOBLOCK`, `companion`, `NOCLICK`.

## Properties
No public properties — this is a prefab factory function returning an entity instance, not a component with persistent state.

## Main functions
Not applicable — this file defines a prefab, not a component. The `lavaarena_fn()` function acts as the constructor logic but does not expose callable methods.

## Events & listeners
- **Listens to:** None directly in this file.
- **Pushes:** None directly in this file. The `master_postinit` function (called on the master simulation) may fire events, but its implementation resides in `scripts/prefabs/lavaarena_abigail.lua`'s server-side extension (not included here).
