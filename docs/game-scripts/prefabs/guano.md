---
id: guano
title: Guano
description: A consumable and deployable item that acts as a high-value fertilizer and fuel, spawning fly companions when dropped and producing a poison cloud when burned or used as fuel.
tags: [fertilizer, fuel, environment, inventory, craftable]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 871614c5
system_scope: environment
---

# Guano

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`guano` is a gameplay item prefab that functions as a multi-purpose resource: it serves as a fertile soil enhancer (fertilizer), a decent fuel source, and can be dropped onto farms to cultivate soil. It spawns a `flies` child entity when dropped on the ground (attracting pests), which is removed when picked up. The prefab integrates with several systems including inventory, fuel, fertilizer, burnable, and deployable mechanisms.

## Usage example
```lua
local guano = SpawnPrefab("guano")
guano.Transform:SetPosition(world_position)
-- Guano will automatically gain fertilizer and fuel capabilities via its default config
-- Drops will spawn a "flies" child and pickup removes it
```

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`, `fertilizerresearchable`, `fertilizer`, `smotherer`, `fuel`, `burnable`, `smolder`, `deployablefertilizer`, `savedscale`, `inspectable`, `soundemitter`, `animstate`, `transform`, `network`
**Tags:** Adds `fertilizerresearchable`, `burnable`, `smolderer`, `deployablefertilizer`, `smotherer`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `flies` | Entity or `nil` | `nil` | Reference to the spawned "flies" child entity; only present when on the ground. |
| `scrapbook_anim` | string | `"idle"` | Animation state used for scrapbook preview. |
| `GetFertilizerKey` | function | `GetFertilizerKey` | Returns `inst.prefab`; used to identify fertilizer type in research. |

## Main functions
### `GetFertilizerKey(inst)`
* **Description:** Returns the unique key identifying this fertilizer type, used for research and matching against nutrient definitions.
* **Parameters:** `inst` (Entity) — the guano instance.
* **Returns:** `"guano"` (string), matching the prefab name.
* **Error states:** None.

### `fertilizerresearchfn(inst)`
* **Description:** Wrapper that delegates to `GetFertilizerKey(inst)` for research UI binding.
* **Parameters:** `inst` (Entity) — the guano instance.
* **Returns:** String key (e.g., `"guano"`).
* **Error states:** None.

## Events & listeners
- **Listens to:** None explicitly registered via `inst:ListenForEvent`.
- **Pushes:** None explicitly fired via `inst:PushEvent`.
