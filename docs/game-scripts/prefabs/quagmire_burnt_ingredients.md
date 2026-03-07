---
id: quagmire_burnt_ingredients
title: Quagmire Burnt Ingredients
description: Defines the prefab asset data for burnt ingredients used in Quagmire-related crafting.
tags: [crafting, quagmire, item]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4e413a54
system_scope: crafting
---

# Quagmire Burnt Ingredients

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_burnt_ingredients` is a simple prefab definition for a game item used in Quagmire-specific crafting recipes. It serves as a data container that loads the associated asset definition via `event_server_data`, ensuring the item is available in multiplayer and server-authoritative contexts. This prefab does not implement custom logic—it acts as a reference stub for the underlying item asset.

## Usage example
Typically, this prefab is referenced indirectly via recipe definitions or loot tables and is not directly instantiated by modders. However, for reference, the underlying structure is as follows:

```lua
local inst = Prefab("quagmire_burnt_ingredients", fn)
-- Instancing is handled automatically when the game loads the prefab
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties.

## Main functions
Not applicable.

## Events & listeners
Not applicable.