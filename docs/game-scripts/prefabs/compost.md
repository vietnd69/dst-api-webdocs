---
id: compost
title: Compost
description: Provides a deployable, burnable compost item that acts as a fertilizer with defined nutrient content and fuel properties.
tags: [fertilizer, fuel, inventory, deployable, environmental]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7511f356
system_scope: environment
---

# Compost

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`compost` is a prefab (not a standalone component) that defines an item usable as both fertilizer and fuel. It is intended to be placed on farmable soil to enrich it and can also be burned in campfires or similar fuel sources. It leverages several existing components (`fertilizer`, `fuel`, `smotherer`, `fertilizerresearchable`, `burnable`, `deployablefertilizer`) and integrates with the world's farming and combustion systems. The prefab is created via a factory function `fn` and returns a `Prefab` definition for use in the game.

## Usage example
```lua
local compost = SpawnPrefab("compost")
compost.Transform:SetPosition(x, y, z)
-- The compost will automatically behave as a deployable fertilizer
-- and fuel item with configured properties.
```

## Dependencies & tags
**Components used:** `burnable`, `fertilizer`, `fertilizerresearchable`, `fuel`, `inspectable`, `inventoryitem`, `smotherer`, `stackable`, `deployablefertilizer`, `hauntable`
**Tags:** Adds `fertilizerresearchable`.

## Properties
No public properties are defined in the `compost` prefab itself. Nutrient values, fuel value, and fertilizer behavior are configured via component properties on the master instance.

## Main functions
The `compost` prefab does not expose public methods beyond those provided by its components. Custom functions defined locally (e.g., `FuelTaken`, `GetFertilizerKey`, `fertilizerresearchfn`) are not part of the public API.

## Events & listeners
- **Listens to:** None directly. Event handling is delegated to components (`fuel`, `burnable`, etc.).
- **Pushes:** None directly. Component-internal events may be fired, but none are pushed by this prefab's logic.