---
id: bathbomb
title: Bathbomb
description: Marks an entity as a bath bomb item by adding the 'bathbomb' tag.
tags: [inventory, fx]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 5356e9d9
system_scope: inventory
---

# Bathbomb

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `bathbomb` component simply tags an entity as a bath bomb. It serves as a lightweight marker for identification purposes within the game system, enabling other logic (e.g., crafting, usage, or interaction handlers) to recognize and interact with bath bombs via tag checks.

## Usage example
```lua
local inst = Prefab("bathbomb")
inst:AddComponent("bathbomb")
-- Now inst:HasTag("bathbomb") will return true
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `bathbomb`; removes `bathbomb` on component removal.

## Properties
No public properties

## Main functions
### `OnRemoveFromEntity()`
*   **Description:** Removes the `bathbomb` tag from the entity when the component is detached (e.g., on item discard or destruction).
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None identified
