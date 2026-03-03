---
id: quagmire_recipebook
title: Quagmire Recipebook
description: Manages the discovery and network sync of Quagmire recipes, queueing and broadcasting recipe data across clients in the Quagmire DLC.
tags: [crafting, quagmire, network, recipe]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 5b2defe9
system_scope: crafting
---

# Quagmire Recipebook

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`QuagmireRecipeBook` is a server-authoritative component responsible for queuing and synchronizing discovered Quagmire recipes across the network. It stores recipe metadata (product name, dish type, station type, overcooked flag, and up to four ingredients) and ensures clients receive recipe data in order via a delay-based queue. It also handles Klump file loading for discovered recipes on clients when `QUAGMIRE_USE_KLUMP` is enabled.

This component does not define any public methods — it functions entirely through internal event handling and network variable updates. It must be attached to a server-owned entity (typically the world) to operate correctly.

## Usage example
```lua
-- Typically added to TheWorld in the Quagmire worldtype setup
TheWorld:AddComponent("quagmire_recipebook")

-- Recipe discovery is triggered on the server by pushing:
inst:PushEvent("ms_quagmirerecipediscovered", {
    recipe = {
        product = "quagmire_stew",
        dish = "bowl",
        station = "pot",
        overcooked = false,
        ingredients = { "quagmire_turnip_cooked", "quagmire_onion_cooked" },
    },
})
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `inst` (passed to constructor) | The entity instance the component is attached to. |

## Main functions
This component exposes no public methods. All functionality occurs through internal event handlers and network variable updates.

## Events & listeners
- **Listens to:**
  - `ms_quagmirerecipediscovered` (server only) — Received from `TheWorld`; enqueues a new recipe for sync.
  - `recipedirty` (client only) — Fired locally when a recipe completes sync; triggers Klump loading and event broadcasting.
- **Pushes:**
  - `quagmire_recipediscovered` — Broadcast on the client after a recipe is processed and displayed in the recipe book UI. Carries:
    - `product` (string)
    - `dish` (string: `"plate"` or `"bowl"`)
    - `station` (string: `"pot"`, `"oven"`, or `"grill"`)
    - `overcooked` (boolean)
    - `ingredients` (array of ingredient prefabs)
