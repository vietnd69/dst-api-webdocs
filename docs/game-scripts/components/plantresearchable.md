---
id: plantresearchable
title: Plantresearchable
description: Enables an entity to provide researchable plant information and supports unlocking plant stages for research purposes.
tags: [research, plant, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: ee7d6cbb
system_scope: entity
---

# Plantresearchable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PlantResearchable` is a component that marks an entity as providing researchable plant data and facilitates the discovery of plant growth stages. It is typically attached to plant prefabs in the game world (e.g., Saplings, Carrot Plants, etc.) and allows entities like the Science Machine or Auto Animator to access and process their research metadata. When an entity with this component is interacted with for research, it notifies the_doer (typically a player or instrument) by pushing a `learnplantstage` event with plant name and stage information.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("plantresearchable")
inst.components.plantresearchable:SetResearchFn(function(entity)
    return { plant = "carrot", stage = 1 }
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `plantresearchable`

## Properties
No public properties

## Main functions
### `SetResearchFn(fn)`
*   **Description:** Assigns a custom function to generate research information about the plant. This function is called later to retrieve plant name and growth stage.
*   **Parameters:** `fn` (function) - a callback taking `self.inst` (the entity) and returning `{ plant = string, stage = number }` or `nil` if invalid.
*   **Returns:** Nothing.

### `GetResearchInfo()`
*   **Description:** Invokes the research function (if set) and returns the plant metadata.
*   **Parameters:** None.
*   **Returns:** `{ plant = string, stage = number }` if successful; `nil` if no function is set or the function returns `nil`.
*   **Error states:** May return `nil` if `reasearchinfofn` is unassigned or yields `nil`.

### `IsRandomSeed()`
*   **Description:** Determines whether the plant is a random seed (i.e., its research info cannot be determined).
*   **Parameters:** None.
*   **Returns:** `true` if `GetResearchInfo()` returns `nil`; otherwise `false`.

### `LearnPlant(doer)`
*   **Description:** Notifies the `doer` entity that a plant stage has been learned, by pushing a `learnplantstage` event. Typically called when the plant is examined by a research tool or machine.
*   **Parameters:** `doer` (Entity) - the entity performing the research; must support `PushEvent`.
*   **Returns:** Nothing.
*   **Error states:** No-op if `GetResearchInfo()` returns `nil` or `stage` is invalid. Only proceeds if both `plant` and `stage` are truthy.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** `learnplantstage` — fired when `LearnPlant()` is called with valid research info; payload is `{ plant = string, stage = number }`.
