---
id: hats
title: Hats
description: The hats component defines and manages wearable headgear prefabs in Don't Starve Together, providing equip/unequip logic, component integration (armor, fueled, waterproofer, etc.), and hat-specific behaviors like light control, pet followers, and skill-attuned mechanics.
tags: [equippable, inventory, components, prefabs, networked]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 349034a3
system_scope: inventory
---

# Hats

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `hats.lua` file defines a comprehensive set of hat prefabs in Don't Starve Together's Entity Component System. Each hat is instantiated via factory functions (`fns.<name>()`) that call `simple()` (or variants) to create and configure an `inst` entity with appropriate components (`equippable`, `fueled`, `armor`, `waterproofer`, `insulator`, `perishable`, `container`, `useableitem`, etc.). Hats support dynamic equipping/unequipping via custom callbacks, network synchronization, save/load hooks, FX management, and skin compatibility. Many hats feature skill-attuned behavior (e.g., Wathgrithr and Walter hats), periodic logic (spider, mushroom, wathgrithr), conditional equip logic (open-top vs full-helm), and event-driven transformations (ruins forcefield, top magician conversion). The system supports layered animations, FX entities, and complex interactions with players, followers, and world state.

## Usage example
```lua
-- Create a Miner Hat and equip it
local hat = require "prefabs/hats".fns.miner()
hat.components.equippable:Equip(player)
-- Turn light on manually if needed
hat.components.fueled:StartConsuming()
hat.components.fueled.burning = true
-- Listen for equipping events
player:ListenForEvent("equipskinneditem", function(e, data)
    if data and data.item == hat then
        print("Miner hat equipped with skin:", data.skin)
    end
end)
```

## Dependencies & tags
**Components used:** `equippable`, `fueled`, `inventoryitem`, `inspectable`, `tradable`, `snowmandecor`, `armor`, `waterproofer`, `insulator`, `perishable`, `repairable`, `floater`, `preserver`, `firemaker`, `useableitem`, `eater`, `lootdropper`, `sleeper`, `light`, `container`, `preserver`, `petleash`, `leader`, `migrationpetowner`, `setbonus`, `planardefense`, `damagetyperesist`, `shadowlevel`, `targettracker`, `freezable`, `combat`, `health`, `grue`, `talker`, `soundemitter`, `colouradder`, `colouraddersync`, `updatelooper`, `closeinspector`, `inspectaclesparticipant`, `roseinspectableuser`, `skilltreeupdater`, `planted`, `plantregistry`, `elixer_buff`, `rechargeable`, `luckuser`, `entitytracker`, `migrationpetowner`, `component.health`, `component.health`, `component.dapper`, `component.foodeffect`, `component.foodmemory`, `component.birdattractor`, `component.shadowdominance`, `component.shadowthrall_parasite_hosted`, `component.dappernessmod`, `component.shadowlevel`, `component.dappernessmod`, `component.shadowlevel`, `component.shadowdominance`.

**Tags:** `"hat"`, `"waterproofer"`, `"open_top_hat"`, `"shadowlevel"`, `"shadow_item"`, `"nocrafting"`, `"wood"`, `"forcefield"`, `"metal"`, `"hardarmor"`, `"beefalo"`, `"cattoy"`, `"balloon"`, `"noepicmusic"`, `"battlehelm"`, `"heavyarmor"`, `"good_sleep_aid"`, `"hide"`, `"show_spoilage"`, `"frozen"`, `"icebox_valid"`, `"HASHEATER"`, `"spiderdisguise"`, `"monster"`, `"pig"`, `"battleborn_repairable"`, `"magiciantool"`, `"nightvision"`, `"spoiler"`, `"moon_spore_protection"`, `"regal"`, `"goggles"`, `"scrapmonolevision"`, `"junk"`, `"inspectaclesvision"`, `"cannotuse"`, `"roseglassesvision"`, `"elixir_drinker"`, `"ghost_ally"`, `"handfed"`, `"fedbyall"`, `"rabbitdisguise"`, `"mermarmorhat"`, `"mermarmorupgradedhat"`, `"shadowthrall_parasite"`, `"shadowthrall_parasite_hosted"`, `"shadowthrall_parasite_mask"`, `"shadowthrall_parasite"` (duplicate), `"nosteal"`, `"ancient_reader"`, `"plantinspector"`, `"detailedplanthappiness"`, `"nutrientsvision"`, `"gestaltprotection"`, `"cloth"`, `"lunarplant"`, `"fullhelm_hat"`, `"miasmaimmune"`, `"lunar_aligned"`, `"shadow_aligned"`, `"dreadstone"`, `"lunarseed"`, `"spore"`, `"lunarseedmaxed"`, `"broken"`, `"lunarplanthat"`, `"spook_protection"`, `"waxable"`, `"unluckysource"`, `"luckysource"`, `"yoth_princesscooldown_buff"`, `"master_crewman"`, `"boat_health_buffer"`, `"merm"`, `"mermdisguise"`, `"usesvegetarianequipment"`, `"moonstormevent_detector"`, `"shadowdominance"`, `"turfhat"`, `"mushhathat"`, `"plantregistry_open"`, `"plantregistry_open"`, `"plantregistry_open"`, `"shadowthrall_parasite"` (duplicate), `"FX"`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.entity` | `AnimState | Transform | Network` | N/A | Entity visualization and network properties. |
| `inst.components.equippable.equipslot` | `EQUIPSLOT` | `EQUIPSLOTS.HEAD` | The slot where the hat is equipped. |
| `inst.components.equippable.dapperness` | `float` | varies per hat | Dapperness modifier applied when equipped. |
| `inst._skinfns` | `table` | `nil` | Skinning callbacks (mastersim only). |
| `inst.components.fueled.fueltype` | `string` | varies per hat | Fuel type used (e.g., `"torch"`, `"wormlight"`). |
| `inst.components.fueled.maxfuel` | `number` | varies per hat | Max fuel capacity. |
| `inst.components.fueled.ondepletedfn` | `function` | varies per hat | Called when fuel depletes (e.g., `miner_perish`, `eyebrella_perish`). |
| `inst.container` | `Container` | `nil` | Optional container (e.g., top hat, antlion hat). |
| `inst._light` | `Entity` | `nil` | Light entity (miner, top hats). |
| `inst._fx` | `Entity` | `nil` | FX container (ruins hat forcefield, top hat FX). |
| `inst.updatetask` | `Task` | `nil` | Periodic update task (spider hat). |
| `inst._owner` | `Entity` | `nil` | Owner reference used in hat-specific logic. |
| `inst.procfn` | `function` | `nil` | Proc function (ruins hat forcefield). |
| `inst.onattach` / `inst.ondetach` | `function` | `nil` | Equip/unequip callbacks (ruins hat). |
| `inst._onskillrefresh` | `function` | `nil` | Skill refresh callback (wathgrithr/walter hats). |
| `inst._is_improved_hat` | `boolean` | `nil` | Flag for improved wathgrithr hat. |
| `inst.displaynamefn` | `function` | `nil` | Display name generator (top hat magician). |
| `inst.onprebuilt` | `function` | `nil` | Called on build (top hat magician conversion). |
| `inst.onactivateskill_server` | `function` | `nil` | Skill activation listener (wathgrithr/walter). |
| `inst.ondeactivateskill_server` | `function` | `nil` | Skill deactivation listener (wathgrithr/walter). |
| `inst._front` / `inst._back` | `Entity` | `nil` | Visual parts (alterguardian, voidcloth hats). |
| `inst._moonglass_reserved` | `table` | `nil` | Reserved moonglass list (alterguardian). |
| `inst._pending_lunarseedplant` | `boolean` | `nil` | Flag for pending gestalt planting (alterguardian). |
| `inst.keep_closed` | `boolean` | `nil` | Save/load state for top hat container. |
| `inst.signalpulse` / `inst.signallevel` | `number` | `nil` | Networked fields (inspectacles hat). |
| `inst.showface` / `inst.waxed` / `inst.face` / `inst.base` | `number` | `nil` | Networked face/wax state (pumpkin hat). |
| `inst.iswinter` | `boolean` | `nil` | Networked winter build flag (rabbit hat). |
| `inst.level` | `number` | `nil` | Networked FX level (wagpunk hat). |
| `inst.ledstate` | `number` | `nil` | Networked LED state (inspectacles hat). |
| `inst.skinbuildhash` | `number` | `nil` | Networked skin hash (lunarplant/voidcloth hats). |
| `inst.buffed` | `boolean` | `nil` | Networked buff state (voidcloth hat). |

## Main functions
### `fns.simple()`
* **Description:** Base constructor for hat prefabs. Initializes `inst` with transforms, `AnimState`, `Network`, tags, and core components (`snowmandecor`, `inventoryitem`, `inspectable`, `tradable`, `equippable`, `fueled`, `armor`, `waterproofer`, `insulator`, `perishable`, `repairable`, `floater`, `preserver`). Applies network sync and customization hooks per hat type. Handles `OnSave`, `OnLoad`, `OnRemoveEntity`, and display callbacks.
* **Parameters:** `...` — optional custom init callback(s) for hat-specific setup.
* **Returns:** `inst` — initialized hat entity instance.

### `_base_onequip(inst, owner, symbol_override, swap_hat_override)`
* **Description:** Base equipping logic: applies skin overrides via `_skinfns`, starts fuel consumption if `fueled`, and plays `swap_hat` sound. Pushes `"equipskinneditem"` event.
* **Parameters:**
  - `inst`: the hat entity.
  - `owner`: the entity equipping the hat.
  - `symbol_override`: optional anim symbol override (default `"swap_hat"`).
  - `swap_hat_override`: optional swap symbol override (default `"swap_hat"`).
* **Returns:** None.

### `_onequip(inst, owner, symbol_override, headbase_hat_override)
* **Description:** Standard equipping for closed-top hats. Hides hair layers, shows `"headbase_hat"` layer, handles player-specific layers. Calls `_base_onequip`.
* **Parameters:**
  - `inst`, `owner`, `symbol_override`: same as `_base_onequip`.
  - `headbase_hat_override`: optional layer symbol (e.g., `"headbase_walter_hat"`).
* **Returns:** None.

### `_onunequip(inst, owner)`
* **Description:** Reverses `_onequip`: clears overlays, restores hair layers, stops fuel consumption, unsets skins, pushes `"unequipskinneditem"`.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `fns.simple_onequip(inst, owner, from_ground)`
* **Description:** Wrapper for `_onequip`; used as default equipping callback.
* **Parameters:** `inst`, `owner`, `from_ground` (unused).
* **Returns:** None.

### `fns.simple_onunequip(inst, owner, from_ground)`
* **Description:** Wrapper for `_onunequip`; used as default unequipping callback.
* **Parameters:** `inst`, `owner`, `from_ground` (unused).
* **Returns:** None.

### `fns.opentop_onequip(inst, owner)`
* **Description:** Equips open-top hats: hides hair, does NOT hide `"HEAD"` layer or show `"headbase_hat"`.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `fns.fullhelm_onequip(inst, owner)`
* **Description:** Equips full helmets: hides hair and `"HEAD"` layer, shows helmet layer, hides face/beard on players, enables head-hat exchange.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `fns.fullhelm_onunequip(inst, owner)`
* **Description:** Unequips full helmets: calls `_onunequip`, restores face/beard, disables head-hat exchange.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `fns.straw()`, `fns.bee()`, `fns.earmuffs()`, `fns.winter()`, `fns.football()`, `fns.woodcarved()`, `fns.ruins()`, `fns.feather()`, `fns.beefalo()`, `fns.walrus()`, `fns.miner()`, `fns.spider()`, `fns.top()`, `fns.nightcap()`, `fns.bush()`, `fns.flower()`, `fns.kelp()`, `fns.cookiecutter()`, `fns.slurtle()`, `fns.rain()`, `fns.eyebrella()`, `fns.balloon()`, `fns.wathgrithr()`, `fns.walter()`, `fns.ice()`, `fns.catcoon()`, `fns.watermelon()`, `fns.mole()`, `fns.red_mushroom()`, `fns.green_mushroom()`, `fns.blue_mushroom()`, `fns.moon_mushroom()`, `fns.hive()`, `fns.dragon()`, `fns.desert()`, `fns.goggles()`, `fns.moonstorm_goggles()`, `fns.eyemask()`, `fns.antlion()`, `fns.polly_rogers()`, `fns.salty_dog()`, `fns.mask()`, `fns.mask_shadowthrall()`, `fns.mask_ancient()`, `fns.monkey_small()`, `fns.monkey_medium()`, `fns.skeleton()`, `fns.merm()`, `fns.batnose()`, `fns.plantregistry()`, `fns.nutrientsgoggles()`, `fns.alterguardian()`, `fns.dreadstone()`, `fns.lunarplant()`, `fns.voidcloth()`, `fns.wagpunk()`, `fns.scrap_monocle()`, `fns.scrap()`, `fns.inspectacles()`, `fns.roseglasses()`, `fns.ghostflower()`, `fns.rabbit()`, `fns.mermarmor()`, `fns.mermarmorupgraded()`, `fns.shadowthrall_parasite()`, `fns.pumpkin()`, `fns.princess()`, `fns.yoth_knight()`
* **Description:** Hat-specific constructors that call `fns.simple()` with appropriate init callbacks, components, and settings. See chunk analysis for component composition and behavior (e.g., fueled, armor, waterproofer, spider followers, forcefield, skill-attuned stats, FX, container, etc.). Most return fully initialized `inst`.
* **Parameters:** None.
* **Returns:** `inst`.

### `ruinshat_proc(inst, owner)`
* **Description:** Activates ruins hat forcefield: adds `"forcefield"` tag, spawns FX, sets absorption to 100%, applies sanity damage on damage, schedules unproc.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `ruinshat_unproc(inst)`
* **Description:** Deactivates forcefield: removes tag and FX, restores absorption, schedules cooldown task.
* **Parameters:** `inst`.
* **Returns:** None.

### `tryproc(inst, owner, data)`
* **Description:** Attempts ruins hat proc: rolls luck and calls `ruinshat_proc` if successful.
* **Parameters:** `inst`, `owner`, `data` (attack data; skips if redirected).
* **Returns:** None.

### `spider_enable(inst)`
* **Description:** Starts spider hat logic: adds `"monster"`/`"spiderdisguise"` tags and starts `spider_update` periodic task.
* **Parameters:** `inst`.
* **Returns:** None.

### `spider_disable(inst)`
* **Description:** Stops spider logic: cancels update task, removes `"monster"`/`"spiderdisguise"` tags, unattaches followers.
* **Parameters:** `inst`.
* **Returns:** None.

### `spider_update(inst)`
* **Description:** Periodic task: clears pig followers and spawns nearby spiders as followers if slot available.
* **Parameters:** `inst`.
* **Returns:** None.

### `top_convert_to_magician(inst)`
* **Description:** Converts standard top hat to magician version: adds `"shadow_item"`/`"nocrafting"` tags, sets `shadowlevel`, adds `magiciantool`, equip/unequip FX callbacks.
* **Parameters:** `inst`.
* **Returns:** None.

### `top_onstartusing(inst, doer)`
* **Description:** Opens hidden top hat container (`tophat_container`) and plays looping sound.
* **Parameters:** `inst`, `doer`.
* **Returns:** None.

### `top_onstopusing(inst, doer)`
* **Description:** Closes container, removes it, kills sound.
* **Parameters:** `inst`, `doer`.
* **Returns:** None.

### `top_enterlimbo(inst, owner)`
* **Description:** Hides ground FX if not equipped.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `top_exitlimbo(inst)`
* **Returns:** Shows ground FX if not equipped.

### `top_onsave(inst, data)`
* **Description:** Stores `"magician"` flag if hat is magician version.
* **Parameters:** `inst`, `data` (save table).
* **Returns:** None.

### `top_onload(inst, data)`
* **Description:** On load, converts to magician if saved flag present.
* **Parameters:** `inst`, `data`.
* **Returns:** None.

### `top_onprebuilt(inst, builder, materials, recipe)`
* **Description:** On build of `"tophat_magician"`, calls `ConvertToMagician`.
* **Parameters:** `inst`, `builder`, `materials`, `recipe`.
* **Returns:** None.

### `miner_turnon(inst)`
* **Description:** Turns on miner hat light and equip animation; starts fuel consumption.
* **Parameters:** `inst`.
* **Returns:** None.

### `miner_turnoff(inst)`
* **Description:** Turns off miner hat light and equip animation; stops fuel consumption.
* **Parameters:** `inst`.
* **Returns:** None.

### `miner_perish(inst)`
* **Description:** On fuel depletion: unequips, removes light, pushes `"torchranout"` if equipped.
* **Parameters:** `inst`.
* **Returns:** None.

### `miner_takefuel(inst)`
* **Description:** If equipped, calls `miner_turnon`.
* **Parameters:** `inst`.
* **Returns:** None.

### `miner_onremove(inst)`
* **Description:** Removes associated `_light` if valid.
* **Parameters:** `inst`.
* **Returns:** None.

### `mole_turnon(owner)`
* **Description:** Plays `"moggles_on"` sound on owner if SoundEmitter exists.
* **Parameters:** `owner`.
* **Returns:** None.

### `mole_turnoff(owner)`
* **Description:** Plays `"moggles_off"` sound on owner.
* **Parameters:** `owner`.
* **Returns:** None.

### `mole_perish(inst)`
* **Description:** On perish: turns off moggles sound if equipped, then removes hat.
* **Parameters:** `inst`.
* **Returns:** None.

### `mushroom_onequip(inst, owner)`
* **Description:** Equips: hides hair, adds `"spoiler"` tag, adds `"moon_spore_protection"` and `"attacked"` listener (moon variant), starts periodic spawner, modifies owner hunger burn rate.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `mushroom_onunequip(inst, owner)`
* **Description:** Unequips: reverses `mushroom_onequip` effects.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `mushroom_displaynamefn(inst)`
* **Description:** Returns `"STRING.NAMES[" .. UPPER(prefab) .. "]"`.
* **Parameters:** `inst`.
* **Returns:** `string`.

### `common_mushroom(spore_prefab)`
* **Description:** Shared constructor for mushroom hats: equippable, perishable, forcecompostable, periodicspawner, insulator, waterproofer.
* **Parameters:** `spore_prefab` (e.g., `"spore_medium"`).
* **Returns:** `inst`.

### `hive_onequip(inst, owner)`
* **Description:** Sets `owner.components.sanity.neg_aura_absorb = TUNING.ARMOR_HIVEHAT_SANITY_ABSORPTION`.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `hive_onunequip(inst, owner)`
* **Description:** Resets sanity aura absorption to 0.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `dragon_ondancing(inst)`
* **Description:** Updates `equippable.dapperness` based on dragon parts count.
* **Parameters:** `inst`.
* **Returns:** None.

### `dragon_startdancing(inst, doer, data)`
* **Description:** Starts dapperness and fuel consumption tasks if not riding; returns animation sequence dict.
* **Parameters:** `inst`, `doer`, `data`.
* **Returns:** `nil` or `{ anim, loop, fx, tags }`.

### `dragon_stopdancing(inst, doer)`
* **Description:** Cancels dapperness task, stops fuel, resets dapperness to 0.
* **Parameters:** `inst`, `doer`.
* **Returns:** None.

### `dragon_equip(inst, owner)`
* **Description:** Calls `_onequip`, then stops dancing.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `dragon_unequip(inst, owner)`
* **Description:** Calls `_onunequip`, stops dancing, forces owner out of `"dragondance"` state.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `antlion_onequip(inst, owner)`
* **Description:** Calls `fns.simple_onequip`, starts autoterraforming, opens container.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `antlion_onunequip(inst, owner)`
* **Description:** Calls `_onunequip`, stops autoterraforming, closes container.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `antlion_onfinishterraforming(inst, x, y, z)`
* **Description:** Spawns `"turf_smoke_fx"` at tile position.
* **Parameters:** `inst`, `x`, `y`, `z`.
* **Returns:** None.

### `antlion_onfinished(inst)`
* **Description:** Drops container contents and removes hat.
* **Parameters:** `inst`.
* **Returns:** None.

### `polly_rogers_equip(inst, owner)`
* **Description:** Spawns and attaches Polly (or Salty Dog), schedules follow, updates hat art.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `polly_rogers_unequip(inst, owner)`
* **Description:** Cancels task, sends flyaway/summon to Polly, clears `worn`.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `polly_rogers_onoccupied(inst, child)`
* **Description:** Clears `inst.polly`, stops follower behavior.
* **Parameters:** `inst`, `child`.
* **Returns:** None.

### `polly_rogers_onvacate(inst, child)`
* **Description:** Returns child home if not worn; else re-summons.
* **Parameters:** `inst`, `child`.
* **Returns:** None.

### `fns.mask_common(custom_init, noburn)`
* **Description:** Shared mask constructor: fueled, burnable, propagator (unless `noburn`).
* **Parameters:** `custom_init`, `noburn`.
* **Returns:** `inst`.

### `fns.mask_shadowthrall_onequip(inst, owner)`
* **Description:** Adds `"shadowthrall_parasite_mask"` then calls `simple_onequip`.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `fns.mask_shadowthrall_onunequip(inst, owner)`
* **Description:** Removes `"shadowthrall_parasite_mask"` then calls `simple_onunequip`.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `alterguardian_activate(inst, owner)`
* **Description:** Activates visual components (`_front`, `_back`, `_light`), sets `_is_active`, spawns `alterguardianhatlight`, calls `updatelight`.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `alterguardian_deactivate(inst, owner)`
* **Description:** Deactivates visuals, calls `lunarseedplanting_stop`, schedules `opentop_onequip`.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `alterguardian_onsanitydelta(inst, owner)`
* **Description:** Activates/deactivates based on sanity threshold.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `alterguardian_spawngestalt_fn(inst, owner, data)`
* **Description:** Spawns gestalt projectile on `"onattackother"` if melee weapon, uses `lunarseedplanarconversionmult` and `lunarseedbonusbasephysicaldamage`.
* **Parameters:** `inst`, `owner`, `data`.
* **Returns:** None.

### `alterguardianhat_lunarseedplanting_findmoonglass(inst, owner)`
* **Description:** Scans nearby `moonglass_charged` up to radius, calls `findmoonglass_fromshard` up to 10 tries.
* **Parameters:** `inst`, `owner`.
* **Returns:** `{moonglass_list, centerx, centerz}` or `nil`.

### `alterguardianhat_lunarseedplanting_tick(inst)`
* **Description:** Periodic task: reserves pet slot, spawns gestalt projectile with moonglass, sets listeners.
* **Parameters:** `inst`.
* **Returns:** None.

### `alterguardianhat_lunarseedplanting_start(inst)`
* **Description:** Starts `tick` task if not running and hat equipped.
* **Parameters:** `inst`.
* **Returns:** None.

### `alterguardianhat_lunarseedplanting_stop(inst, owner)`
* **Description:** Cancels task, marks gestalts failed, despawns guardians (if not snapshot session).
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `dreadstone_doregen(inst, owner)`
* **Description:** Periodically repairs armor using sanity-based rate and set bonus multiplier.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `dreadstone_calcdapperness(inst, owner)`
* **Description:** Returns dapperness penalty: `TUNING.CRAZINESS_MED` if regen running and sanity enabled, halved if full set equipped.
* **Parameters:** `inst`, `owner`.
* **Returns:** `float`.

### `lunarplant_onequip(inst, owner)`
* **Description:** Calls `fullhelm_onequip`, spawns `"lunarplanthat_fx"`, adds `"lunarplanthat"` tag for grue immunity.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `lunarplant_onunequip(inst, owner)`
* **Description:** Calls `fullhelm_onunequip`, removes fx and tag.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `voidcloth_setbuffowner(inst, owner)`
* **Description:** Changes owner listener set: adds `equip`, `unequip`, `attacked`, `onattackother`; initializes buff from equipped weapon if `shadow_item` + `planardamage`.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `voidcloth_applyitembuff(inst, item, stacks)`
* **Description:** Applies/removes planar damage bonus to `item` based on `stacks`.
* **Parameters:** `inst`, `item`, `stacks`.
* **Returns:** None.

### `wagpunk_setnewtarget(inst, target, owner)`
* **Description:** Validates target, updates `targettracker`, starts speech and ambient.
* **Parameters:** `inst`, `target`, `owner`.
* **Returns:** None.

### `wagpunk_playambient(owner, level)`
* **Description:** Starts/updates `"wagpunkambient_hat"` loop with param00.
* **Parameters:** `owner`, `level`.
* **Returns:** None.

### `wagpunk_OnAttack(owner, data)`
* **Description:** Handles `"onattackother"`: determines new target, schedules `SetNewTarget`, starts ambient/speech.
* **Parameters:** `owner`, `data`.
* **Returns:** None.

### `wagpunk_timecheck(inst, targettime, lasttime)`
* **Description:** Evaluates stage transitions (STAGE1-3) based on time thresholds, updates multiplier, ambient, speech.
* **Parameters:** `inst`, `targettime`, `lasttime`.
* **Returns:** None.

### `wagpunk_test(inst, target)`
* **Description:** Returns `dist <= TUNING.WAGPUNK_MAXRANGE`.
* **Parameters:** `inst`, `target`.
* **Returns:** `boolean`.

### `princess_TryToMakeKnightsHostile(hat)`
* **Description:** Detaches all `knight_yoth` pets, makes them persistent and hostile to owner, triggers cooldown.
* **Parameters:** `hat`.
* **Returns:** None.

### `princess_trytocooldown(hat)`
* **Description:** Applies `yoth_princesscooldown_buff` to owner or nearest uncooldowned player.
* **Parameters:** `hat`.
* **Returns:** `true` or `false`.

### `princess_trymakepethostiletoplayer(pet)`
* **Description:** Makes pet hostile and triggers cooldown for its leader.
* **Parameters:** `pet`.
* **Returns:** None.

### `princess_refreshtracking(inst, forgetthisknight)`
* **Description:** Updates pet tracking; removes `forgetthisknight` if provided.
* **Parameters:** `inst`, `forgetthisknight`.
* **Returns:** None.

### `princess_onpetspawn(inst, pet)`
* **Description:** Makes pet friendly, schedules hostilification, refreshes tracking.
* **Parameters:** `inst`, `pet`.
* **Returns:** None.

### `princess_onpetremoved(inst, pet)`
* **Description:** If no knights remain, triggers cooldown.
* **Parameters:** `inst`, `pet`.
* **Returns:** None.

### `princess_onhatremoved_petleash(petleash, ...)`
* **Description:** Override: makes knights hostile on unequip (unless snapshot session).
* **Parameters:** `petleash`, `...`.
* **Returns:** None.

### `princess_pushworldevent(inst, eventname)`
* **Description:** Pushes world event (`ms_register_yoth_princess` or `ms_unregister_yoth_princess`) with hat and owner data.
* **Parameters:** `inst`, `eventname`.
* **Returns:** None.

### `princess_onsetbonus_enabled(inst)`
* **Description:** Registers world event, starts periodic knight attraction task, adds `"unluckysource"`, sets luck source.
* **Parameters:** `inst`.
* **Returns:** None.

### `princess_onsetbonus_disabled(inst)`
* **Description:** Unregisters event, cancels task, makes knights hostile, removes `"unluckysource"`, removes luck source.
* **Parameters:** `inst`.
* **Returns:** None.

### `princess_migration(hat)`
* **Description:** Returns list of knight_yoth pets on hat (migration helper).
* **Parameters:** `hat`.
* **Returns:** `table` or `nil`.

### `princess_onplayerdespawn(hat)`
* **Description:** Makes knights invincible and pushes `"despawn"` if not dead.
* **Parameters:** `hat`.
* **Returns:** None.

### `yoth_knight_onsetbonus_enabled(inst)`
* **Description:** Adds `"luckysource"`, sets luck source, triggers `updateownerluck`.
* **Parameters:** `inst`.
* **Returns:** None.

### `yoth_knight_onsetbonus_disabled(inst)`
* **Description:** Removes `"luckysource"`, triggers `updateownerluck`.
* **Parameters:** `inst`.
* **Returns:** None.

### `yoth_knight_update_luck(item)`
* **Description:** Pushes `"updateownerluck"` if `luckuser` component exists.
* **Parameters:** `item`.
* **Returns:** None.

### `fns2.minerhatlightfn()`, `fns2.alterguardianhatlightfn()`, `fns2.wagpunkhat_CreateFxFollowFrame(i)`, `fns2.mask_halfwit_CreateFxFollowFrame(i)`, `fns2.shadowthrall_parasite_CreateFxFollowFrame(i)`, `fns2.lunarplanthat_CreateFxFollowFrame(i)`, `fns2.voidclothhat_CreateFxFollowFrame(i)`, `fns2.inspectacleshat_CreateFxFollowFrame(i)`, `fns2.rabbithat_CreateFxFollowFrame(i)`, `fns2.pumpkinhat_fx_*`, `fns2.tophatcontainerfn()`
* **Description:** FX factory functions for follow entities (light, eyes, armor overlay, LED, blink, build, face, etc.). Each returns non-persistent `inst` and registers callbacks (`onremove`, `animover`, network sync, update loop).
* **Parameters:** Varies per factory (e.g., `i` for frame index, `inst`, `owner`, `enable`, `instant`, `isday`).
* **Returns:** `inst`.

### `MakeFollowFx(name, data)`
* **Description:** Factory to create networked follow FX container with dynamic attach logic, callbacks, and syncing (`fns2.*_common_postinit`).
* **Parameters:** `name`, `data` (table: `createfn`, `framebegin`, `frameend`, `isfullhelm`, `assets`, `common_postinit`, `master_postinit`).
* **Returns:** `Prefab`.

### `SpawnFollowFxForOwner(inst, owner, createfn, framebegin, frameend, isfullhelm)`
* **Description:** Spawns follow FX entities, attaches to owner, registers callbacks.
* **Parameters:** `inst`, `owner`, `createfn`, `framebegin`, `frameend`, `isfullhelm`.
* **Returns:** None.

### `fns2.pumpkinhat_fx_common_postinit(inst)`
* **Description:** Hooks `face`, adds `updatelooper`, watches world day/night.
* **Parameters:** `inst`.
* **Returns:** None.

### `fns2.pumpkinhat_fx_enablelight(inst, enable, instant)`
* **Description:** Enables/disables face light with optional instant transition.
* **Parameters:** `inst`, `enable`, `instant`.
* **Returns:** None.

### `fns2.pumpkinhat_fx_onisday(inst, isday)`
* **Description:** Syncs light to world day (enabled only at night with face).
* **Parameters:** `inst`, `isday`.
* **Returns:** None.

### `fns2.pumpkinhat_fx_decodeface(face)`
* **Description:** Decodes face bitmask into `reye`, `leye`, `mouth`.
* **Parameters:** `face`.
* **Returns:** 3 integers.

### `fns2.pumpkinhat_fx_facedirty(inst)`
* **Description:** Updates face symbols, enables light if needed.
* **Parameters:** `inst`.
* **Returns:** None.

### `fns.princess()`, `fns.yoth_knight()`, `fns2.tophatcontainerfn()`, `MakeHat(name)`
* **Description:** Constructor for princess and knight hats: sets armor, waterproofer, leader, petleash, migrationpetowner, setbonus, handlers. `MakeHat` is an external wrapper to create and register hat prefabs.
* **Parameters:** `name` (for `MakeHat`).
* **Returns:** `inst` or `Prefab`.

## Events & listeners
**Listens to:**
- `"attacked"` — triggers `ruinshat_proc`, `balloon_onownerattackedfn`, `mushroom_onattacked_moonspore`, `wagpunk_OnAttack`.
- `"onremove"` — triggers `ruinshat_onremove`, `miner_onremove`, `tophat_onremove`, `alterguardianhat_onremove`, `pollyremoved`, `wagpunk_onremoveentity`, `alterguardianhat_lunarseedplanting_onremove`, `princess_onpetremoved`, `inst.TryToMakeKnightsHostile`.
- `"enterlimbo"` / `"exitlimbo"` — handles FX visibility for top hat.
- `"armordamaged"` — plays hit animation for ruins hat.
- `"newstate"` — stops using item on non-registry state (bush, plantregistry).
- `"onactivateskill_server"` / `"ondeactivateskill_server"` — triggers skill refresh (wathgrithr/walter, roseglasses).
- `"sanitydelta"` — triggers `alterguardian_onsanitydelta`.
- `"itemget"` / `"itemlose"` — triggers `alterguardianhat_updatelight`.
- `"onattackother"` — triggers `alterguardian_spawngestalt_fn`, `voidcloth_onattackother`, `wagpunk_OnAttack`.
- `"ontalk"` / `"donetalking"` — plays/ends talk sound (wagpunk, shadowthrall).
- `"wagpunk_leveldirty"` — syncs FX level (wagpunk).
- `"skinhashdirty"` — syncs follower skin (lunarplant, voidcloth).
- `"buffeddirty"` — animates buff state (voidcloth).
- `"ledstatedirty"` — handles LED blink/state (inspectacles).
- `"iswinterdirty"` — syncs build (rabbit).
- `"facedirty"` — updates face symbols (pumpkin).
- `"rechargechange"` — recharges `elixir_buff` (ghostflower).
- `"animqueueover"` — plays idle anims (rabbit).
- `"perished"` — handles loot and erosion (rabbit).
- `"death"` — records death, unequips head slot (shadowthrall_parasite).
- `"makeplayerghost"` — sets `noloot`, removes hat (shadowthrall_parasite).
- `"wagpunk_changelevel"` — pushed by owner (client-side).
- `"despawn"` — pushed on knight pets.
- `"updateownerluck"` — pushed on items.

**Pushes:**
- `"equipskinneditem"` / `"unequipskinneditem"` — with skin name.
- `"opencontainer"` / `"closecontainer"` — top hat.
- `"torchranout"` — when miner hat torch depletes.
- `"umbrellaranout"` — when eyebrella depletes.
- `"learncookbookstats"` — batnose usage.
- `"flyaway"` / `"desummon"` / `"summon"` — polly hats.
- `"spawned"` / `"death"` — gestalt projectile/guardians.
- `"wagpunkui_targetupdate"` / `"wagpunkui_worn"` / `"wagpunkui_removed"` / `"wagpunkui_synch"` — UI updates.
- `"inventoryitem_updatetooltip"` — inspectacles.
- `"imagechange"` — pumpkin hat.
- `"hide_spoilage"` — pumpkin hat when waxed.
- `"ms_register_yoth_princess"` / `"ms_unregister_yoth_princess"` — world event.
- `"makefriend"` — princess hat.
- `"despawn"` — princess/knight pets.