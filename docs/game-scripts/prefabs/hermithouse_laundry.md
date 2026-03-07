---
id: hermithouse_laundry
title: Hermithouse Laundry
description: Factory function that generates prefabs for laundry items used in the Hermithouse environment.
tags: [prefabs, world, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7e0adf39
system_scope: world
---

# Hermithouse Laundry

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`hermithouse_laundry.lua` is a factory function that generates twoPrefab instances: `hermithouse_laundry_socks` and `hermithouse_laundry_shorts`. These prefabs represent decorative laundry items placed in the Hermithouse room. The function configures visual, physics, and network properties, and attaches necessary components for in-game interaction (e.g., inspection, inventory, hauntable behavior). It relies on external prefabs for fx visual effects and uses standard DST utility functions for inventory physics and floatable behavior.

## Usage example
```lua
-- This file is a prefab factory and not directly instantiated by modders.
-- It is called internally via its return value:
-- return MakeLaundry("hermithouse_laundry_socks"),
--        MakeLaundry("hermithouse_laundry_shorts")
-- Modders would reference the resulting prefabs by name (e.g., "hermithouse_laundry_socks").
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `transform`, `animstate`, `network`
**Tags:** Adds `hermithouse_ornament` and `hermithouse_laundry`

## Properties
No public properties.

## Main functions
### `MakeLaundry(name)`
*   **Description:** Factory function that constructs and returns a Prefab definition for a laundry item with the specified `name`.
*   **Parameters:** `name` (string) – Base name for the prefab (e.g., `"hermithouse_laundry_socks"`), used for asset lookup and animation bank/build.
*   **Returns:** `Prefab` – A Prefab definition configured for the given name.
*   **Error states:** None. Non-master simulation instances return early with minimal setup (network proxy only).

## Events & listeners
None identified.