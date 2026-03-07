---
id: fishingnet
title: Fishingnet
description: Adds fishing net functionality and finite durability to the fishing net item, including visual equip animations and burn prevention.
tags: [inventory, equipment, durability]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 30a76ef1
system_scope: inventory
---

# Fishingnet

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `fishingnet` prefab defines the in-game fishing net item, an inventory-held tool with limited uses. It uses the `finiteuses` component to track durability, consuming one use per `CAST_NET` action. It integrates with the `equippable` component to manage visual states on the player (via `swap_object` and arm animations), and disables burning via the `burnable` component. The prefab also registers network replication, physics, and minimap support.

## Usage example
While this is a prefab definition (not a reusable component), modders can reference or extend its behavior by modifying the associated `fishingnet` component (not shown here) or by overriding its construction function. A typical instantiation occurs via the prefab system:

```lua
local net = TheWorld:SpawnPrefab("fishingnet")
net.components.finiteuses:SetUses(10) -- adjust remaining uses
```

## Dependencies & tags
**Components used:** `finiteuses`, `inventoryitem`, `fishingnet`, `inspectable`, `equippable`, `burnable`
**Tags:** Adds `allow_action_on_impassable` to the instance.

## Properties
No public properties defined directly in the constructor.

## Main functions
None.

## Events & listeners
None directly registered on the prefab instance. Event handling is delegated to components (`finiteuses`, `equippable`), which listen for and respond to internal events (e.g., `percentusedchange`, `onfinished`), but these are not exposed at the prefab level.
