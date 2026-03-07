---
id: quagmire_traders
title: Quagmire Traders
description: Defines two distinct NPC trader prefabs (Merm Trader 1 and 2) for the Quagmire biome with shared behavior and inventory mappings.
tags: [npc, trading, quagmire, prefab]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 154287e1
system_scope: entity
---

# Quagmire Traders

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
This file defines two prefabs (`quagmire_trader_merm` and `quagmire_trader_merm2`) representing NPC traders in the Quagmire biome. It uses a shared `commonfn` to set up core visual and network properties, and separate factory functions (`mermfn` and `merm2fn`) to configure distinct builds, physics, and inventory tabs. The prefabs integrate with the Quagmire trading system via `quagmire_shoptab` and trigger `master_postinit` callbacks for server-side setup.

## Usage example
```lua
-- Example: Creating a Quagmire merm trader instance
local trader = Prefab("quagmire_trader_merm", mermfn, assets, prefabs_merm)
local inst = trader()

-- Example: Creating a Quagmire merm trader 2 instance
local trader2 = Prefab("quagmire_trader_merm2", merm2fn, assets, prefabs_merm2)
local inst2 = trader2()
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `soundemitter`, `dynamicshadow`, `network`, `talker`  
**Tags:** `character`

## Properties
No public properties.  
The prefabs configure `talker.fontsize`, `talker.font`, and `talker.offset` during construction, but these are not exposed as direct properties of this file's factory functions.

## Main functions
### `commonfn(common_init)`
* **Description:** Shared factory function that initializes core entity components, animations, physics, and network state for both trader variants. Calls `common_init` (if provided) for variant-specific setup. Returns the fully initialized entity or early-exits on non-master clients.
* **Parameters:** `common_init` (function?) — optional callback to run after base setup for variant-specific configuration.
* **Returns:** `inst` (entity) — the initialized entity, or only on master simulation.
* **Error states:** Returns early without calling `master_postinit` on non-master clients.

### `mermfn()`
* **Description:** Factory for the first Merm Trader variant (`quagmire_trader_merm`). Configures build `"merm_trader1_build"`, obstacle physics with scale `1`, and assigns the `QUAGMIRE_TRADER_MERM1` recipe tab. Delegates to `commonfn` for base setup.
* **Parameters:** None.
* **Returns:** `inst` (entity) — the initialized entity with variant-specific properties.
* **Error states:** Returns early on non-master clients.

### `merm2fn()`
* **Description:** Factory for the second Merm Trader variant (`quagmire_trader_merm2`). Configures build `"merm_trader2_build"`, obstacle physics with scale `0.5`, and assigns the `QUAGMIRE_TRADER_MERM2` recipe tab. Delegates to `commonfn` for base setup.
* **Parameters:** None.
* **Returns:** `inst` (entity) — the initialized entity with variant-specific properties.
* **Error states:** Returns early on non-master clients.

## Events & listeners
- **Listens to:** `chatterdirty` — registered in `Talker:MakeChatter()` for client-side sync (via `inst:ListenForEvent` on non-master).
- **Pushes:** No direct events. Triggers external `event_server_data("quagmire", "prefabs/quagmire_traders").master_postinit(...)`, `master_postinit_merm(...)`, and `master_postinit_merm2(...)` on the server.

## Additional notes
- Asset dependencies: `"anim/merm_trader1_build.zip"`, `"anim/merm_trader2_build.zip"`, `"anim/ds_pig_basic.zip"`, `"anim/ds_pig_actions.zip"`.
- Predefined item lists `prefabs_merm` and `prefabs_merm2` specify inventory contents for each trader variant.
- ` inst.AnimState:Hide("ARM_carry_up")` hides an arm bone for visual consistency.
- Both prefabs are pristined (`SetPristine()`) and support network replication via `AddNetwork()`.
- Physics is set using `MakeObstaclePhysics`, indicating the traders are solid to players and other entities.