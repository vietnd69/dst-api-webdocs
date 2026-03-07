---
id: houndbone
title: Houndbone
description: A breakable bone object that drops loot and collapses when hammered.
tags: [breakable, loot, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 60b48b92
system_scope: world
---

# Houndbone

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `houndbone` prefab is a breakable environmental object that simulates a discarded bone fragment. It supports interaction via hammering, triggers a collapse animation, drops randomized loot, and persists its animation state across saves. It is primarily used as a decorative and resource-yielding element in the game world.

## Usage example
```lua
local bone = SpawnPrefab("houndbone")
bone.Transform:SetPosition(inst.Transform:GetWorldPosition())
```

## Dependencies & tags
**Components used:** `workable`, `lootdropper`, `inspectable`, `soundemitter`, `animstate`, `transform`, `network`  
**Tags:** Adds `bone`

## Properties
No public properties

## Main functions
Not applicable (this is a prefab definition, not a component; functionality is defined in its constructor via component setup)

## Events & listeners
- **Listens to:** None  
- **Pushes:** `entity_droploot` (via `lootdropper:DropLoot()`) when hammered and destroyed