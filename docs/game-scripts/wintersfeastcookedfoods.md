---
id: wintersfeastcookedfoods
title: Wintersfeastcookedfoods
description: Defines configuration data for Wintersfeast festive foods, including cooking times and metadata used by the cooking system.
tags: [crafting, food, event]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 951be5ca
system_scope: crafting
---

# Wintersfeastcookedfoods

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`wintersfeastcookedfoods` is a static data module that declares the cooking configuration for all Wintersfeast-themed cooked foods. It exports a table containing a `foods` key, which maps food names to their respective settings (primarily `cooktime`). This data is consumed by the cooking system to validate recipes and determine preparation duration when preparing festive dishes during the Wintersfeast event.

## Usage example
```lua
local WintersfeastCookedFoods = require "wintersfeastcookedfoods"
for name, data in pairs(WintersfeastCookedFoods.foods) do
    print(name .. ": cooktime = " .. data.cooktime .. "s")
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `foods` | table | *(see below)* | A dictionary mapping food keys (e.g., `"roastturkey"`) to configuration tables containing `cooktime` and optional overrides. |

### `foods` contents
Each entry has the following structure:
| Key | Type | Description |
|-----|------|-------------|
| `cooktime` | number | Cooking duration in seconds (used by the cooking pot or similar appliances). |
| `name` | string | Auto-assigned from the table key (`k`) during initialization; used for identification. |

## Main functions
No public methods are defined in this module — it is purely a data container.

## Events & listeners
None identified