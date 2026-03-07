---
id: shadowskittish
title: Shadowskittish
description: Creates a non-persistent visual effect entity that appears near players and fades out after a random delay when the player moves away.
tags: [visual, fx, entity, lighting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 418ae252
system_scope: fx
---

# Shadowskittish

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`shadowskittish` is a client-side visual effect prefab that represents a fleeting shadow creature. It is non-networked, non-persistent, and intended solely for visual feedback in the game world. The entity becomes visible near players but disappears when the player moves away, animating a "disappear" sequence. It relies on the `playerprox` component for proximity detection and the `transparentonsanity` component for visibility tuning based on player sanity on non-dedicated clients.

## Usage example
```lua
-- The prefab is instantiated internally by the game; modders typically do not manually spawn it.
-- Example of adding a custom listener if extending behavior:
local inst = SpawnPrefab("shadowskittish")
-- Note: Modding this prefab is discouraged due to its client-only nature and tight integration with world effects.
```

## Dependencies & tags
**Components used:** `playerprox`, `transparentonsanity`, `animstate`, `transform`
**Tags:** `NOCLICK`, `FX`, `NOBLOCK`

## Properties
No public properties.

## Main functions
Not applicable. This is a prefab factory function, not a component. No methods are defined or exposed on the entity.

## Events & listeners
- **Listens to:** `animover` - triggers entity removal after the "disappear" animation completes.
- **Pushes:** None.