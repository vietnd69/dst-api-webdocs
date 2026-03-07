---
id: constructionbuilderuidata
title: Constructionbuilderuidata
description: Provides UI-facing accessor methods for construction-related data, specifically the container and target entities of a construction builder, and helper functions to query construction plan ingredients.
tags: [ui, construction, replication]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a9b6f24f
system_scope: ui
---

# Constructionbuilderuidata

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ConstructionBuilderUIData` is a lightweight component designed solely to expose UI-relevant data about a construction builder—most notably the current container and target entities—via network-safe accessors. It avoids the need to attach `constructionbuilder_replica` directly to the entity by using `net_entity` proxies. It also provides helper methods to look up ingredients for a given construction site and locate slots for specific ingredients.

This component is typically attached to a `constructionbuilder` entity and serves as a data bridge between the server-side logic and client UI.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("constructionbuilderuidata")

-- Set and get container entity
local container = GetSomeContainerEntity()
inst.components.constructionbuilderuidata:SetContainer(container)

-- Set and get target entity (the construction site)
local target = GetSomeConstructionSiteEntity()
inst.components.constructionbuilderuidata:SetTarget(target)

-- Retrieve construction site replica or ingredient info
local site = inst.components.constructionbuilderuidata:GetConstructionSite()
local slot_index = inst.components.constructionbuilderuidata:GetSlotForIngredient("twigs")
local ingredient_type = inst.components.constructionbuilderuidata:GetIngredientForSlot(slot_index)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_containerinst` | `net_entity` | `nil` | Network-safe proxy to the current container entity. |
| `_targetinst` | `net_entity` | `nil` | Network-safe proxy to the current target (construction site) entity. |

## Main functions
### `SetContainer(containerinst)`
* **Description:** Sets the container entity to be used for this construction builder. Typically called when the player selects or opens a container.
* **Parameters:** `containerinst` (Entity or `nil`) — The entity representing the container (e.g., a chest or crock pot). `nil` clears the container.
* **Returns:** Nothing.

### `GetContainer()`
* **Description:** Returns the currently set container entity.
* **Parameters:** None.
* **Returns:** `Entity` or `nil` — the container entity, if set.

### `SetTarget(targetinst)`
* **Description:** Sets the target construction site entity (the site being built or upgraded). Typically called when a player targets a construction site.
* **Parameters:** `targetinst` (Entity or `nil`) — The construction site entity. `nil` clears the target.
* **Returns:** Nothing.

### `GetTarget()`
* **Description:** Returns the currently set target construction site entity.
* **Parameters:** None.
* **Returns:** `Entity` or `nil` — the target entity, if set.

### `GetConstructionSite()`
* **Description:** Returns the `constructionsite` replica of the target entity, if a target is set.
* **Parameters:** None.
* **Returns:** `ConstructionSiteReplica` or `nil` — the network replica for the construction site, or `nil` if no target is set or the target lacks a `constructionsite` component.

### `GetIngredientForSlot(slot)`
* **Description:** Returns the ingredient type (prefab name) required for a given slot index in the current target's construction plan.
* **Parameters:** `slot` (number) — The 1-based index of the slot in the construction plan array.
* **Returns:** `string` or `nil` — the prefab name of the required ingredient (e.g., `"twigs"`), or `nil` if no target is set or the slot index is out of range.

### `GetSlotForIngredient(prefab)`
* **Description:** Returns the 1-based slot index where a given ingredient (prefab name) is required for the current target's construction plan.
* **Parameters:** `prefab` (string) — The prefab name of the ingredient to locate (e.g., `"rocks"`).
* **Returns:** `number` or `nil` — the slot index, or `nil` if not found or no target is set.

## Events & listeners
None identified
