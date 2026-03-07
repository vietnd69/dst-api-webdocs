---
id: quagmire_goatkid
title: Quagmire Goatkid
description: Defines the Quagmire Goatkid character prefab, a shopkeeper NPC that provides trading functionality in the Quagmire biome.
tags: [npc, shop, character, quagmire, trader]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 21f80fb4
system_scope: entity
---

# Quagmire Goatkid

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_goatkid` is a prefab definition for a non-player character (NPC) that serves as a trader in the Quagmire biome. It establishes the visual, audio, and basic behavior attributes for the entity, including physics, animation, and talker integration for dialogue. It is intended to be used as an NPC with the `character` tag, enabling standard character behaviors and interactions. The prefab registers a server-side post-initialization hook (`master_postinit`) to populate additional multiplayer-critical logic and child prefabs.

## Usage example
```lua
-- Typical usage is internal to the game via Prefab system; not meant for direct modder instantiation.
-- However, a mod could spawn it as follows:
local inst = Prefab("quagmire_goatkid")()
inst:AddTag("character")
inst:AddComponent("talker")
inst.components.talker.fontsize = 35
inst.components.talker.font = TALKINGFONT
inst.components.talker.offset = Vector3(0, -400, 0)
inst.components.talker:MakeChatter()
```

## Dependencies & tags
**Components used:** `talker`  
**Tags:** Adds `character` to the instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `quagmire_shoptab` | enum (`QUAGMIRE_RECIPETABS`) | `QUAGMIRE_RECIPETABS.QUAGMIRE_TRADER_KID` | Identifies this NPC’s tab in the Quagmire trading UI. |

## Main functions
### Constructor (`fn`)
*   **Description:** Constructs and configures the Quagmire Goatkid entity. Sets up animation state, physics, talker, and network properties. On the server, invokes `master_postinit` for additional setup.
*   **Parameters:** None — this is a factory function passed to `Prefab(...)`.
*   **Returns:** The configured `inst` entity.
*   **Error states:** Returns early on clients (if `TheWorld.ismastersim` is `false`) after setting up non-essential components; server-side initialization continues after `master_postinit` call.

### `inst.components.talker:MakeChatter()`
*   **Description:** Initializes the talker chatter structure, enabling speech functionality. Must be called after assigning talker properties like `font`, `fontsize`, and `offset`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No direct failure modes documented; assumes `inst.components.talker` exists.

## Events & listeners
- **Listens to:** None explicitly in this file (server-side `master_postinit` may register additional listeners).
- **Pushes:** None explicitly in this file.

## Connected components
- `talker`: Used to configure speech appearance (`font`, `fontsize`, `offset`) and enable chatter via `MakeChatter()`.