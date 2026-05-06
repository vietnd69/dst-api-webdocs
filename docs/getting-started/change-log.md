---
id: change-log
title: Scripts Changelog
description: Build-by-build changelog for the DST Lua API documentation.
tags: [changelog]
sidebar_position: 3
last_updated: 2026-04-17
build_version: 722832
change_status: updated
---

# Scripts Changelog

## Build 722832

Introduce comprehensiveWX-78 upgrades, shadow-mechanics integration, and extensive localization updates across game core, components, prefabs, and UI systems  

- Add WX-78's new *Possessed Body* ability with dedicated brain, stategraphs, and prefabs, including support for package-less operation  
- Implement *Shadow Socket System* via new `socketable`, `socketholder`, `socket_shadow_*` components and prefabs for Harvester, Heart, and Mimicry  
- Redesign WX-78's gameplay via `wx78*.lua` and `wx78_*.lua` files, including drone delivery/scout/zap prefabs, drone Scout tracking, shield, taser buildup, ability cooldowns, and scanner enhancements  
- Overhaul WX-78's stategraphs and brains (e.g., `SGwx78_*`, `wx78_*brain.lua`, `wx78_scannerbrain.lua`) with new abilities and behaviors  
- Extend inventory and container systems with `container`, `inventory`, `equippable`, `stackable`, and `replica` component refactors; add `inventory_classified`, `container_classified`, `player_classified`  
- Revamp upgrade modules system with `upgrademoduleowner`, `upgrademoduleremover`, `socket_shadow_harvester`, and new UI display widgets (`upgrademodulesdisplay`, `upgrademodulesdisplay_inspecting`)  
- Add `aoediminishingreturns`, `clockworktracker`, `globaltrackingicon`, `mapdeliverable`, `wanderer ability cooldowns`, and `leaderrollcall` components  
- Introduce `runawaytodist` behaviour and new WX-78-specific prefabs (e.g., `wx78_drone_*`, `wx78_gestalttrapper`, `wx78_heartveinspawner`, `wx78_shadow_heart_debuff`)  
- Expand speech lines for all 16 playable characters (Willoby, Wortox, Willow, Wendy, Wolfgang, Wickerbottom, Wurt, Winona, Walter, Wathgrithr, Waxwell, Webber, Woodie, Wormwood, Wx78, Warly) with consistent +90/-4 line changes  
- Significantly expand Chinese translations (Simplified: +3319/-139, Traditional: +3320/-140) and strings system (+220/-25), plus `.pot` update (+3301/-121)  
- Refactor skill trees for all 16 characters, including `skilltree_*`, `skilltree_defs`, and tuning of skill unlocks and node counts  
- Improve UI components: `inventorybar`, `statusdisplays`, `healthbadge`, `containerwidget`, `mapscreen`, `controls`, `hoverer`, and new `dronezapover`, `wxpowerover` widgets  
- Enhance debugging and tuning (`debugcommands`, `constants`, `tuning`, `actions`, `map/levels/*`) with expanded quagmire, forest, cave, lava arena, and worldtile definitions  
- Modernize item systems: update `item_blacklist`, `inventoryitem`, `edible`, `equippable`, `fertilizer`, `hauntable`, `inventoryitemmoisture`, `linkeditemmanager`, `util`, and `playeractionpicker`  
- Refactor player controller and vision logic (`playercontroller`, `playervision`, `components/player_common_extensions`, `player_common`)  
- Improve camera, haptics, and rendering with `followcamera`, `haptics`, `postprocesseffects`, `preloadsounds`, `fx`, and `mixes`  
- Clean up and consolidate brain logic (`braincommon`, `abigailbrain`, `pigbrain`, `catcoonbrain`, `beebrain`, `mermbrain`, `buzzardbrain`, etc.)  
- Update localization files, language strings, and scrapbook data (`scrapbook_prefabs`, `scrapbookdata`, `skin_strings`, `skin_affinity_info`, `skin_assets`, `skinsutils`, `skins_defs_data`, `skin_gifts`)  
- Refine stategraphs (`SGwilson`, `SGwilson_client`, `commonstates`, `bunnyman`, `mimic`, `lunarthrall_plant_gestalt`, `brightmare_gestalt`, `wx78_*`) and behaviour trees (`chaseandattack`, `standandattack`, `braincommon`, ` behaviours/`)  

### Added
- `behaviours/runawaytodist.lua`
- `brains/wx78_possessedbodybrain.lua`
- `brains/wx78_possessedbodybrain_no_package.lua`
- `components/aoediminishingreturns.lua`
- `components/clockworktracker.lua`
- `components/globaltrackingicon.lua`
- `components/leaderrollcall.lua`
- `components/mapdeliverable.lua`
- `components/socket_shadow_harvester.lua`
- `components/socket_shadow_heart.lua`
- `components/socket_shadow_mimicry.lua`
- `components/socketable.lua`
- `components/socketholder.lua`
- `components/useableequippeditem.lua`
- `components/wx78_abilitycooldowns.lua`
- `components/wx78_dronescouttracker.lua`
- `components/wx78_shield.lua`
- `components/wx78_taserbuildup.lua`
- `prefabs/bufferedmapaction.lua`
- `prefabs/shadow_harvester_trail.lua`
- `prefabs/shadow_heart_vein.lua`
- `prefabs/skilltree_wx78.lua`
- `prefabs/wx78_abilitycooldown.lua`
- `prefabs/wx78_backupbody.lua`
- `prefabs/wx78_classified.lua`
- `prefabs/wx78_common.lua`
- `prefabs/wx78_drone_delivery.lua`
- `prefabs/wx78_drone_scout.lua`
- `prefabs/wx78_drone_zap.lua`
- `prefabs/wx78_foodbrick.lua`
- `prefabs/wx78_gestalttrapper.lua`
- `prefabs/wx78_heartveinspawner.lua`
- `prefabs/wx78_inventorycontainer.lua`
- `prefabs/wx78_lightbeam.lua`
- `prefabs/wx78_mimicspawner.lua`
- `prefabs/wx78_possessedbody.lua`
- `prefabs/wx78_shadow_heart_debuff.lua`
- `prefabs/wx78_taser_projectile.lua`
- `stategraphs/SGwx78_common.lua`
- `stategraphs/SGwx78_drone_scout.lua`
- `stategraphs/SGwx78_drone_zap.lua`
- `stategraphs/SGwx78_possessedbody.lua`
- `stategraphs/SGwx78_possessedbody_no_package.lua`
- `widgets/dronezapover.lua`
- `widgets/upgrademodulesdisplay_inspecting.lua`
- `widgets/wxpowerover.lua`

### Modified
- `simutil.lua`
- `prefabs/storage_robot_common.lua`
- `componentactions.lua`
- `prefabs/voidcloth_scythe.lua`
- `map/levels/quagmire.lua`
- `prefabs/skilltree_willow.lua`
- `postprocesseffects.lua`
- `languages/chinese_t.po`
- `components/playeractionpicker.lua`
- `prefabs/fertilizer_nutrient_defs.lua`
- `prefabs/inventoryitem_classified.lua`
- `prefabs/nightstick.lua`
- `prefabskins.lua`
- `prefabs/skilltree_wortox.lua`
- `stategraphs/SGbunnyman.lua`
- `prefabskin.lua`
- `components/dynamicmusic.lua`
- `components/cattoy.lua`
- `screens/mapscreen.lua`
- `map/levels/forest.lua`
- `entityscript.lua`
- `components/fertilizer.lua`
- `components/wisecracker.lua`
- `stategraphs/SGitemmimic_revealed.lua`
- `stategraphs/SGcozy_bunnyman.lua`
- `speech_wilson.lua`
- `widgets/secondarystatusdisplays.lua`
- `components/penguinspawner.lua`
- `prefabs/corpse_gestalt.lua`
- `prefabs/boat_leak.lua`
- `debugkeys.lua`
- `components/pocketwatch_dismantler.lua`
- `prefabs/itemmimic_revealed.lua`
- `components/colourcube.lua`
- `prefabs/scandata.lua`
- `prefabs/hud.lua`
- `components/container.lua`
- `components/leader.lua`
- `prefabs/event_deps.lua`
- `components/upgrademoduleremover.lua`
- `brains/crabkingclawbrain.lua`
- `speech_wendy.lua`
- `languages/chinese_s.po`
- `components/combat_replica.lua`
- `actions.lua`
- `speech_wolfgang.lua`
- `components/periodicspawner.lua`
- `stategraphs/commonstates.lua`
- `prefabs/preparedfoods.lua`
- `brains/abigailbrain.lua`
- `prefabs/clockwork_common.lua`
- `prefabs/wagpunk_workstation.lua`
- `prefabs/willow_ember_common.lua`
- `widgets/healthbadge.lua`
- `prefabs/wagdrone_projectile.lua`
- `stategraphs/SGwilson.lua`
- `recipe.lua`
- `prefabs/skilltree_wendy.lua`
- `speech_wanda.lua`
- `prefabs/skinprefabs.lua`
- `widgets/inventorybar.lua`
- `components/beard.lua`
- `prefabs/miasma_cloud_fx.lua`
- `speech_wickerbottom.lua`
- `components/birdspawner.lua`
- `widgets/wandaagebadge.lua`
- `widgets/containerwidget.lua`
- `worldtiledefs.lua`
- `screens/playerhud.lua`
- `prefabs/skilltree_woodie.lua`
- `screens/redux/scrapbookdata.lua`
- `prefabs/nightmarefuel.lua`
- `speech_wurt.lua`
- `prefabs/wortox.lua`
- `components/deerclopsspawner.lua`
- `components/itemmimic.lua`
- `components/mapspotrevealer.lua`
- `components/linkeditemmanager.lua`
- `prefabs/phonograph.lua`
- `components/beargerspawner.lua`
- `prefabs/player_common_extensions.lua`
- `prefabs/inventory_classified.lua`
- `prefabs/shadowheart.lua`
- `prefabs/player_common.lua`
- `components/builder.lua`
- `components/playervision.lua`
- `components/skilltreeupdater.lua`
- `components/mutatedbuzzardmanager.lua`
- `speech_wx78.lua`
- `components/sanity.lua`
- `components/hauntable.lua`
- `behaviours/chaseandattack.lua`
- `components/locomotor.lua`
- `prefabs/container_classified.lua`
- `brains/brightmare_gestaltbrain.lua`
- `widgets/controls.lua`
- `prefabs/shadow_battleaxe.lua`
- `prefabs/lunarthrall_plant_gestalt.lua`
- `prefabs/skilltree_defs.lua`
- `components/inventoryitem.lua`
- `prefabs/gestalt_cage.lua`
- `components/container_replica.lua`
- `brains/lunarthrall_plant_gestalt_brain.lua`
- `speech_wormwood.lua`
- `prefabs/lightflier.lua`
- `skin_affinity_info.lua`
- `map/customize.lua`
- `brains/catcoonbrain.lua`
- `components/useabletargeteditem.lua`
- `util.lua`
- `languages/strings.pot`
- `components/eater.lua`
- `components/combat.lua`
- `stategraphs/SGlunarthrall_plant_gestalt.lua`
- `stategraphs/SGpig.lua`
- `speech_woodie.lua`
- `prefabs/global.lua`
- `components/petleash.lua`
- `prefabs/lunarthrall_plant_gestalt.lua`
- `prefabs/wormwood_lightflier.lua`
- `widgets/upgrademodulesdisplay.lua`
- `prefabs/staff.lua`
- `speech_webber.lua`
- `cameras/followcamera.lua`
- `componentutil.lua`
- `components/wateryprotection.lua`
- `prefabs/shadowwaxwell.lua`
- `brains/braincommon.lua`
- `components/batteryuser.lua`
- `components/inventory.lua`
- `wx78_moduledefs.lua`
- `prefabs/skilltree_wurt.lua`
- `map/levels/caves.lua`
- `prefabs/bishop_charge.lua`
- `preparedfoods_warly.lua`
- `components/sheltered.lua`
- `components/moosespawner.lua`
- `speech_wathgrithr.lua`
- `skinsutils.lua`
- `saveindex.lua`
- `components/skinner.lua`
- `components/inventoryitemmoisture.lua`
- `shardindex.lua`
- `debugcommands.lua`
- `strings.lua`
- `stategraphs/SGwilson_client.lua`
- `components/playercontroller.lua`
- `prefabs/winona_battery_high.lua`
- `brains/moosebrain.lua`
- `brains/pigbrain.lua`
- `speech_warly.lua`
- `prefabs/carnival_prizeticket.lua`
- `mixes.lua`
- `prefabs/dumbbells.lua`
- `components/stackable_replica.lua`
- `components/lureplantspawner.lua`
- `components/equippable_replica.lua`
- `skin_strings.lua`
- `prefabs/compostwrap.lua`
- `components/upgrademoduleowner.lua`
- `map/levels/lavaarena.lua`
- `widgets/redux/skilltreewidget.lua`
- `recipes_filter.lua`
- `prefabs/player_classified.lua`
- `components/selfstacker.lua`
- `brains/itemmimic_revealedbrain.lua`
- `skin_gifts.lua`
- `widgets/invslot.lua`
- `prefabs/wx78_moduleremover.lua`
- `prefabs/wobycommon.lua`
- `brains/buzzardbrain.lua`
- `consolecommands.lua`
- `prefabs/spoiledfood.lua`
- `components/battery.lua`
- `stategraphs/SGbrightmare_gestalt.lua`
- `constants.lua`
- `stategraphs/SGsharkboi.lua`
- `speech_walter.lua`
- `item_blacklist.lua`
- `prefabs/woodie.lua`
- `components/slipperyfeet.lua`
- `components/efficientuser.lua`
- `brains/brightmare_gestaltguardbrain.lua`
- `components/equippable.lua`
- `widgets/widget.lua`
- `prefabs/egg.lua`
- `components/shadowthrall_mimics.lua`
- `prefabs/wx78_scanner.lua`
- `components/dataanalyzer.lua`
- `prefabs/moonrockseed.lua`
- `recipes.lua`
- `widgets/itemtile.lua`
- `prefabs/lightningrod.lua`
- `prefabs/wx78_modules.lua`
- `brains/mermbrain.lua`
- `screens/redux/multiplayermainscreen.lua`
- `components/domesticatable.lua`
- `speech/winona.lua`
- `fx.lua`
- `prefabs/goatmilk.lua`
- `components/builder_replica.lua`
- `speech/waxwell.lua`
- `behaviours/standandattack.lua`
- `misc_items.lua`
- `prefabs/wagdrone_flying.lua`
- `prefabs/merm.lua`
- `prefabs/onemanband.lua`
- `prefabs/tillweedsalve.lua`
- `prefabs/tree_rocks.lua`
- `components/hitchable.lua`
- `prefabs/skilltree_wormwood.lua`
- `prefabs/shadowheart_infused.lua`
- `components/maprevealable.lua`
- `components/shardtransactionsteps.lua`
- `prefabs/spider.lua`
- `components/gestaltcapturable.lua`
- `prefabs/birdtrap.lua`
- `prefabs/w_radio.lua`
- `prefabs/skilltree_wilson.lua`
- `components/edible.lua`
- `widgets/statusdisplays.lua`
- `prefabs/skilltree_wathgrithr.lua`
- `clothing.lua`
- `components/spawnfader.lua`
- `components/inventory_replica.lua`
- `speech/willow.lua`
- `components/inventoryitem_replica.lua`
- `speech/wortox.lua`
- `components/stackable.lua`
- `skin_assets.lua`
- `components/linkeditem.lua`
- `components/vaultroom.lua`
- `components/saltlicker.lua`
- `components/gestaltcage.lua`
- `components/inventoryitemholder.lua`
- `prefabs/gestalt_alterguardian_projectile.lua`
- `prefabs/wx78.lua`
- `prefablist.lua`
- `components/follower.lua`
- `prefabs/walter.lua`
- `widgets/mapwidget.lua`
- `networkclientrpc.lua`
- `scrapbook_prefabs.lua`
- `mainfunctions.lua`
- `components/butterflyspawner.lua`
- `widgets/wx78moisturemeter.lua`
- `screens/quagmire_recipebookscreen.lua`
- `map/levels.lua`
- `prefabs/oceanwhirlbigportal.lua`
- `prefabs/skilltree_wolfgang.lua`
- `preloadsounds.lua`
- `tuning.lua`
- `components/singinginspiration.lua`
- `components/focalpoint.lua`
- `brains/mushgnomebrain.lua`
- `skins_defs_data.lua`
- `brains/wx78_scannerbrain.lua`
- `prefabs/abigail.lua`
- `prefabs/ghost.lua`
- `screens/cookbookpopupscreen.lua`
- `stategraphs/SGwx78_scanner.lua`
- `stategraphs/SGbuzzard.lua`
- `components/charliecutscene.lua`
- `cooking.lua`
- `widgets/hoverer.lua`
- `prefabs/oceanwhirlportal.lua`
- `components/followermemory.lua`
- `prefabs/winona_battery_low.lua`
- `brains/corpse_gestalt_brain.lua`
- `stategraphs/SGbearger.lua`

### Deleted
- (none)

### Moved
- (none)

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
