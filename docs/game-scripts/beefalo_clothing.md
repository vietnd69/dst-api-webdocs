---
id: beefalo_clothing
title: Beefalo Clothing
description: Defines predefined skin configurations for Beefalo character customization, mapping cosmetic variants to mesh/symbol overrides and metadata.
tags: [visual, cosmetic, customization]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 6da6bb3c
system_scope: entity
---

# Beefalo Clothing

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This file is a static data definition (`BEEFALO_CLOTHING`) that enumerates all playable Beefalo skin variants in the game. Each entry specifies visual attributes such as mesh type, associated tags, symbol overrides, rarity, and release group. It also precomputes two lookup tables — `BEEFALO_CLOTHING_SYMBOLS` and `BEEFALO_HIDE_SYMBOLS` — to accelerate symbol-based lookups during rendering or skin application.

It does not implement any runtime logic or component behavior. Instead, it serves as a reference dataset for UI and rendering systems (e.g., the account item system) to validate, group, or present skins.

## Usage example
```lua
-- Access a specific Beefalo skin configuration
local skin = BEEFALO_CLOTHING.beefalo_head_lunar
-- skin.type == "beef_head"
-- skin.symbol_overrides contains all symbol names to override
-- skin.rarity == "Elegant"
-- skin.rarity_modifier == "Woven"

-- Check if a symbol is used as an override anywhere
if BEEFALO_CLOTHING_SYMBOLS["beefalo_beard"] then
    -- Symbol is used as an override in at least one skin
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds no tags; uses only data structures.  
**Internal constants referenced:**  
- `BEEFALO_CLOTHING`: The top-level table of skin definitions.  
- `BEEFALO_CLOTHING_SYMBOLS`: Set of all override symbol names.  
- `BEEFALO_HIDE_SYMBOLS`: Set of all symbols marked for hiding in at least one skin.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `BEEFALO_CLOTHING` | table | (see source) | Key-value map of skin names (e.g., `"beefalo_body_lunar"`) to skin definition objects. |
| `BEEFALO_CLOTHING_SYMBOLS` | table | empty table | Set (boolean-valued map) of all symbol names appearing in any `symbol_overrides` list. |
| `BEEFALO_HIDE_SYMBOLS` | table | empty table | Set (boolean-valued map) of all symbol names appearing in any `symbol_hides` list. |

## Main functions
None identified — this file defines only static data tables and a pre-computation loop.

## Events & listeners
None identified — no events are listened to or pushed.