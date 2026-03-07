---
id: skilltree_wilson
title: Skilltree Wilson
description: Defines the full skill tree structure for Wilson, including skill nodes, unlock conditions, groupings, visual positions, and activation logic.
tags: [skilltree, character, crafting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7b2b9840
system_scope: entity
---

# Skilltree Wilson

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file exports a function (`BuildSkillsData`) that constructs and returns Wilson’s skill tree definition. The returned data includes all skill nodes (`SKILLS`) with metadata such as titles, descriptions, icons, positions, groupings, tags, connectivity, and activation/deactivation handlers, plus an ordering (`ORDERS`) used to render the skill tree UI. It defines unlock conditions via custom lock-check functions and integrates with systems like `beard`, `damagetyperesist`, and `damagetypebonus` on skill activation.

## Usage example
```lua
local BuildSkillsData = require "prefabs/skilltree_wilson"
local skilltree_data = BuildSkillsData(SkillTreeFns)
-- Access skill definitions:
local torch_skills = skilltree_data.SKILLS
local order = skilltree_data.ORDERS
```

## Dependencies & tags
**Components used:** `beard`, `damagetyperesist`, `damagetypebonus`
**Tags:** Adds tags dynamically per skill, including `alchemy`, `torch`, `beard`, `allegiance`, `lock`, `shadow`, `lunar`, `shadow_favor`, `lunar_favor`.

## Properties
No public properties are exposed at the top level. `BuildSkillsData` is a factory function.

## Main functions
### `BuildSkillsData(SkillTreeFns)`
* **Description:** Builds and returns the full skill tree definition for Wilson, including all skill nodes and the rendering order. `SkillTreeFns` is an object containing helper functions such as `CountSkills` and `CountTags`.
* **Parameters:** 
  * `SkillTreeFns` (table) – Helper module providing utility functions like `CountSkills(prefabname, activatedskills)` and `CountTags(prefabname, tag, activatedskills)`.
* **Returns:** 
  * `table` – A table with two keys:
    * `SKILLS` (table): A map of skill IDs to skill definitions.
    * `ORDERS` (table): An ordered list of groups with relative positions for UI layout.
* **Error states:** None beyond runtime errors (e.g., if `SkillTreeFns` is missing required functions).

## Events & listeners
None identified. This file is purely a data definition and does not listen to or push events directly. Event-related behavior (e.g., `onactivate`) is embedded in skill definitions and invoked by the skill tree system.