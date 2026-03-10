---
id: item_blacklist
title: Item Blacklist
description: Defines display and unlock rules for special-item skins in the game, including blacklisted items, hidden decorations, event-locked skins, and unlockable skins.
tags: [inventory, ui, event]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 916953cf
system_scope: inventory
---

# Item Blacklist

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This file defines global tables that control how certain items (primarily skins and decorative variants) are handled in the UI and inventory system. It does not define a component, but rather serves as a static data registry used by other parts of the game (e.g., inventory UI, account item systems) to determine visibility, locking, and display behavior of entity-based item prefabs.

The primary tables are:
- `ITEM_DISPLAY_BLACKLIST`: Items that should not appear in standard UI lists or crafting displays.
- `HIDE_SKIN_DECORATIONS`: A subset of items treated as non-skin decorations (e.g., furniture) and excluded from skin selection UI.
- `SKINS_EVENTLOCK`: Items tied to specific seasonal or limited-time events; these are only available when the event is active.
- `UNLOCKABLE_SKINS`: Reserved for future or mod-controlled unlockable skins (currently empty).

## Usage example
This file does not expose a component API and is not added to entities. Instead, it is referenced directly by other systems (e.g., UI screens or account item logic). Example usage by other scripts:

```lua
if ITEM_DISPLAY_BLACKLIST[skin_name] then
    -- Skip displaying this item in skin pickers or trade UI
end

if SKINS_EVENTLOCK[skin_name] and not IsEventActive(SKINS_EVENTLOCK[skin_name]) then
    -- Lock this item in the UI until the event is active
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties. This file only defines module-level global tables.

## Main functions
No functions are defined. The file exports only data tables.

## Events & listeners
Not applicable.