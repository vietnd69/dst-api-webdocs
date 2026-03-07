---
id: spider_mutators
title: Spider Mutators
description: Generates prefabs for spider mutator items, each representing a specific spider subtype and enabling mutation of spider entities when consumed.
tags: [spider, item, mutation, consumable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f73968eb
system_scope: entity
---

# Spider Mutators

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines a factory pattern to generate multiple `spider_*` mutator prefabs (e.g., `mutator_warrior`, `mutator_water`) used to mutate spiders in DST. Each mutator is a wearable/usable item that, when applied via the `spidermutator` component, targets a specific spider subtype. It integrates with `edible`, `fuel`, `stackable`, and `hauntable` systems to provide gameplay utility.

## Usage example
```lua
-- Example: Creating and using a water spider mutator
local mutator = Prefab("mutator_water")
if mutator ~= nil then
    local inst = SpawnPrefab("mutator_water")
    -- inst is an edible item that, when consumed by a spider, mutates it into a water spider
    inst.components.spidermutator:SetMutationTarget("spider_water")
end
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`, `edible`, `spidermutator`, `fuel`, `burnable`  
**Tags:** Adds `spidermutator`, `monstermeat`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_anim` | string | `mutator_target` | Animation name used in scrapbook UI. |
| `scrapbook_deps` | table of strings | `{"spider_<target>"}` | List of prefabs required as dependencies in scrapbook. |

## Main functions
### `MakeMutatorFn(mutator_target, extra_data)`
*   **Description:** Constructs and configures a mutator entity for a given spider subtype. Sets up visuals, network state, inventory behavior, and gameplay properties (edibility, fuel value, etc.).
*   **Parameters:**  
    * `mutator_target` (string) – Target spider type suffix (e.g., `"water"`, `"warrior"`).  
    * `extra_data` (table or `nil`) – Optional override for anim bank/build (e.g., `{"bank": "...", "build": "..."}`).
*   **Returns:** `inst` (Entity) – Fully configured prefab instance.
*   **Error states:** No explicit error handling; relies on valid `mutator_target` strings.

## Events & listeners
None identified.