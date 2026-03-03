---
id: playerinspectable
title: Playerinspectable
description: Syncs player equipment and skill selections to the network for client-side rendering of character appearance.
tags: [network, player, equipment, skills]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f49dfbc1
system_scope: network
---

# Playerinspectable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PlayerInspectable` is a server-side component responsible for synchronizing player equipment (e.g., skins/overrides) and active skill selections across the network in Don't Starve Together. It listens for equip/unequip events and skill-related events, then forwards the relevant data to `inst.Network` so clients can render the correct character appearance. This component is typically added to player prefabs to ensure equipment and skill states are visible to all players.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("playerinspectable")
-- The component is now active and will automatically sync:
--   - Equipment changes via "equip"/"unequip" events
--   - Skill selection changes via "onactivateskill_server", etc.
```

## Dependencies & tags
**Components used:** None (explicitly accesses `inst.Network`, `inst.components.skilltreeupdater`)  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `Class(function(self, inst) ... end)`
*   **Description:** Constructor for `PlayerInspectable`. Registers event listeners for equip/unequip and skill selection events to trigger network updates.
*   **Parameters:** `inst` (Entity) — the entity instance to which this component is attached.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `equip` — triggers `OnEquip`, which sends equipment data (slot ID + skin/override name) to the network.
  - `unequip` — triggers `OnUnequip`, which clears the equipment slot on the network.
  - `onactivateskill_server` — triggers `OnSkillSelectionUpdated`, which syncs current skill selection.
  - `ondeactivateskill_server` — triggers `OnSkillSelectionUpdated`, which syncs updated skill selection.
  - `onsetskillselection_server` — triggers `OnSkillSelectionUpdated`, which syncs skill selection.
- **Pushes:** None
