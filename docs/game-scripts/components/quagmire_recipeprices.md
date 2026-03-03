---
id: quagmire_recipeprices
title: Quagmire Recipeprices
description: Manages the cooking recipe appraisal queue and network synchronization of recipe prices, dish types, and craving matches for Quagmire mode.
tags: [quagmire, crafting, network, queue]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 48b2c48c
system_scope: crafting
---

# Quagmire Recipeprices

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`QuagmireRecipeprices` handles the queuing and replication of cooking recipe appraisal results in Quagmire mode. It is attached to the `quagmire_klumprecipe` entity and maintains a priority queue (`_queue`) of recipe appraisals on the master simulation. It synchronizes appraisal data (recipe name, dish type, coin values, matched craving, etc.) to clients via network variables and triggers the client-side rendering and logging of appraisal results. This component acts as a centralized channel for Recipe Appraisal event propagation within the Quagmire recipe workflow.

## Usage example
```lua
-- Typically attached to the klump recipe entity automatically.
-- No direct manual use is required; however, the master sim triggers appraisals:
inst:PushEvent("ms_quagmirerecipeappraised", {
    product = "cheese",
    dish = "bowl",
    silverdish = false,
    maxvalue = true,
    matchedcraving = "cheese",
    snackpenalty = false,
    coins = {1, 0, 2, 0},
})
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `quagmire_klumprecipe` (via `inst:AddTag("quagmire_klumprecipe")` elsewhere in the prefab).  
**Network variables:** Uses `net_string`, `net_tinybyte`, `net_bool`, `net_smallbyte` for replication.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GUID`-owned entity | `inst` passed to constructor | Reference to the entity this component is attached to. |

*Note:* All other member variables are private and prefixed with `_`.

## Main functions
No public functions are exposed. This component is entirely internal and event-driven.

## Events & listeners
- **Listens to:**
  - `ms_quagmirerecipeappraised` *(only on master simulation)*: Triggers queuing of a recipe appraisal. Called by `quagmire_klumprecipe` when a player completes an appraisal action. Data includes `product`, `dish`, `coins`, `matchedcraving`, etc.
  - `recipedirty` *(only on clients)*: Fired internally via `inst:PushEvent("recipedirty")` when a recipe entry is fully synchronized, prompting client-side logging and `quagmire_recipeappraised` event propagation.

- **Pushes:**
  - `quagmire_recipeappraised` *(only on clients)*: Broadcasts with the fully resolved appraisal data: `product`, `dish`, `silverdish`, `maxvalue`, `matchedcraving`, `snackpenalty`, and `coins`. Used by UI and analytics systems.

*Note:* `_queue` and `_secrets` are master-only and never replicated. `_recipename`, `_klumpkey`, `_dish`, `_silverdish`, `_maxvalue`, `_matchedcraving`, `_snackpenalty`, and `_coins` are replicated net-variables.
