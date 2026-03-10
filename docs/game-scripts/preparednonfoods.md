---
id: preparednonfoods
title: Preparednonfoods
description: Provides a list of non-prefab crock pot recipes that reference externally defined prefabs.
tags: [cooking, recipe, food]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 213ab931
system_scope: crafting
---

# Preparednonfoods

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`preparednonfoods.lua` defines a static list of crock pot recipe configurations for items that are *not* implicitly turned into prefabs during cooking. These recipes reference prefabs that must already exist elsewhere in the codebase (e.g., `batnosehat`, `dustmeringue`). Each entry specifies test conditions, cooking parameters, visual properties, and nutrition/sanitation stats used by the cookbook UI. This file is not a component and does not attach to entities; it is a module returning a table of recipes for use by the cooking system.

## Usage example
This file is not used directly as a component. Instead, it is loaded and referenced by the cooking subsystem:
```lua
-- In a cooking-related script (e.g., cookpot.lua):
local PreparedNonFoods = require "prepreparednonfoods"
-- Add nonfood recipes to the main recipe list:
local all_recipes = CombineRecipes(PreparedFoods, PreparedNonFoods)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties. The module returns a global `items` table (local to the file) containing recipe entries.

## Main functions
None identified. This file only defines and returns a static data table.

## Events & listeners
None identified.