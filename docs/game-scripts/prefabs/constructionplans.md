---
id: constructionplans
title: Constructionplans
description: Creates construction plan prefabs that define which entity can be built from a given item.
tags: [crafting, world]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ecdb7530
system_scope: crafting
---

# Constructionplans

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`constructionplans.lua` defines a factory function `MakePlans` that generates prefabs representing construction plan items in DST. These plan prefabs act as recipe descriptors, associating an inventory item (e.g., a *Moon Rock Plans* object) with one or more target prefabs (e.g., *multiplayer_portal*). The plan entity carries tags in the form `<target>_<plans>` (e.g., `multiplayer_portal_plans`) to identify its build target and attaches the `constructionplans` component to register buildable entities. It also integrates with systems like `inspectable`, `inventoryitem`, `smallburnable`, `smallpropagator`, and `hauntablelaunch`.

## Usage example
```lua
-- Example of how `MakePlans` is used internally to create the Moon Rock Plans item
return MakePlans(
    "multiplayer_portal_moonrock",
    { "multiplayer_portal" },
    moonrockpostinitfn
)

-- Custom postinit for special scrapbook handling
local function moonrockpostinitfn(inst)
    inst.scrapbook_specialinfo = "MULTIPLAYERPOTALMOONROCKPLANS"
end
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `constructionplans`, `smallburnable`, `smallpropagator`, `hauntablelaunch`  
**Tags added:** `<target>_<plans>` for each target in `targets` (e.g., `multiplayer_portal_plans`), `donotautopick`  
**Tags checked:** None identified.

## Properties
No public properties.

## Main functions
The `constructionplans.lua` file does not define a component class; it defines a *prefab factory* (`MakePlans`) and returns a single `Prefab`. Therefore, there are no component methods to document. The key functional logic resides in the factory closure:

### `MakePlans(name, targets, postinitfn)`
* **Description:** Generates and returns a `Prefab` for a construction plan item. The resulting plan item is named `<name>_constr_plans` and binds to a single buildable entity (`<name>_constr`) that can be constructed in-game.
* **Parameters:**
  * `name` (string) — Base name used to derive the construction item name and animation.
  * `targets` (table of strings) — List of target prefabs that can be built using this plan (each becomes a `<target>_<plans>` tag on the plan).
  * `postinitfn` (function, optional) — Custom post-initialization function applied to the plan entity before returning.
* **Returns:** `Prefab` — A prefabricated plan item configured with appropriate components, tags, and animations.

## Events & listeners
None identified.