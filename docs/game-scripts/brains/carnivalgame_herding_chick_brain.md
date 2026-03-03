---
id: carnivalgame_herding_chick_brain
title: Carnivalgame Herding Chick Brain
description: Controls the AI behavior of a herding minigame chick, managing movement via wandering and runaway responses relative to a home location and station markers.
tags: [ai, minigame, locomotion, behaviour]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 2621a965
system_scope: brain
---

# Carnivalgame Herding Chick Brain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CarnivalGame_Herding_ChickBrain` defines the behavior tree for a chick entity participating in the herding minigame. It orchestrates three core behaviors using a priority node:  
1. Running away from entities with tags `"minigame_participator"` or `"minigame_spectator"` (e.g., other players or chicks).  
2. Avoiding the herding station region (`"carnivalgame_herding_station"` tag).  
3. Wandering within a maximum radius of its home location.  

The AI only activates when the entity has a `locomotor` component, and uses `knownlocations` to retrieve the `"home"` position for movement.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("carnivalgame_herding_chick")
inst:AddComponent("knownlocations")
inst:AddComponent("locomotor")
inst:AddComponent("behaviour")
inst:AddComponent("companion")
inst:AddBrain("carnivalgame_herding_chick_brain")
```

## Dependencies & tags
**Components used:**  
- `locomotor` (required for activation)  
- `knownlocations` (to fetch `"home"` location)  

**Tags:**  
- Adds `"minigame_participator"` or `"minigame_spectator"` dynamically (via `RunAway` behavior)  
- Checks for `"carnivalgame_herding_station"` tag to avoid station areas  

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree with a priority-ordered node hierarchy: runaway (from players/spectators), runaway (from home station), then wandering. Only runs while the `locomotor` component exists.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Behavior tree (`self.bt`) is only constructed if `self.inst.components.locomotor` is non-`nil` at activation time.

## Events & listeners
None identified.
