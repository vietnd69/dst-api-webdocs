---
id: rudder
title: Rudder
description: A visual indicator prefab attached to boat masts that displays the current heading direction, used for orientation and navigation.
tags: [boat, navigation, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c31af271
system_scope: entity
---

# Rudder

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `rudder` prefab is a non-interactive visual component used exclusively on boats to indicate directional orientation. It is attached as a child entity to a `"mast"` parent and serves only a decorative/visual purpose — providing players with a reference point for boat heading. It does not participate in gameplay logic, physics, or network simulation on the master instance, and is excluded from world persistence.

## Usage example
```lua
-- This prefab is typically instantiated automatically by the game when a mast is constructed.
-- Manual instantiation is not recommended, but the following demonstrates how it could be added to a mast:
local mast = GetEntityWithTag("mast")
local rudder = SpawnPrefab("rudder")
rudder.Transform:SetPos(mast.Transform:GetWorldPosition())
mast.entity:AddChild(rudder.entity)
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Adds `NOBLOCK` and `DECOR` to the entity; checks for `"mast"` tag on parent.

## Properties
No public properties.

## Main functions
Not applicable.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.

### Entity lifecycle hooks
- **`inst.OnRemoveEntity`** (`CLIENT_OnRemoveEntity(inst)`)  
  *Description:* Cleans up the reference to this rudder from the parent mast's `highlightchildren` array on the client when the rudder is removed.  
  *Parameters:* `inst` (Entity) — the rudder entity being removed.  
  *Returns:* Nothing.

- **`inst.OnEntityReplicated`** (`OnEntityReplicated(inst)`)  
  *Description:* Registers this rudder with its parent mast's `highlightchildren` array when the entity is replicated to clients (used for visual highlighting effects). Only active on non-master simulations.  
  *Parameters:* `inst` (Entity) — the rudder entity.  
  *Returns:* Nothing.  
  *Error states:* No effect if parent is missing, not tagged `"mast"`, or lacks `highlightchildren`.