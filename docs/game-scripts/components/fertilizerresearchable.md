---
id: fertilizerresearchable
title: Fertilizerresearchable
description: Enables an entity to provide researchable fertilizer data to the game, typically used by compost bins or similar structures in biomes like the Ruins.
tags: [crafting, research, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: af2cc389
system_scope: world
---

# Fertilizerresearchable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FertilizerResearchable` allows an entity to expose metadata about a specific fertilizer type that players can discover through the research system. It is attached to static world objects (e.g., compost bins) and integrates with the `learnfertilizer` event flow during player interaction. The component ensures the target entity is tagged `fertilizerresearchable`, marking it as a valid source for fertilizer research.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fertilizerresearchable")
inst.components.fertilizerresearchable:SetResearchFn(function(ent)
    return "rotgut"
end)
-- Later, when a player interacts with the entity:
inst.components.fertilizerresearchable:LearnFertilizer(player)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `fertilizerresearchable`

## Properties
No public properties

## Main functions
### `SetResearchFn(fn)`
* **Description:** Assigns a callback function that returns the fertilizer identifier when invoked. This function is called during research to determine *which* fertilizer the entity provides.
* **Parameters:** `fn` (function) — A function taking the entity instance as its only argument and returning a string fertilizer name (e.g., `"rotgut"`), or `nil`.
* **Returns:** Nothing.

### `GetResearchInfo()`
* **Description:** Invokes the research function (if set) and returns the resulting fertilizer identifier.
* **Parameters:** None.
* **Returns:** `string?` — The fertilizer name, or `nil` if no research function is defined or the function returns `nil`.
* **Error states:** Returns `nil` if `self.reasearchinfofn` is unset.

### `LearnFertilizer(doer)`
* **Description:** Triggers the `learnfertilizer` event on the `doer` (typically a player entity), delivering the fertilizer data obtained via `GetResearchInfo()`. Used when a player interacts with the researchable entity to learn a new fertilizer recipe.
* **Parameters:** `doer` (GObject) — The entity (usually a player) performing the action and receiving the event.
* **Returns:** Nothing.
* **Error states:** Does nothing if `GetResearchInfo()` returns `nil`.

## Events & listeners
- **Listens to:** None  
- **Pushes:** `learnfertilizer` — Fired on the `doer` entity with payload `{ fertilizer = "..." }` when fertilizer is successfully learned.
