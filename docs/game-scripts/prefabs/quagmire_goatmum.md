---
id: quagmire_goatmum
title: Quagmire Goatmum
description: Creates the Quagmire Goatmum character prefab with animation, physics, sound, network, and talker components configured for in-game interaction.
tags: [npc, character, quagmire, commerce, dialogue]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ce96e745
system_scope: entity
---

# Quagmire Goatmum

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `quagmire_goatmum` prefab defines the Quagmire Goatmum character entity. It includes all necessary entity components (transform, animation, sound, shadow, network) and configuration for dialogue (`talker`), visual scaling, and shop-related data (`quagmire_shoptab`). It is initialized only on the server in DST and defers to a shared `master_postinit` function for further setup.

## Usage example
```lua
-- Internal usage only — the prefab is registered and instantiated via:
local assets = { ... }
local prefabs = { ... }
local function fn()
    local inst = CreateEntity()
    -- ... configuration ...
    return inst
end
return Prefab("quagmire_goatmum", fn, assets, prefabs)
```

## Dependencies & tags
**Components used:** `talker`, `transform`, `animstate`, `soundemitter`, `dynamicshadow`, `network`
**Tags:** Adds `character`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `quagmire_shoptab` | enum | `QUAGMIRE_RECIPETABS.QUAGMIRE_TRADER_MUM` | Shop tab identifier used to associate this entity with Quagmire trader UI. |

## Main functions
### `fn()`
* **Description:** Constructor function returning the fully configured `quagmire_goatmum` prefab instance. Sets up physics, animations, scaling, talker, and calls `master_postinit` on the master simulation.
* **Parameters:** None (used internally by the prefab system).
* **Returns:** `inst` (EntityInstance) — configured entity, or the same entity without server-side initialization on clients.
* **Error states:** None. Client returns early after basic setup; server continues to call `master_postinit`.

## Events & listeners
None identified.

## External component usage
The `talker` component is added and configured as follows:
- `inst.components.talker.fontsize = 35`
- `inst.components.talker.font = TALKINGFONT`
- `inst.components.talker.offset = Vector3(0, -400, 0)`
- `inst.components.talker:MakeChatter()` is called to initialize the chatter structure.