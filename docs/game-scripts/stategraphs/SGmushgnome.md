---
id: SGmushgnome
title: Sgmushgnome
description: Defines the state machine for the mushroom gnome creature, handling animation, combat, locomotion, and environmental interactions.
tags: [ai, combat, creature]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: b16d1360
system_scope: brain
---

# Sgmushgnome

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGmushgnome` is a stategraph defining the behavioral state machine for the mushroom gnome NPC. It manages transitions between states such as idle, walking, attacking, being hit, dying, spawning, panicking, and falling into the void, using common state helpers from `commonstates.lua`. The stategraph integrates with multiple components including `health`, `combat`, `locomotor`, `burnable`, `lootdropper`, and `periodicspawner` to respond to gameplay events like attacks, death, burning, and movement requests.

## Usage example
This stategraph is automatically applied to the mushroom gnome prefab at runtime via the `StateGraph` constructor. Modders rarely interact with it directly but may extend its behavior by overriding states or listening for events it pushes. Example integration within a prefab definition:
```lua
local function fn()
    local inst = CreateEntity()
    inst:AddComponent("health")
    inst:AddComponent("combat")
    inst:AddComponent("locomotor")
    inst:AddComponent("burnable")
    inst:AddComponent("lootdropper")
    inst:AddComponent("periodicspawner")
    inst:AddStateGraph("mushgnome", "mushgnome")
    return inst
end
```

## Dependencies & tags
**Components used:** `health`, `combat`, `locomotor`, `burnable`, `lootdropper`, `periodicspawner`.  
**Tags:** Adds `busy`, `attack`, `hit`, `waking`, `idle`, `moving`, `noattack`, `noelectrocute` depending on state; checks `frozen`, `electrocute`, `sleeping` via `HasStateTag`.

## Properties
No public properties. The stategraph uses local constants (`PI_BY_6`, `ANGLES`) and internal `statemem` storage for transient state data.

## Main functions
Not applicable — this is a declarative stategraph definition, not a component with callable methods.

## Events & listeners
- **Listens to:**  
  `attacked`, `doattack`, `spawn`, `locomote`, `animover`, `death`, `freeze`, `electrocute`, `sleep`, `wake`, `fallvoid` — handled via `EventHandler` and `CommonHandlers`.
- **Pushes:**  
  None directly — events are handled internally and do not emit top-level events via `PushEvent`. State transitions are implemented via `GoToState`.