---
id: playerhearing
title: Playerhearing
description: Manages dynamic audio DSP filters applied to the player based on equipped items, such as muffling hats.
tags: [audio, player, equipment]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 3972a3ec
system_scope: audio
---

# Playerhearing

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PlayerHearing` dynamically applies audio DSP (Digital Signal Processing) filters to the player entity based on equipped items. It listens for `equip` and `unequip` events to detect changes in inventory, especially items tagged with keys like `"mufflehat"`. When such items are equipped, it activates predefined DSP profiles to lower ambient, music, and SFX volumes. It pushes `pushdsp` and `popdsp` events to communicate filter changes to the audio system.

This component is typically attached to player prefabs to enable equipment-based audio muffling effects.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("player")
inst:AddComponent("inventory")
inst:AddComponent("playerhearing")

-- Equipping a muffle hat will automatically trigger DSP changes
inst.components.inventory:Equip("mufflehat_prefab")
```

## Dependencies & tags
**Components used:** `inventory` (via `inst.replica.inventory`)
**Tags:** Checks for `mufflehat` tag on equipped items.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `mufflehat` | boolean | `false` | Indicates whether a muffle-hat item is currently equipped. |
| `dsptables` | table | `{}` | Local cache of active DSP filter tables applied. |

## Main functions
### `GetDSPTables()`
* **Description:** Returns the current set of active DSP filter tables.
* **Parameters:** None.
* **Returns:** Table — a list of active DSP entries (e.g., `{"mufflehat" = {...}}`).

### `UpdateDSPTables()`
* **Description:** Syncs the `dsptables` cache with current equipment state. Pushes `pushdsp` when a DSP filter is activated or `popdsp` when deactivated.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No explicit failures; silently skips updates if state matches.

## Events & listeners
- **Listens to:**  
  `equip` — triggers check for DSP-relevant equipment changes (server & client).  
  `unequip` — triggers check for DSP-relevant equipment changes (server & client).  
  `inventoryclosed` — client-only fallback to reset DSP when inventory UI closes.
- **Pushes:**  
  `pushdsp` — fires with DSP table (e.g., `v`) when a muffling filter is activated.  
  `popdsp` — fires with DSP table when a muffling filter is deactivated.
