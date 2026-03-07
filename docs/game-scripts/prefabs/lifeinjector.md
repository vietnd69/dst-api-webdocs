---
id: lifeinjector
title: Lifeinjector
description: A consumable inventory item that restores health to the player.
tags: [inventory, healing, consumable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a0607109
system_scope: inventory
---

# Lifeinjector

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`lifeinjector` is a prefabricated item that functions as a health-restoring consumable. It is represented in-game as a small, stackable medical device (e.g., an "L" shaped injector). The prefab combines several core components—`stackable`, `inspectable`, `inventoryitem`, and `maxhealer`—to enable inventory handling, stack limits, inspection UI, and healing behavior upon use.

## Usage example
```lua
-- Inside a prefab's OnFinished or elsewhere in the world:
local injector = SpawnPrefab("lifeinjector")
injector.Transform:SetPosition(x, y, z)

-- To use it for healing (typically done via interaction, not direct script call):
-- When picked up, it resides in inventory and is consumed through the "heal" action.
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `inventoryitem`, `maxhealer`, `transform`, `animstate`, `network`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxsize` (via `stackable` component) | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for this item. |

## Main functions
No custom public methods are defined on the `lifeinjector` prefab itself. It relies entirely on its component APIs:
- `inst.components.stackable` — handles stacking and size limits.
- `inst.components.inventoryitem` — enables placement in inventory.
- `inst.components.maxhealer` — defines healing behavior when consumed (see `components/maxhealer.lua` for details).
- `inst.components.inspectable` — provides inspect tooltip text (see `components/inspectable.lua`).

## Events & listeners
None identified on the `lifeinjector` prefab itself. Event handling occurs through its components (e.g., `maxhealer` may listen for use events like `onequip`, `onuse`, or `onenduse`).
