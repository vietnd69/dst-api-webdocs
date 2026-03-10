---
id: skins_defs_data
title: Skins Defs Data
description: Registers skin mappings, DLC assets, scrapbook entries, and texture streaming configurations for DST's inventory and UI systems.
tags: [inventory, skin, ui, texture]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: a67c7a97
system_scope: inventory
---

# Skins Defs Data

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`skins_defs_data.lua` is a top-level data definition module that populates the global `TheInventory` system with skin mappings, DLC inputs, scrapbook keys, and texture streaming group assignments. It does not define an Entity Component System component, nor does it contain class constructors. Instead, it executes module-scope function calls (e.g., `TheInventory:AddSkinSetInput(...)`, `TheSim:AddTextureToStreamingGroup(...)`) to configure the game’s UI and asset loading pipelines during initialization. Its primary role is to declaratively associate visual assets (skins, emojis, recipes, etc.) with gameplay categories, ensuring client and server UIs and inventories are synchronized with correct assets.

## Usage example
```lua
-- Register a skin set for beefalo horn alternatives
TheInventory:AddSkinSetInput("beefalo_horn", "beefalo_horn_war", "beefalo_horn_peace", true)

-- Link an alternative skin to its base skin (e.g., for dynamic swapping)
TheInventory:AddSkinLinkInput("wolfgang_ancient", "wolfgang")

-- Add a scrapbook entry for abigail
TheInventory:AddScrapbook0Key("0x1A2B3C4D")  -- "abigail" prefab

-- Assign dynamic texture to streaming group 5
TheSim:AddTextureToStreamingGroup(5, "anim/dynamic/wolfgang_lunar.zip:wolfgang_lunar--atlas-0.tex")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None in any chunk  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|

## Main functions
### `TheInventory:ClearSkinsDataset()`
* **Description:** Clears all previously registered skin-related data from the inventory system. Called once at startup before re-registering skin definitions to ensure a clean state.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None visible; assumes `TheInventory` is initialized.

### `TheInventory:AddRestrictedBuildFromLua(base_skin, alt_skin, is_loadingscreen)`
* **Description:** Registers an alternate skin (`alt_skin`) as restricted, tied to a base skin (`base_skin`). If `is_loadingscreen` is `true`, the skin is treated as a loading-screen-only asset and may skip runtime validation.
* **Parameters:**  
  `base_skin` — String name of the base skin prefab;  
  `alt_skin` — String name of the alternative skin prefab;  
  `is_loadingscreen` — Boolean; `true` if the skin is only for loading screens.
* **Returns:** None.
* **Error states:** None visible; assumes prefabs exist.

### `TheInventory:AddSkinSetInput(base, ...alts)`
* **Description:** Groups multiple skin prefabs into a set, typically for UI dropdowns or selection panels. The first argument (`base`) is the default; subsequent arguments are alternative skins.  
* **Parameters:**  
  `base` — String name of the primary skin;  
  `...alts` — Variable number of alternative skin prefabs (strings).
* **Returns:** None.
* **Error states:** None visible; assumes all skin prefabs are registered.

### `TheInventory:AddSkinLinkInput(linked_skin, base_skin)`
* **Description:** Links an alternative skin (`linked_skin`) to its canonical base (`base_skin`), enabling runtime skin swapping logic (e.g., via transformations or events).
* **Parameters:**  
  `linked_skin` — String name of the linked/skin variant;  
  `base_skin` — String name of the canonical base skin.
* **Returns:** None.
* **Error states:** None visible; assumes skins exist.

### `TheInventory:AddEmoji(emoji_id, item_name, ...)`
* **Description:** Registers an emoji item (by `item_name`) with an associated ID (`emoji_id`) for UI rendering. Additional parameters (not detailed) may specify display hints.
* **Parameters:**  
  `emoji_id` — Unique integer or string identifier for the emoji;  
  `item_name` — String prefab name of the emoji item (e.g., `"emoji_happy"`).
* **Returns:** None.
* **Error states:** None visible; assumes `item_name` is valid.

### `TheInventory:AddSkinDLCInput(dlc_id, item_name)`
* **Description:** Associates a DLC-specific skin item with its owning DLC, enabling conditional availability (e.g., hide if DLC is disabled).
* **Parameters:**  
  `dlc_id` — String identifier for the DLC (e.g., `"dlc001"`);  
  `item_name` — String name of the item prefab.
* **Returns:** None.
* **Error states:** None visible; assumes `dlc_id` and `item_name` are valid.

### `TheInventory:AddCookBookKey(itemID)`
* **Description:** Adds an item to the cooking recipe scrapbook. `itemID` is a hex identifier matching the item prefab.
* **Parameters:**  
  `itemID` — 8-character uppercase hexadecimal string (e.g., `"0xDEADBEEF"`).
* **Returns:** None.
* **Error states:** None visible; assumes consistent mapping.

### `TheInventory:AddPlantRegistryKey(itemID)`
* **Description:** Adds an item to the plant registry scrapbook (e.g., seeds, harvestables).
* **Parameters:**  
  `itemID` — 8-character uppercase hexadecimal string.
* **Returns:** None.
* **Error states:** None visible.

### `TheInventory:AddSkillTreeKey(itemID)`
* **Description:** Adds an item to the skill tree scrapbook (e.g., unlockable upgrades, cosmetic rewards).
* **Parameters:**  
  `itemID` — 8-character uppercase hexadecimal string.
* **Returns:** None.
* **Error states:** None visible.

### `TheInventory:AddGenericKVKey(itemID)`
* **Description:** Adds an item to a generic key-value scrapbook, typically for special-case catalog entries.
* **Parameters:**  
  `itemID` — 8-character uppercase hexadecimal string.
* **Returns:** None.
* **Error states:** None visible.

### `TheInventory:AddScrapbook{N}Key(itemID)`
* **Description:** Registers an item for a specific scrapbook category `{N}`, where `N` is a number from `0` to `15`. Each number corresponds to a distinct scrapbook section in the UI (e.g., 0 = main catalog, 1 = recipes, etc.).
* **Parameters:**  
  `itemID` — 8-character uppercase hexadecimal string identifying the item (e.g., `"0x001A2B3C"`); commented item names (e.g., `"abigail"`) are for developer reference only.  
* **Returns:** None.
* **Error states:** None visible; assumes `itemID` maps to a valid item prefab.

### `TheInventory:ValidateWithSignature(signatureString)`
* **Description:** Performs integrity verification of the inventory module against a cryptographic signature. Used to guard against version mismatches or unauthorized modifications.
* **Parameters:**  
  `signatureString` — 128-character Base64-like hash (64 bytes) used for validation.
* **Returns:** None.
* **Error states:** Likely fails or logs on mismatch; behavior not visible in this chunk.

### `TheInventory:AddFreeItemForEveryone(itemName)`
* **Description:** Grants a list of globally available items (typically cosmetics or utilities) that all players receive. Used for non-restricted items like free accessories or skins.
* **Parameters:**  
  `itemName` — String name of the item prefab (e.g., `"beefalo_horn_war"`, `"loading_dst10_signed"`).
* **Returns:** None.
* **Error states:** Assumes `itemName` is valid and registered as a prefab.

### `TheSim:AddTextureToStreamingGroup(groupIndex, path)`
* **Description:** Assigns a dynamic animation texture (`.tex` file) to a texture streaming group for optimized memory loading. Used for skin variants requiring proximity- or context-sensitive texture loading.
* **Parameters:**  
  `groupIndex` — Integer (0–42) representing the streaming group;  
  `path` — String in format `"anim/dynamic/<skin>.zip:<skin>--atlas-0.tex"` specifying the ZIP archive and embedded texture.
* **Returns:** None.
* **Error states:** No error handling visible; invalid paths may result in missing textures at runtime.

## Events & listeners
None in any chunk.