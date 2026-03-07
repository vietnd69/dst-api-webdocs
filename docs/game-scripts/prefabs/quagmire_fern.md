---
id: quagmire_fern
title: Quagmire Fern
description: A decorative plant prefab for the Quagmire biome that provides no gameplay interaction beyond visual presence.
tags: [decoration, environment, quagmire]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5d763ec7
system_scope: environment
---

# Quagmire Fern

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_fern` is a static, decorative plant prefab used to populate the Quagmire biome. It provides no gameplay mechanics and serves solely as environmental art. It is rendered using the `cave_ferns` build from the `ferns` animation bank and includes basic physics and network synchronization components.

## Usage example
```lua
-- The prefab is instantiated internally by the world generation system.
-- Modders typically do not need to spawn it directly.
-- If needed, it can be spawned via:
local inst = SpawnPrefab("quagmire_fern")
inst.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Adds `quagmire_wildplant` (used for stats tracking).

## Properties
No public properties.

## Main functions
No public functions.

## Events & listeners
No events or listeners are defined for this prefab.