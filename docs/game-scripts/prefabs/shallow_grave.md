---
id: shallow_grave
title: Shallow Grave
description: Represents a buried player remains that decays over time, drops loot when hammered, and preserves player identity data for resurrection or inspection.
tags: [player, decay, loot, skeleton]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 47a45c43
system_scope: world
---

# Shallow Grave

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `shallow_grave` prefabs (`shallow_grave` and `shallow_grave_player`) represent buried remains that serve as interactive grave markers. They are created when players die in the world and contain encoded player identity data (name, character, cause of death, equipment, etc.). The non-player variant (`shallow_grave`) functions as a generic skeleton without identity, while the player variant (`shallow_grave_player`) stores and preserves full player avatar data, supports decay into ash, and participates in resurrection mechanics. It integrates with multiple components: `inspectable` for display and renaming, `lootdropper` for loot generation, `workable` for interaction (hammering), and `playeravatardata` for player-specific identity persistence.

## Usage example
```lua
-- Create a standard shallow grave (non-player)
local grave = SpawnPrefab("shallow_grave")

-- Create a player shallow grave with full data
local player_grave = SpawnPrefab("shallow_grave_player")
player_grave:SetSkeletonDescription("Walter", "walter", "dug", "Murderer", "12345")
player_grave:SetSkeletonAvatarData({equip = {["HEAD"] = "helmet", ["BODY"] = "armor"}})
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `workable`, `playeravatardata`  
**Tags:** Adds `skeleton_standin`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `char` | string or nil | `nil` | Character name (e.g., `"Walter"`), only set for player graves. |
| `playername` | string or nil | `nil` | Original player's account username, only set for player graves. |
| `userid` | string or nil | `nil` | Unique user ID, only set for player graves. |
| `pkname` | string or nil | `nil` | Name of killer in pvp, or `nil` for other causes. |
| `cause` | string or nil | `nil` | Lowercased cause of death (e.g., `"dug"`), only set if not pvp. |
| `skeletonspawntime` | number or nil | `nil` | Unix timestamp when the grave was spawned, used for decay timing. |
| `animnum` | number | `0` | Animation variant index used for idle animation selection (`"idleN"`). |

## Main functions
### `SetSkeletonDescription(char, playername, cause, pkname, userid)`
* **Description:** Stores player identity and death information in the grave; sets the special description used by the `inspectable` component.  
* **Parameters:**  
  - `char` (string): Character name (e.g., `"Walter"`).  
  - `playername` (string): Original player's username.  
  - `cause` (string): Cause of death (e.g., `"dug"`), ignored if `pkname` is provided.  
  - `pkname` (string or nil): Name of killer in player-vs-player death, or `nil`.  
  - `userid` (string): Unique player identifier.  
* **Returns:** Nothing.  
* **Error states:** No explicit error handling; silently sets fields if any argument is `nil`.

### `SetSkeletonAvatarData(client_obj)`
* **Description:** Passes client-side avatar data (e.g., equipment, skin) to the `playeravatardata` component for persistence and display.  
* **Parameters:**  
  - `client_obj` (table): Avatar data object containing `equip`, `skin`, etc.  
* **Returns:** Nothing.

### `Decay()`
* **Description:** Destroys the grave entity and spawns `ash` and `collapse_small` prefabs at its position.  
* **Parameters:** None.  
* **Returns:** Nothing.

## Events & listeners
- **Pushes:** `ms_skeletonspawn` — fired once during player grave creation (`player_fn`) to notify the world of a new skeleton.  
- **Listens to:** None explicitly defined in this file.