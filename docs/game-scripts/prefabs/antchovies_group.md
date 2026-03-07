---
id: antchovies_group
title: Antchovies Group
description: A background visual entity representing a school of antchovies that periodically spawns individual antchovies using the fishschool component.
tags: [environment, underwater, ai]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: abbc10c5
system_scope: environment
---

# Antchovies Group

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `antchovies_group` prefab is a non-interactive visual entity that serves as a decorative ambient effect in underwater environments. It uses the `fishschool` component to periodically replenish individual `antchovies` entities, simulating a school of fish. The prefab is non-networked on clients (pristine) and only active in the master simulation, ensuring consistent behavior across clients and server.

## Usage example
```lua
-- Typically instantiated via worldgen or room generation.
-- No direct usage in mod code is expected.
local group = SpawnPrefab("antchovies_group")
group.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `fishschool`
**Tags:** `ignorewalkableplatforms`

## Properties
No public properties.

## Main functions
Not applicable.

## Events & listeners
Not applicable.
