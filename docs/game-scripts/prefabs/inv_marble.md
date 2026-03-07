---
id: inv_marble
title: Inv Marble
description: Represents a small, throwable marble item that acts as mole bait andquake debris.
tags: [bait, item, physics]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5edd5bc0
system_scope: inventory
---

# Inv Marble

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`inv_marble` defines the marble prefab—a small, throwable item used as mole bait and as debris generated during earthquakes. It integrates with multiple core systems including inventory, stacking, inspection, and bait functionality. The prefab uses standard visual and audio components, and includes physics for pickup and interaction.

## Usage example
```lua
local inst = TheWorld:PushPrefab("marble")
inst.Transform:SetPosition(x, y, z)
inst.components.inventoryitem:OnDrop()
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `inventoryitem`, `snowmandecor`, `bait`  
**Tags:** `molebait`, `quakedebris`

## Properties
No public properties.

## Main functions
Not applicable.

## Events & listeners
Not applicable.
