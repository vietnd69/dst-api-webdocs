---
id: change-log
title: Scripts Changelog
description: Build-by-build changelog for the DST Lua API documentation.
tags: [changelog]
sidebar_position: 3
last_updated: 2026-04-11
build_version: 719586
change_status: updated
---

# Scripts Changelog

## Build 719586

Add new skin strings and localization for Chinese (Simplified and Traditional) and asset references

- Add 10 new string entries across `skin_strings.lua` and language files for Chinese (Simplified, Traditional) and POT templates  
- Update `prefabskins.lua`, `skins_defs_data.lua`, `prefabs/skinprefabs.lua`, and `skin_assets.lua` to incorporate new skin definitions and references  

### Added
- None

### Modified
- prefabskins.lua  
- skins_defs_data.lua  
- prefabs/skinprefabs.lua  
- languages/chinese_s.po  
- skin_strings.lua  
- languages/chinese_t.po  
- languages/strings.pot  
- skin_assets.lua  

### Deleted
- None

### Moved
- None

## Build 718694

This update introduces support for a new character—W. Radio—with associated dialogue, skin, and recipe integration, and adds a new critter, the Bulbin, with its own state graph and AI brain. Major modifications include expanded skin and localization support across Chinese (Simplified/Traditional), alongside refactors to the crafting UI, builder components, and math utilities. Several speech, recipe, and prefabs files were updated to accommodate character additions and balance tweaks.

### Added
- `prefabs/w_radio.lua`
- `stategraphs/SGcritter_bulbin.lua`

### Modified
- `brains/crittersbrain.lua`
- `strings.lua`
- `languages/chinese_t.po`
- `speech_waxwell.lua`
- `widgets/redux/craftingmenu_pinslot.lua`
- `recipes.lua`
- `util/sourcemodifierlist.lua`
- `speech_walter.lua`
- `speech_wolfgang.lua`
- `languages/chinese_s.po`
- `speech_wickerbottom.lua`
- `speech_willow.lua`
- `speech_wortox.lua`
- `speech_wathgrithr.lua`
- `prefablist.lua`
- `prefabskins.lua`
- `widgets/redux/craftingmenu_widget.lua`
- `prefabs/hermitcrab.lua`
- `speech_wendy.lua`
- `speech_wormwood.lua`
- `speech_warly.lua`
- `misc_items.lua`
- `prefabs/skinprefabs.lua`
- `item_blacklist.lua`
- `networkclientrpc.lua`
- `skins_defs_data.lua`
- `components/builder.lua`
- `stategraphs/SGcritter_common.lua`
- `skin_gifts.lua`
- `speech_webber.lua`
- `components/builder_replica.lua`
- `mathutil.lua`
- `widgets/redux/craftingmenu_hud.lua`
- `speech_wurt.lua`
- `prefabs/critters.lua`
- `prefabskin.lua`
- `languages/strings.pot`
- `prefabs/reskin_tool.lua`
- `recipes_filter.lua`
- `skin_assets.lua`
- `skin_strings.lua`
- `speech_woodie.lua`
- `speech_wx78.lua`
- `components/upgrademoduleowner.lua`
- `constants.lua`
- `recipe.lua`
- `speech_winona.lua`
- `speech_wilson.lua`
- `speech_wanda.lua`

### Deleted
— none —

### Moved
— none —
