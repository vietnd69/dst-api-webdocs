---
id: tacklecontainer_fishing
title: Tacklecontainer Fishing
description: Populates a fishing tackle container with randomized fishing bobbers and lures upon creation.
tags: [fishing, loot, container, scenario]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 6597c0ad
system_scope: inventory
---

# Tacklecontainer Fishing

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Tacklecontainer Fishing` is a scenario helper that defines and applies loot to a fishing tackle container when it is created. It specifies fixed sets of fishing items (bobbers and lures) and assigns random quantities to each via helper functions. It integrates with the `chestfunctions` module to populate the container’s inventory. This is used exclusively in world generation or spawn contexts where tackle containers appear (e.g., piers or starting areas).

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("container")
inst:AddTag("fishingtackle")
inst:AddComponent("inventory")
inst:AddComponent("loot")
inst.components.loot:OnOpen(function() end)

require("scenarios/tacklecontainer_fishing").OnCreate(inst, nil)
```

## Dependencies & tags
**Components used:** `loot`, `inventory`, `container` (via `chestfunctions.AddChestItems`)
**Tags:** None directly managed — relies on caller to ensure entity has appropriate tags and components (`loot`, `inventory`, `container`).

## Properties
No public properties.

## Main functions
### `OnCreate(inst, scenariorunner)`
* **Description:** Populates the given entity’s inventory with randomized fishing tackle items (bobbers and lures) by calling `chestfunctions.AddChestItems`.
* **Parameters:**
  * `inst` (entity) — The container entity to populate. Must have `loot` and `inventory` components.
  * `scenariorunner` (any) — Unused in this implementation; included for API compatibility with scenario hooks.
* **Returns:** Nothing.

## Events & listeners
None.