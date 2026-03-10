---
id: playerprofile
title: Playerprofile
description: Manages persistent player profile data including customization, settings, unlocks, and character/skin preferences.
tags: [player, settings, persistence, customization, profile]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: da1f753d
system_scope: player
---

# Playerprofile

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `playerprofile` component stores and manages the entire persistent profile state for a player, including unlocked world generation areas, customization presets, skin ownership, clothing preferences, UI settings (HUD, volume, bloom, sensitivity), input controls, popup visibility flags, mod preferences, and platform-specific settings. It acts as the central authority for data that survives across sessions, using JSON-based persistence with optional cloud saves, and supports both settings-file and profile-file configuration depending on runtime flags like `USE_SETTINGS_FILE`.

## Usage example
```lua
-- Load profile data
TheWorld:PushEvent("ms_loadprofile", { callback = function() end })
PlayerProfile:Load(function()
    -- Set and persist a skin preference
    PlayerProfile:SetSkinsForCharacter("wilson", { base = "wilson_beard2" })
    
    -- Check if a worldgen area is unlocked
    if PlayerProfile:IsWorldGenUnlocked("forest", "bee") then
        -- Unlock more content
        PlayerProfile:UnlockWorldGen("cave", "bluemushroom")
    end
    
    -- Get and apply audio settings
    local ambient, sfx, music = PlayerProfile:GetVolume()
    TheSim:SetSetting("ambient_volume", ambient)
    TheSim:SetSetting("sfx_volume", sfx)
    TheSim:SetSetting("music_volume", music)
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `persistdata` | table | Generated default set | Holds all persistent data loaded from disk or created on first run |
| `dirty` | boolean | `true` after init | Indicates unsaved changes requiring a save operation |

## Main functions
### `Reset()`
* **Description:** Resets all persistent profile data (unlocked worldgen, popup flags, customization presets, skins, mod settings, etc.) to default values. Does not save if `USE_SETTINGS_FILE` is true (system-managed settings are left intact). Marks profile as dirty and triggers a save.
* **Parameters:** None  
* **Returns:** None  

### `SoftReset()`
* **Description:** Performs the same data reset as `Reset()` but skips saving to disk and instead encodes `persistdata` as JSON and passes it to `Set()`. Useful for reinitializing in-memory state without write I/O.
* **Parameters:** None  
* **Returns:** None  

### `GetSkins()`
* **Description:** Returns a flat array of all owned skins for all prefabs by aggregating skin data from `PREFAB_SKINS`. Always includes `"prefab_none"` for each prefab.
* **Parameters:** None  
* **Returns:** Array of skin strings (e.g., `"wilson_none"`, `"woodie_beard2"`)  

### `GetSkinsForPrefab(prefab)`
* **Description:** Returns a list of owned skins for a given prefab. Always includes `"prefab_none"`, and filters out `"backpack_mushy"` if owned. Uses `TheInventory:CheckOwnership`.
* **Parameters:** `prefab` (string) — prefab name  
* **Returns:** Array of owned skin strings for the prefab  

### `GetClothingOptionsForType(type)`
* **Description:** Returns a list of owned clothing items of a given type (e.g., `"armor"`, `"hat"`). Always includes `""` to represent "no clothing".
* **Parameters:** `type` (string) — clothing type  
* **Returns:** Array of owned clothing item names  

### `GetLastSelectedCharacter()`
* **Description:** Returns the last selected official character. Falls back to the first entry in `DST_CHARACTERLIST`, then `"wilson"`.
* **Parameters:** None  
* **Returns:** String character name  

### `SetLastSelectedCharacter(character)`
* **Description:** Records the given character as the last selected character, but only if it exists in `DST_CHARACTERLIST`.
* **Parameters:** `character` (string) — character prefab name  
* **Returns:** None  

### `GetSkinPresetForCharacter(character, preset_index)`
* **Description:** Returns a shallow copy of the skin preset for a character at a given preset index. Returns empty table `{}` if none exists.
* **Parameters:**  
  `character` (string) — character name  
  `preset_index` (number) — preset index  
* **Returns:** Table of skin data or `{}`  

### `SetSkinPresetForCharacter(character, preset_index, skin_list)`
* **Description:** Sets a skin preset for a character at a given index and saves the profile.
* **Parameters:**  
  `character` (string)  
  `preset_index` (number)  
  `skin_list` (table) — skin data  
* **Returns:** None  

### `GetSkinsForCharacter(character)`
* **Description:** Returns a shallow copy of the skin list for a character, including a `"base"` key. Migrates legacy `"characterskins"` data and strips empty strings.
* **Parameters:** `character` (string)  
* **Returns:** Table with skin data (including `"base"` key) or fallback `{ base = "character_none" }`  

### `SetSkinsForCharacter(character, skinList)`
* **Description:** Sets the skin list for a character and saves the profile.
* **Parameters:**  
  `character` (string)  
  `skinList` (table) — skin data  
* **Returns:** None  

### `SetCustomizationItemState(customization_type, item_key, is_active)`
* **Description:** Sets whether a customization item (by type and key) is active. Updates `last_item_key` if `is_active` is true.
* **Parameters:**  
  `customization_type` (string)  
  `item_key` (string/number)  
  `is_active` (boolean)  
* **Returns:** None  

### `GetCustomizationItemState(customization_type, item_key)`
* **Description:** Returns whether the item is active for the given type and key.
* **Parameters:**  
  `customization_type` (string)  
  `item_key` (string/number)  
* **Returns:** Boolean or `nil` if not found  

### `GetCustomizationItemsForType(customization_type)`
* **Description:** Returns a shallow copy of all stored items for the type, excluding `"last_item_key"`.
* **Parameters:** `customization_type` (string)  
* **Returns:** Table of `{ item_key → boolean }` or `{}` if missing  

### `GetStoredCustomizationItemTypes()`
* **Description:** Returns a list of all stored customization types.
* **Parameters:** None  
* **Returns:** Array of type names (strings) or `{}`  

### `SetItemSortMode(sort_mode)`
* **Description:** Sets the item explorer sort mode (e.g., `"name"`, `"rarity"`).
* **Parameters:** `sort_mode` — any serializable value  
* **Returns:** None  

### `GetItemSortMode()`
* **Description:** Returns the stored item explorer sort mode.
* **Parameters:** None  
* **Returns:** Value stored or `nil`  

### `SetServerSortMode(sort_mode)`
* **Description:** Sets the save explorer sort mode.
* **Parameters:** `sort_mode` — any value  
* **Returns:** None  

### `GetServerSortMode()`
* **Description:** Returns the stored save explorer sort mode.
* **Parameters:** None  
* **Returns:** Value or `nil`  

### `SetCustomizationFilterState(customize_screen, customize_filter, filter_state)`
* **Description:** Stores a filter state (e.g., `"show"`/`"hide"`) for a screen/filter pair.
* **Parameters:**  
  `customize_screen` (string)  
  `customize_filter` (string)  
  `filter_state` (any)  
* **Returns:** None  

### `GetCustomizationFilterState(customize_screen, customize_filter)`
* **Description:** Returns the stored filter state for the given screen/filter pair.
* **Parameters:**  
  `customize_screen` (string)  
  `customize_filter` (string)  
* **Returns:** Stored value or `nil`  

### `SetCollectionTimestamp(time)`
* **Description:** Sets the timestamp when the collection was last modified.
* **Parameters:** `time` (number)  
* **Returns:** None  

### `GetCollectionTimestamp()`
* **Description:** Returns the collection timestamp, defaulting to `-10000` if unset.
* **Parameters:** None  
* **Returns:** Number  

### `SetShopHash(_hash)`
* **Description:** Stores a hash for the purchase screen (likely used for cache invalidation).
* **Parameters:** `_hash` (any)  
* **Returns:** None  

### `GetShopHash()`
* **Description:** Returns the shop hash, defaulting to `0`.
* **Parameters:** None  
* **Returns:** Number  

### `SetRecipeTimestamp(recipe, time)`
* **Description:** Records the last time a recipe was crafted/unlocked.
* **Parameters:**  
  `recipe` (string)  
  `time` (number) — timestamp  
* **Returns:** None  

### `GetRecipeTimestamp(recipe)`
* **Description:** Returns the stored timestamp for a recipe, defaulting to `-10000`.
* **Parameters:** `recipe` (string)  
* **Returns:** Number  

### `GetLastUsedSkinForItem(item)`
* **Description:** Returns the last used skin for a given item.
* **Parameters:** `item` (string)  
* **Returns:** Skin name (string) or `nil`  

### `SetLastUsedSkinForItem(item, skin)`
* **Description:** Records the skin last used for an item.
* **Parameters:**  
  `item` (string)  
  `skin` (string)  
* **Returns:** None  

### `SetCollectionName(name)`
* **Description:** Sets the player's collection name.
* **Parameters:** `name` (string)  
* **Returns:** None  

### `GetCollectionName()`
* **Description:** Returns the collection name, or `nil` if unset.
* **Parameters:** None  
* **Returns:** String or `nil`  

### `SetModFavorited(modname, favorite)`
* **Description:** Sets whether a mod is favorited. Removes the entry if `favorite` is falsy.
* **Parameters:**  
  `modname` (string)  
  `favorite` (boolean)  
* **Returns:** None  

### `IsModFavorited(modname)`
* **Description:** Returns whether the mod is favorited.
* **Parameters:** `modname` (string)  
* **Returns:** Boolean (defaults to `false`)  

### `SetValue(name, value)`
* **Description:** Sets a top-level `persistdata` value. Marks dirty only if changed.
* **Parameters:**  
  `name` (string) — key  
  `value` (any)  
* **Returns:** None  

### `GetValue(name)`
* **Description:** Returns the value for the key, or `nil`.
* **Parameters:** `name` (string)  
* **Returns:** Stored value or `nil`  

### `SetVolume(ambient, sfx, music)`
* **Description:** Sets audio volumes. Delegates to `TheSim:SetSetting` if `USE_SETTINGS_FILE`, otherwise stores in `persistdata`.
* **Parameters:**  
  `ambient`, `sfx`, `music` (numbers)  
* **Returns:** None  

### `SetMuteOnFocusLost(value)`
* **Description:** Sets whether audio mutes on focus loss.
* **Parameters:** `value` (boolean)  
* **Returns:** None  

### `SetScreenFlash(value)`
* **Description:** Sets screen flash intensity.
* **Parameters:** `value` (number)  
* **Returns:** None  

### `GetScreenFlash()`
* **Description:** Gets screen flash intensity.
* **Parameters:** None  
* **Returns:** Number (default `1`)  

### `SetBloomEnabled(enabled)`
* **Description:** Enables/disables bloom effect.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `GetBloomEnabled()`
* **Description:** Gets bloom status.
* **Parameters:** None  
* **Returns:** Boolean  

### `SetHUDSize(size)`
* **Description:** Sets HUD size. Delegates appropriately.
* **Parameters:** `size` (number)  
* **Returns:** None  

### `GetHUDSize()`
* **Description:** Gets HUD size.
* **Parameters:** None  
* **Returns:** Number (default `5`)  

### `SetCraftingMenuSize(size)`
* **Description:** Sets crafting menu size. Delegates appropriately.
* **Parameters:** `size` (number)  
* **Returns:** None  

### `GetCraftingMenuSize()`
* **Description:** Gets crafting menu size.
* **Parameters:** None  
* **Returns:** Number (default `5`)  

### `SetCraftingMenuNumPinPages(size)`
* **Description:** Sets number of pinned crafting pages.
* **Parameters:** `size` (number)  
* **Returns:** None  

### `GetCraftingNumPinnedPages()`
* **Description:** Gets number of pinned pages.
* **Parameters:** None  
* **Returns:** Number (default `3`)  

### `GetScrapbookHudDisplay()`
* **Description:** Gets scrapbook HUD display setting.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `true`)  

### `SetScrapbookHudDisplay(enabled)`
* **Description:** Sets scrapbook HUD display.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `GetPOIDisplay()`
* **Description:** Gets POI display setting.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `true`)  

### `SetPOIDisplay(enabled)`
* **Description:** Sets POI display.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `GetScrapbookColumnsSetting()`
* **Description:** Gets scrapbook column count.
* **Parameters:** None  
* **Returns:** Number (default `3`)  

### `SetScrapbookColumnsSetting(setting)`
* **Description:** Sets scrapbook column count.
* **Parameters:** `setting` (number)  
* **Returns:** None  

### `SetCraftingMenuSensitivity(sensitivity)`
* **Description:** Sets crafting menu sensitivity.
* **Parameters:** `sensitivity` (number)  
* **Returns:** None  

### `GetCraftingMenuSensitivity()`
* **Description:** Gets crafting menu sensitivity.
* **Parameters:** None  
* **Returns:** Number (default `12`)  

### `SetInventorySensitivity(sensitivity)`
* **Description:** Sets inventory sensitivity.
* **Parameters:** `sensitivity` (number)  
* **Returns:** None  

### `GetInventorySensitivity()`
* **Description:** Gets inventory sensitivity.
* **Parameters:** None  
* **Returns:** Number (default `16`)  

### `SetMiniMapZoomSensitivity(sensitivity)`
* **Description:** Sets minimap zoom sensitivity.
* **Parameters:** `sensitivity` (number)  
* **Returns:** None  

### `GetMiniMapZoomSensitivity()`
* **Description:** Gets minimap zoom sensitivity.
* **Parameters:** None  
* **Returns:** Number (default `15`)  

### `GetBoatHopDelay()`
* **Description:** Gets boat hop delay.
* **Parameters:** None  
* **Returns:** Number (default `8`)  

### `SetBoatHopDelay(delay)`
* **Description:** Sets boat hop delay and syncs to client if `ThePlayer` exists.
* **Parameters:** `delay` (number)  
* **Returns:** None  

### `SetDistortionEnabled(enabled)`
* **Description:** Enables/disables distortion effect.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `GetDistortionEnabled()`
* **Description:** Gets distortion status.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `true`)  

### `SetDistortionModifier(modifier)`
* **Description:** Sets distortion modifier.
* **Parameters:** `modifier` (number)  
* **Returns:** None  

### `GetDistortionModifier()`
* **Description:** Gets distortion modifier.
* **Parameters:** None  
* **Returns:** Number (default `0.75`)  

### `SetScreenShakeEnabled(enabled)`
* **Description:** Sets screen shake.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `IsScreenShakeEnabled()`
* **Description:** Gets screen shake status.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `true`)  

### `SetWathgrithrFontEnabled(enabled)`
* **Description:** Sets Wathgrithr font.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `IsWathgrithrFontEnabled()`
* **Description:** Gets Wathgrithr font status.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `true`)  

### `SetInvertCameraRotation(enabled)`
* **Description:** Sets camera rotation inversion.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `GetInvertCameraRotation()`
* **Description:** Gets camera rotation inversion.
* **Parameters:** None  
* **Returns:** Boolean (default `false`)  

### `SetBoatCameraEnabled(enabled)`
* **Description:** Sets boat camera toggle.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `IsBoatCameraEnabled()`
* **Description:** Gets boat camera toggle.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `true`)  

### `SetCampfireStoryCameraEnabled(enabled)`
* **Description:** Sets campfire story camera toggle.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `IsCampfireStoryCameraEnabled()`
* **Description:** Gets campfire story camera toggle.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `true`)  

### `SetMinimapZoomCursorEnabled(enabled)`
* **Description:** Sets whether minimap zoom follows cursor.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `IsMinimapZoomCursorFollowing()`
* **Description:** Gets minimap zoom cursor follow status.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `true`)  

### `SetHaveWarnedDifficultyRoG()`
* **Description:** Marks the difficulty RoG warning as shown.
* **Parameters:** None  
* **Returns:** None  

### `HaveWarnedDifficultyRoG()`
* **Description:** Gets whether difficulty RoG warning has been shown.
* **Parameters:** None  
* **Returns:** Boolean  

### `SetVibrationEnabled(enabled)`
* **Description:** Sets controller vibration.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `GetVibrationEnabled()`
* **Description:** Gets vibration setting.
* **Parameters:** None  
* **Returns:** Boolean  

### `SetShowPasswordEnabled(enabled)`
* **Description:** Sets whether password is shown in UI.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `GetShowPasswordEnabled()`
* **Description:** Gets show password setting.
* **Parameters:** None  
* **Returns:** Boolean  

### `SetMovementPredictionEnabled(enabled)`
* **Description:** Sets movement prediction (client-side).
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `SetTextureStreamingEnabled(enabled)`
* **Description:** Sets texture streaming.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `SetThreadedRenderEnabled(enabled)`
* **Description:** Sets threaded renderer.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `SetDynamicTreeShadowsEnabled(enabled)`
* **Description:** Sets dynamic tree shadows.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `SetAutopauseEnabled(enabled)`
* **Description:** Sets autopause (pause on alt-tab).
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `SetConsoleAutopauseEnabled(enabled)`
* **Description:** Sets console-specific autopause.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `SetCraftingAutopauseEnabled(enabled)`
* **Description:** Sets crafting menu-specific autopause.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `GetCraftingAutopauseEnabled()`
* **Description:** Gets crafting menu autopause.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `false`)  

### `SetCraftingMenuBufferedBuildAutoClose(enabled)`
* **Description:** Sets buffered build auto-close in crafting menu.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `GetCraftingMenuBufferedBuildAutoClose()`
* **Description:** Gets buffered build auto-close.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `true`)  

### `SetCraftingHintAllRecipesEnabled(enabled)`
* **Description:** Sets crafting hint for all recipes.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `GetCraftingHintAllRecipesEnabled()`
* **Description:** Gets crafting hint setting.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `false`)  

### `SetLoadingTipsOption(setting)`
* **Description:** Sets loading tips setting.
* **Parameters:** `setting` (number) — see `LOADING_SCREEN_TIP_OPTIONS`  
* **Returns:** None  

### `SetDefaultCloudSaves(enabled)`
* **Description:** Sets default cloud saves option.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `SetUseZipFileForNormalSaves(enabled)`
* **Description:** Sets whether normal saves use ZIP files.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `SetHidePauseUnderlay(hide)`
* **Description:** Sets whether to hide the pause underlay.
* **Parameters:** `hide` (boolean)  
* **Returns:** None  

### `GetMovementPredictionEnabled()`
* **Description:** Gets movement prediction status.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `true`)  

### `SetProfanityFilterServerNamesEanbled(enabled)`
* **Description:** Sets profanity filter for server names.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `GetProfanityFilterServerNamesEnabled()`
* **Description:** Gets server name profanity filter.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `true`)  

### `SetProfanityFilterChatEanbled(enabled)`
* **Description:** Sets profanity filter for chat.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `GetProfanityFilterChatEnabled()`
* **Description:** Gets chat profanity filter.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `true`)  

### `SetTargetLockingEnabled(enabled)`
* **Description:** Sets target locking.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `GetTargetLockingEnabled()`
* **Description:** Gets target locking.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `true`)  

### `SetAutoSubscribeModsEnabled(enabled)`
* **Description:** Sets auto-subscribe to mods.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `GetAutoSubscribeModsEnabled()`
* **Description:** Gets auto-subscribe mods.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `false`)  

### `SetAutoLoginEnabled(enabled)`
* **Description:** Sets auto-login.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `GetAutoLoginEnabled()`
* **Description:** Gets auto-login.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `true`)  

### `GetAxisAlignedPlacement()`
* **Description:** Gets axis-aligned placement mode.
* **Parameters:** None  
* **Returns:** Boolean  

### `SetAxisAlignedPlacement(enabled)`
* **Description:** Sets axis-aligned placement.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `GetAxisAlignedPlacementIntervals()`
* **Description:** Gets axis-aligned placement intervals.
* **Parameters:** None  
* **Returns:** Number (default `1`)  

### `SetAxisAlignedPlacementIntervals(intervals)`
* **Description:** Sets intervals and calls `UpdateAxisAlignmentValues`.
* **Parameters:** `intervals` (number)  
* **Returns:** None  

### `SetNPCChatLevel(level)`
* **Description:** Sets NPC chat level.
* **Parameters:** `level` (number)  
* **Returns:** None  

### `GetNPCChatLevel()`
* **Description:** Gets NPC chat level.
* **Parameters:** None  
* **Returns:** Number (defaults to `CHATPRIORITIES.LOW`)  

### `GetNPCChatEnabled()`
* **Description:** Gets whether NPC chat is enabled (`level > 0`).
* **Parameters:** None  
* **Returns:** Boolean  

### `SetAnimatedHeadsEnabled(enabled)`
* **Description:** Sets animated heads.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `GetAnimatedHeadsEnabled()`
* **Description:** Gets animated heads.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `true`)  

### `SetAutoCavesEnabled(enabled)`
* **Description:** Sets auto caves entry.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `GetAutoCavesEnabled()`
* **Description:** Gets auto caves.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `false`)  

### `SetCavesStateRemembered()`
* **Description:** Marks that caves state was remembered.
* **Parameters:** None  
* **Returns:** None  

### `GetCavesStateRemembered()`
* **Description:** Gets caves state remembered flag.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `false`)  

### `SetModsWarning(enabled)`
* **Description:** Sets mod warning popup visibility.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `GetModsWarning()`
* **Description:** Gets mod warning.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `true`)  

### `SetPresetMode(mode)`
* **Description:** Sets preset mode (e.g., `"combined"`, `"worldgen"`, `"custom"`).
* **Parameters:** `mode` (string)  
* **Returns:** None  

### `GetPresetMode()`
* **Description:** Gets preset mode.
* **Parameters:** None  
* **Returns:** String (defaults to `"combined"`)  

### `SetIntegratedBackpack(enabled)`
* **Description:** Sets integrated backpack mode.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

### `GetIntegratedBackpack()`
* **Description:** Gets integrated backpack.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `false`)  

### `GetTextureStreamingEnabled()`
* **Description:** Gets texture streaming setting.
* **Parameters:** None  
* **Returns:** Boolean  

### `GetThreadedRenderEnabled()`
* **Description:** Gets threaded renderer setting.
* **Parameters:** None  
* **Returns:** Boolean  

### `GetDynamicTreeShadowsEnabled()`
* **Description:** Gets dynamic tree shadows.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `true`)  

### `GetAutopauseEnabled()`
* **Description:** Gets autopause.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `true`)  

### `GetConsoleAutopauseEnabled()`
* **Description:** Gets console autopause.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `true`)  

### `GetLoadingTipsOption()`
* **Description:** Gets loading tips option. Returns `NONE` on dedicated server.
* **Parameters:** None  
* **Returns:** Number  

### `GetUseZipFileForNormalSaves()`
* **Description:** Gets ZIP saves flag.
* **Parameters:** None  
* **Returns:** Boolean  

### `GetDefaultCloudSaves()`
* **Description:** Gets default cloud saves flag.
* **Parameters:** None  
* **Returns:** Boolean  

### `GetHidePauseUnderlay()`
* **Description:** Gets hide pause underlay flag.
* **Parameters:** None  
* **Returns:** Boolean  

### `GetConsoleAutocompleteMode()`
* **Description:** Gets console autocomplete mode.
* **Parameters:** None  
* **Returns:** String (defaults to `"enter_tab"`)  

### `GetChatAutocompleteMode()`
* **Description:** Gets chat autocomplete mode.
* **Parameters:** None  
* **Returns:** String (defaults to `"enter_tab"`)  

### `GetWorldCustomizationPresets()`
* **Description:** Decodes and returns stored world customization presets from JSON.
* **Parameters:** None  
* **Returns:** Array of preset tables or `{}` on decode failure  

### `AddWorldCustomizationPreset(preset, index)`
* **Description:** Adds or updates a preset in the stored list.
* **Parameters:**  
  `preset` (table)  
  `index` (number?, optional) — insertion index  
* **Returns:** None  

### `GetSavedFilters()`
* **Description:** Decodes and returns stored server filters.
* **Parameters:** None  
* **Returns:** Array of filter tables or `{}`  

### `SetFilters(filters)`
* **Description:** Stores server filters (JSON-encoded).
* **Parameters:** `filters` (array)  
* **Returns:** None  

### `SaveFilters(filters)`
* **Description:** DEPRECATED. Calls `SetFilters` + `Save`.
* **Parameters:** `filters` (array)  
* **Returns:** None  

### `GetSavedWorldProgressionFilters()`
* **Description:** Decodes and returns stored world progression filters.
* **Parameters:** None  
* **Returns:** Array or `{}`  

### `SetWorldProgressionFilters(filters)`
* **Description:** Stores world progression filters.
* **Parameters:** `filters` (array)  
* **Returns:** None  

### `GetVolume()`
* **Description:** Gets audio volumes. Delegates to `TheSim:GetSetting` if `USE_SETTINGS_FILE`, otherwise from `persistdata`.
* **Parameters:** None  
* **Returns:** Three numbers (ambient, sfx, music)  

### `GetMuteOnFocusLost()`
* **Description:** Gets mute-on-focus-lost flag.
* **Parameters:** None  
* **Returns:** Boolean  

### `SetRenderQuality(quality)`
* **Description:** Sets render quality (e.g., `RENDER_QUALITY.DEFAULT`).
* **Parameters:** `quality` (enum/value)  
* **Returns:** None  

### `GetRenderQuality()`
* **Description:** Gets render quality.
* **Parameters:** None  
* **Returns:** Value  

### `GetInstallID()`
* **Description:** Returns a unique install ID (timestamp at install time).
* **Parameters:** None  
* **Returns:** Number  

### `GetPlayInstance()`
* **Description:** Returns and increments the play instance count.
* **Parameters:** None  
* **Returns:** Number  

### `IsWorldGenUnlocked(area, item)`
* **Description:** Checks if a worldgen area/item is unlocked (`[area][item] == true`).
* **Parameters:**  
  `area` (string)  
  `item` (string?, optional)  
* **Returns:** Boolean  

### `UnlockWorldGen(area, item)`
* **Description:** Marks an area/item combination as unlocked.
* **Parameters:**  
  `area` (string)  
  `item` (string)  
* **Returns:** None  

### `GetUnlockedWorldGen()`
* **Description:** Returns the full `unlocked_worldgen` table.
* **Parameters:** None  
* **Returns:** Nested table  

### `GetSaveName()`
* **Description:** Returns the save filename (`"profile"` or `"profile_branch"`).
* **Parameters:** None  
* **Returns:** String  

### `Save(callback)`
* **Description:** Saves `persistdata` as JSON to persistent storage if dirty. Calls `callback` if provided.
* **Parameters:** `callback` (function?, optional)  
* **Returns:** None  

### `Load(callback, minimal_load)`
* **Description:** Loads persistent string and delegates to `Set`.
* **Parameters:**  
  `callback` (function?, optional)  
  `minimal_load` (boolean?, optional)  
* **Returns:** None  

### `Set(str, callback, minimal_load)`
* **Description:** Parses JSON string into `persistdata`, performs legacy migrations and defaults, applies settings, and calls `callback`.
* **Parameters:**  
  `str` (string) — JSON string  
  `callback` (function?, optional)  
  `minimal_load` (boolean?, optional)  
* **Returns:** None  

### `SetDirty(dirty)`
* **Description:** Sets the dirty flag directly.
* **Parameters:** `dirty` (boolean)  
* **Returns:** None  

### `GetControls(guid)`
* **Description:** Retrieves controls data and enabled state for a given device GUID.
* **Parameters:** `guid` (string)  
* **Returns:** Two values: `controls` (table), `enabled` (boolean)  

### `SetControls(guid, data, enabled)`
* **Description:** Updates or adds control data for a device GUID.
* **Parameters:**  
  `guid` (string)  
  `data` (table)  
  `enabled` (boolean)  
* **Returns:** None  

### `SetControlScheme(id, value)`
* **Description:** Sets a control scheme entry.
* **Parameters:**  
  `id` (string/key)  
  `value` (any)  
* **Returns:** None  

### `GetControlScheme(id)`
* **Description:** Gets a control scheme entry.
* **Parameters:** `id` (string/key)  
* **Returns:** Value or `nil`  

### `SawDisplayAdjustmentPopup()`
* **Description:** Returns whether display adjustment popup was seen.
* **Parameters:** None  
* **Returns:** Boolean  

### `ShowedDisplayAdjustmentPopup()`
* **Description:** Marks display adjustment popup as shown.
* **Parameters:** None  
* **Returns:** None  

### `SawControllerPopup()`
* **Description:** Returns whether controller popup was seen.
* **Parameters:** None  
* **Returns:** Boolean  

### `ShowedControllerPopup()`
* **Description:** Marks controller popup as shown.
* **Parameters:** None  
* **Returns:** None  

### `ShouldWarnModsEnabled()`
* **Description:** Returns whether to show mods-enabled warning.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `true`)  

### `SetWarnModsEnabled(do_warning)`
* **Description:** Sets the mods-enabled warning flag.
* **Parameters:** `do_warning` (boolean)  
* **Returns:** None  

### `IsEntitlementReceived(entitlement)`
* **Description:** Checks if a specific entitlement has been received (keys include branch/user ID).
* **Parameters:** `entitlement` (string)  
* **Returns:** Boolean  

### `SetEntitlementReceived(entitlement)`
* **Description:** Marks an entitlement as received and saves the profile.
* **Parameters:** `entitlement` (string)  
* **Returns:** None  

### `SawNewUserPopup()`
* **Description:** Returns whether new user popup was seen.
* **Parameters:** None  
* **Returns:** Boolean  

### `ShowedNewUserPopup()`
* **Description:** Marks new user popup as shown (idempotent).
* **Parameters:** None  
* **Returns:** None  

### `SawControlSchemePopup()`
* **Description:** Returns whether control scheme popup was seen.
* **Parameters:** None  
* **Returns:** Boolean  

### `ShowedControlSchemePopup()`
* **Description:** Marks control scheme popup as shown (idempotent).
* **Parameters:** None  
* **Returns:** None  

### `SawNewHostPicker()`
* **Description:** Returns whether new host picker was seen.
* **Parameters:** None  
* **Returns:** Boolean  

### `ShowedNewHostPicker()`
* **Description:** Marks host picker as shown (idempotent).
* **Parameters:** None  
* **Returns:** None  

### `SaveKlumpCipher(file, cipher)`
* **Description:** Saves a cipher for a klump file (ignored on consoles).
* **Parameters:**  
  `file` (string)  
  `cipher` (string)  
* **Returns:** None  

### `GetKlumpCipher(file)`
* **Description:** Gets a cipher for a klump file (errors on console).
* **Parameters:** `file` (string)  
* **Returns:** String cipher or `nil`  

### `GetRedbirdGameHighScore(score_version)`
* **Description:** Gets high score for Redbird game.
* **Parameters:** `score_version` (string) — suffix (e.g., season/difficulty)  
* **Returns:** Number (default `0`)  

### `SetRedbirdGameHighScore(score, score_version)`
* **Description:** Sets Redbird game high score and saves.
* **Parameters:**  
  `score` (number)  
  `score_version` (string)  
* **Returns:** None  

### `GetSnowbirdGameHighScore(score_version)`
* **Description:** Gets high score for Snowbird game.
* **Parameters:** `score_version` (string)  
* **Returns:** Number (default `0`)  

### `SetSnowbirdGameHighScore(score, score_version)`
* **Description:** Sets Snowbird game high score and saves.
* **Parameters:**  
  `score` (number)  
  `score_version` (string)  
* **Returns:** None  

### `GetCrowGameHighScore(score_version)`
* **Description:** Gets high score for Crow game.
* **Parameters:** `score_version` (string)  
* **Returns:** Number (default `0`)  

### `SetCrowGameHighScore(score, score_version)`
* **Description:** Sets the high score for a specific Crow Game variant and saves the profile.
* **Parameters:**  
  `score` (number)  
  `score_version` (string) — suffix  
* **Returns:** nil  

### `GetKitSize()`
* **Description:** Returns the stored kit size (custom build dimensions), or `0`.
* **Parameters:** None  
* **Returns:** Number  

### `SetKitSize(size)`
* **Description:** Stores the kit size and saves.
* **Parameters:** `size` (number)  
* **Returns:** None  

### `GetKitBuild()`
* **Description:** Returns the stored kit build string, or empty string.
* **Parameters:** None  
* **Returns:** String  

### `SetKitBuild(build)`
* **Description:** Stores the kit build string and saves.
* **Parameters:** `build` (string)  
* **Returns:** None  

### `GetKitLastTime()`
* **Description:** Returns the last time the kit was used (timestamp), or `0`.
* **Parameters:** None  
* **Returns:** Number  

### `SetKitLastTime(last_time)`
* **Description:** Stores the kit last usage time and saves.
* **Parameters:** `last_time` (number)  
* **Returns:** None  

### `GetKitHunger()`
* **Description:** Returns the kit’s hunger value, or `0`.
* **Parameters:** None  
* **Returns:** Number  

### `SetKitHunger(hunger)`
* **Description:** Stores the kit’s hunger value and saves.
* **Parameters:** `hunger` (number)  
* **Returns:** None  

### `GetKitHappiness()`
* **Description:** Returns the kit’s happiness value, or `0`.
* **Parameters:** None  
* **Returns:** Number  

### `SetKitHappiness(happiness)`
* **Description:** Stores the kit’s happiness value and saves.
* **Parameters:** `happiness` (number)  
* **Returns:** None  

### `GetKitBirthTime()`
* **Description:** Returns the kit’s birth timestamp, or `0`.
* **Parameters:** None  
* **Returns:** Number  

### `SetKitBirthTime(birth_time)`
* **Description:** Stores the kit’s birth timestamp and saves.
* **Parameters:** `birth_time` (number)  
* **Returns:** None  

### `GetKitName()`
* **Description:** Returns the kit’s name, or empty string.
* **Parameters:** None  
* **Returns:** String  

### `SetKitName(name)`
* **Description:** Stores the kit’s name and saves.
* **Parameters:** `name` (string)  
* **Returns:** None  

### `GetKitPoops()`
* **Description:** Returns the kit’s poops count, or `0`.
* **Parameters:** None  
* **Returns:** Number  

### `SetKitPoops(poops)`
* **Description:** Stores the kit’s poops count and saves.
* **Parameters:** `poops` (number)  
* **Returns:** None  

### `GetKitAbandonedMessage()`
* **Description:** Returns whether the abandoned message was shown for the kit.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `false`)  

### `SetKitAbandonedMessage(abandoned)`
* **Description:** Stores the abandoned message flag and saves.
* **Parameters:** `abandoned` (boolean)  
* **Returns:** None  

### `GetKitIsHibernating()`
* **Description:** Returns whether the kit is hibernating.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `false`)  

### `SetKitIsHibernating(hibernating)`
* **Description:** Stores the hibernation state and saves.
* **Parameters:** `hibernating` (boolean)  
* **Returns:** None  

### `GetKitHibernationStart()`
* **Description:** Returns the hibernation start timestamp, or `0`.
* **Parameters:** None  
* **Returns:** Number  

### `SetKitHibernationStart(time)`
* **Description:** Stores the hibernation start timestamp and saves.
* **Parameters:** `time` (number)  
* **Returns:** None  

### `GetLanguageID()`
* **Description:** Returns the user’s selected language ID. Falls back to system language (console) or `LANGUAGE.ENGLISH`.
* **Parameters:** None  
* **Returns:** String (e.g., `"ENGLISH"`)  

### `SetLanguageID(language_id, cb)`
* **Description:** Sets the language ID, saves profile, and calls callback (if provided).
* **Parameters:**  
  `language_id` (string)  
  `cb` (function?, optional)  
* **Returns:** None  

### `GetWobyIsLocked()`
* **Description:** Returns true if Woby is locked (i.e., not unlocked yet). Uses inverted logic (`woby_unlocked` stores `not locked`).
* **Parameters:** None  
* **Returns:** Boolean  

### `SetWobyIsLocked(locked)`
* **Description:** Updates the Woby unlock status. Stores `not locked` as `woby_unlocked`.
* **Parameters:** `locked` (boolean)  
* **Returns:** None  

### `GetCommandWheelAllowsGameplay()`
* **Description:** Returns whether the command wheel is allowed during gameplay.
* **Parameters:** None  
* **Returns:** Boolean (defaults to `false` if missing and using settings file)  

### `SetCommandWheelAllowsGameplay(enabled)`
* **Description:** Sets the command wheel gameplay permission.
* **Parameters:** `enabled` (boolean)  
* **Returns:** None  

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified