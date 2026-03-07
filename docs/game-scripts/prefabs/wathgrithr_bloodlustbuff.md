---
id: wathgrithr_bloodlustbuff
title: Wathgrithr Bloodlustbuff
description: A visual effect prefab that appears during Wathgrithr's bloodlust mechanic in the Lava Arena event, providing distinct visual feedback for self and other targets.
tags: [fx, event, lavaarena, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a409f17c
system_scope: fx
---

# Wathgrithr Bloodlustbuff

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wathgrithr_bloodlustbuff` is a prefab factory that creates two distinct visual effect entities used during Wathgrithr's bloodlust mechanic in the Lava Arena event. It generates two separate prefabs — one for self-targeted effects and one for other-targeted effects — each with unique animation banks, scale parameters, and post-initialization behavior via the `lavaarena` event system. These prefabs are non-interactive FX decorated with `DECOR` and `NOCLICK` tags.

## Usage example
```lua
local selfbuff = Prefab("wathgrithr_bloodlustbuff_self")
local otherbuff = Prefab("wathgrithr_bloodlustbuff_other")

-- In event code (e.g. during boss mechanic):
local inst = SpawnPrefab("wathgrithr_bloodlustbuff_self")
inst.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `animstate`, `transform`, `network`  
**Tags:** Adds `DECOR` and `NOCLICK`; does not check or remove any tags.

## Properties
No public properties

## Main functions
### `MakeBuff(name, build, scale, offset)`
* **Description:** A factory function that constructs and returns a `Prefab` definition for a bloodlust visual effect. Handles asset loading, component attachment, animation setup, scale, color, and event-driven master-side initialization.
* **Parameters:**  
  `name` (string) — the prefab name (e.g., `"wathgrithr_bloodlustbuff_self"`).  
  `build` (string) — the animation bank and build name (e.g., `"lavaarena_attack_buff_effect"`).  
  `scale` (number) — uniform scale factor applied to the entity.  
  `offset` (number) — passed to `master_postinit` for positioning adjustments.
* **Returns:** `Prefab` — a fully configured prefab instance.
* **Error states:** Returns early on client without calling `master_postinit` (if `TheWorld.ismastersim` is false).

## Events & listeners
- **Pushes:** `event_server_data("lavaarena", "prefabs/wathgrithr_bloodlustbuff").master_postinit(inst, offset)` — server-side event hook used during master initialization to set up event-specific logic.