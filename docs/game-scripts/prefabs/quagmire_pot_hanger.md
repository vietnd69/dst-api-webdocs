---
id: quagmire_pot_hanger
title: Quagmire Pot Hanger
description: A decorative and functional lighting fixture that mounts on firepits and triggers visual steam effects when activated.
tags: [environment, fx, lighting, quagmire]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c02157f2
system_scope: environment
---

# Quagmire Pot Hanger

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_pot_hanger` is a prefabricated item entity used to hang Quagmire-style pot hangers from firepits. It functions as a visual attachment that appears above firepits and triggers steam effects via a client-side event. The component has two associated prefabs: the hanger itself (`quagmire_pot_hanger`) and its inventory item form (`quagmire_pot_hanger_item`). It integrates with the firepit entity by registering itself in the firepit's `highlightchildren` list for rendering purposes.

## Usage example
```lua
-- Example: Creating a pot hanger and attaching it to a firepit
local hanger = Prefab("quagmire_pot_hanger")
local firepit = TheWorld:FindEntityWithTag("firepit")
firepit:PushEvent("addhighlightchild", { child = hanger })
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `FX`, `NOCLICK` to the visual steam effect entity; sets `NOCLICK` on the main hanger.

## Properties
No public properties.

## Main functions
Not applicable — this file defines prefabs (via `fn()` and `itemfn()`), not a reusable component class with methods.

## Events & listeners
- **Listens to:** `quagmire_pot_hanger._steam` — triggers the `OnPotSteam` effect on the client.
- **Pushes:** 
  - `addhighlightchild` — indirectly via `event_server_data(...).master_postinit(...)` calling `AddHighlightChildren`.
  - `quagmire_pot_hanger._steam` — fired over the network (`net_event`) to request the steam FX.
- **Cleanup:** Removes itself from parent’s `highlightchildren` list on removal via `OnRemoveEntity`.
