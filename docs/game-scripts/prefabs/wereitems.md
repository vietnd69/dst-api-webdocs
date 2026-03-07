---
id: wereitems
title: Wereitems
description: Defines prefabs for were-beast-specific food items (beaver, moose, goose) that behave as hazardous, meat-based consumables with cursed effects.
tags: [consumable, cursed, inventory, prefabs]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: db093cd9
system_scope: inventory
---

# Wereitems

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wereitems.lua` file defines three Prefab constructors (`wereitem_beaver`, `wereitem_moose`, `wereitem_goose`) representing special food items unique to the Werebeast transformation state. These items are classified as *monstermeat*, *unsafefood*, and *wereitem*. When consumed by non-Curse Masters, they reduce health and sanity (as defined by `GetHealthFn` and `GetSanityFn`), but can be safely eaten by characters with the `cursemaster` tag. The prefabs are inventory items with stack support and various utility components (bait, tradable, inspectable, burnable, etc.).

## Usage example
```lua
local beaver_item =_prefab("wereitem_beaver")
local moose_item =_prefab("wereitem_moose")
local goose_item =_prefab("wereitem_goose")

-- To create an instance of a wereitem in-game
local inst = beaver_item()
inst.components.edible:IsMeat() -- returns true
inst.were_mode -- returns "beaver"
```

## Dependencies & tags
**Components used:** `edible`, `stackable`, `bait`, `tradable`, `inspectable`, `inventoryitem`.  
**Tags added:** `monstermeat`, `wereitem`, `unsafefood`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `were_mode` | string | `nil` | Specifies the were-beast variant (`"beaver"`, `"moose"`, or `"goose"`); set on the instance after creation. |
| `scrapbook_healthvalue` | number | `-TUNING.HEALING_MED` | Health change shown in scrapbook UI. |
| `scrapbook_sanityvalue` | number | `-TUNING.SANITY_MED` | Sanity change shown in scrapbook UI. |
| `scrapbook_anim` | string | `"idle_"..were_mode` | Animation name displayed in scrapbook UI. |

## Main functions
### `MakeWereItem(were_mode)`
*   **Description:** Factory function that returns a Prefab constructor for a specific wereitem variant (e.g., `"beaver"`). It configures the entity's visual, network, inventory, and functional components.
*   **Parameters:** `were_mode` (string) – identifies the item variant; affects animation and float physics.
*   **Returns:** A function that, when called, returns a fully initialized entity instance.
*   **Error states:** No explicit error handling; depends on correct `were_mode` input to resolve animation names.

## Events & listeners
None identified.