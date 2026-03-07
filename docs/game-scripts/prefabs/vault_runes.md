---
id: vault_rune
title: Vault Rune
description: Represents an interactive ancient rune stone used for lore display in the Vault biome.
tags: [structure, lore, vault]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2a29e1ed
system_scope: environment
---

# Vault Rune

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `vault_rune` prefab represents an interactive structure entity used in the Vault biome to display ancient lore text. It supports dynamic ID assignment, network synchronization, and conditional inspection based on player equipment (specifically the `ancient_reader` tag). It is implemented as a prefab with built-in save/load, animation, and inspection support via the `inspectable` component.

## Usage example
```lua
local rune = SpawnPrefab("vault_rune")
rune:SetId("lore_01")  -- or "rune_01", etc.
rune:ListenForEvent("onplayerhover", function(inst, data) 
    print("Viewer:", data and data.player and data.player.prefab)
end)
```

## Dependencies & tags
**Components used:** `inspectable` (added on master), `transform`, `animstate`, `minimapentity`, `network`  
**Tags:** Adds `structure`, `statue`, `ancient_text` to the entity. Checks for `ancient_reader` tag on viewer during inspection.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `id` | string | `"lobby"` | Unique identifier for the rune's content; used to index `STRINGS.VAULT_RUNE` for description and determine animation. |

## Main functions
### `SetId(id)`
*   **Description:** Assigns an ID to the rune, updates its animation based on ID prefix (`"lore"` → `"idle1"`, else `"idle2"`), and triggers animation change only if not already playing.
*   **Parameters:** `id` (string) — the new ID string (e.g., `"lore_01"`, `"rune_a"`).
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Serializes the rune’s ID into save data, omitting it if ID is `"lobby"`.
*   **Parameters:** `data` (table) — save data table to populate.
*   **Returns:** Nothing.

### `OnLoad(inst, data, ents)`
*   **Description:** Restores the rune’s ID from save data if present.
*   **Parameters:**  
  `data` (table) — save data table (may contain `data.id`).  
  `ents` (table) — entity reference map (unused in this implementation).  
*   **Returns:** Nothing.

### `GetDescription(inst, viewer)`
*   **Description:** Returns the localized lore string for this rune *only* if the viewer has an equipped item with the `ancient_reader` tag. Otherwise returns `nil`.
*   **Parameters:**  
  `inst` (Entity) — the rune instance.  
  `viewer` (Entity) — the player/entity inspecting the rune.  
*   **Returns:** string or `nil` — the lookup key from `STRINGS.VAULT_RUNE` (uppercase `inst.id`) or `nil`.

## Events & listeners
None identified. The component itself does not register or fire events; interaction with players (e.g., inspection) occurs through the `inspectable` component’s internal mechanisms.