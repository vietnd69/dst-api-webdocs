---
id: meteorspawner
title: Meteorspawner
description: Creates a classified entity that acts as a meteor spawner by attaching the meteorshower component.
tags: [environment, weather, spawner]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e3accb62
system_scope: environment
---

# Meteorspawner

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`meteorspawner` is a simple prefab factory that instantiates a non-networked entity designated for triggering meteor showers. It assigns the `CLASSIFIED` tag and attaches the `meteorshower` component, which presumably handles the logic for spawning meteors during gameplay. This entity serves as a container or trigger point for environmental weather events in the world.

## Usage example
```lua
local spawner = TheWorld:SpawnPrefab("meteorspawner")
spawner.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `meteorshower`
**Tags:** Adds `CLASSIFIED`.

## Properties
No public properties.

## Main functions
Not applicable.

## Events & listeners
None identified.