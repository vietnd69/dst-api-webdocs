---
id: forest
title: Forest
description: Configures the Forest world instance by registering prefabs, assets, and world-level components for spawning, environmental effects, and game systems.
tags: [world, spawner, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 17b65be2
system_scope: world
---

# Forest

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `forest` prefab defines the game world layout and systems for the Forest biome. It is responsible for registering all assets (textures, animations, sounds, models) used in the world, listing all prefabs to be preloaded, and attaching world-level components during initialization. It uses `MakeWorld` to register the world with custom tile physics and cross-barrier rules. This file does not define a component itself; rather, it acts as a world instantiation script that drives setup of the game environment.

## Usage example
This file is invoked internally by the game engine during world creation. Modders typically do not instantiate this directly. To reference or extend it, use:

```lua
-- Example: Accessing the forest world instance (only valid after world load)
if TheWorld and TheWorld.prefab == "forest" then
    -- Access world components
    TheWorld.components.wildfires:EnableWildfires(true)
end
```

## Dependencies & tags
**Components used:** No local component instantiation; this file *adds* components to the world entity (`inst`) via `inst:AddComponent("X")` in `common_postinit` and `master_postinit`. Components include: `ambientlighting`, `dynamicmusic`, `ambientsound`, `dsp`, `colourcube`, `hallucinations`, `wavemanager`, `moonstormlightningmanager`, `birdspawner`, `butterflyspawner`, `hounded`, `schoolspawner`, `squidspawner`, `piratespawner`, `worlddeciduoustreeupdater`, `kramped`, `frograin`, `penguinspawner`, `deerherdspawner`, `deerherding`, `klaussackspawner`, `deerclopsspawner`, `beargerspawner`, `moosespawner`, `hunter`, `lureplantspawner`, `shadowcreaturespawner`, `shadowhandspawner`, `brightmarespawner`, `wildfires`, `worldwind`, `forestresourcespawner`, `regrowthmanager`, `desolationspawner`, `forestpetrification`, `chessunlocks`, `retrofitforestmap_anr`, `specialeventsetup`, `townportalregistry`, `linkeditemmanager`, `sandstorms`, `worldmeteorshower`, `mermkingmanager`, `malbatrossspawner`, `crabkingspawner`, `rabbitkingmanager`, `flotsamgenerator`, `messagebottlemanager`, `gingerbreadhunter`, `wintersurprisespawner`, `snowballmanager`, `feasts`, `carnivalevent`, `yotd_raceprizemanager`, `yotc_raceprizemanager`, `yotb_stagemanager`, `yoth_knightmanager`, `yoth_hecklermanager`, `moonstormmanager`, `sharklistener`, `riftspawner`, `lunarthrall_plantspawner`, `oceanicemanager`, `sharkboimanager`, `lunarriftmutationsmanager`, `wagpunk_manager`, `hermitcrab_relocation_manager`, `wagpunk_arena_manager`, `forestdaywalkerspawner`, `worldoverseer`, `shadowthrall_mimics`, `decoratedgrave_ghostmanager`, `playingcardsmanager`, `lunaralterguardianspawner`, `wagboss_tracker`, `wanderingtraderspawner`, `migrationmanager`, `mutatedbuzzardmanager`.

**Tags:** Adds `forest` to the world via `MakeWorld(..., {"forest"})`.

## Properties
No public properties are defined. The `MakeWorld` call specifies optional overrides:
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `tile_physics_init` | function | `nil` | Custom tile physics initializer (see `tile_physics_init` below). |
| `cancrossbarriers_flying` | boolean | `false` | Whether flying entities can cross barriers; set to `true` here. |

## Main functions
No public functions are defined. The only procedural functions are internal initialization callbacks.

### `tile_physics_init(inst)`
*   **Description:** Configures tile collision sets for the world. Called once during world setup by the engine.
*   **Parameters:** `inst` (world entity) — the world instance.
*   **Returns:** Nothing.
*   **Error states:** None identified.

### `common_postinit(inst)`
*   **Description:** Attaches components shared by all world instances (client and server), such as `WaveComponent`, `ambientlighting`, and (non-dedicated only) audio/render components.
*   **Parameters:** `inst` (world entity) — the world instance.
*   **Returns:** Nothing.
*   **Error states:** None identified.

### `master_postinit(inst)`
*   **Description:** Attaches server-side (or master-mode) components responsible for gameplay systems like spawners, weather, events, and special features. Also adds components conditionally for seasonal or event-specific content.
*   **Parameters:** `inst` (world entity) — the world instance.
*   **Returns:** Nothing.
*   **Error states:** None identified.

## Events & listeners
None. This file does not register event listeners or push events; it only defines world setup callbacks.

## Assets
Includes:
- **Colours cubes:** 20 `.tex` files for day/night/seasonal lighting palettes.
- **Animations:** `snow.zip`, `acidglob.zip`, `lightning.zip`, `swimming_ripple.zip`.
- **Sounds:** `forest_stream.fsb`, `amb_stream.fsb`, `turnoftides_music.fsb`, `turnoftides_amb.fsb`, `rabbit.fsb`.
- **Textures:** `snow.tex`, `mud.tex`, `wave.tex`, `wave_shadow.tex`.
- **Model package:** `levels/models/waterfalls.bin`.
- **Lunacy corner texture/atlas pairs:** 40 texture and 40 atlas files.
- **Lunacy overlay texture/atlas pairs:** 44 texture and 44 atlas files.

## Prefabs registered
- **Core:** `cave`, `forest_network`, `adventure_portal`, `resurrectionstone`, `deer`, `deerspawningground`, `deerclops`, `gravestone`, `flower`, `animal_track`, `dirtpile`, `beefaloherd`, `beefalo`, `penguinherd`, `penguin_ice`, `penguin`, `mutated_penguin`, `koalefant_summer`, `koalefant_winter`, `beehive`, `wasphive`, `walrus_camp`, `pighead`, `mermhead`, `rabbithole`, `molehill`, `carrot_planted`, `tentacle`, `wormhole`, `cave_entrance`, `teleportato_base`, `teleportato_ring`, `teleportato_box`, `teleportato_crank`, `teleportato_potato`, `pond`, `pond_mos`, `marsh_tree`, `marsh_bush`, `burnt_marsh_bush`, `reeds`, `mist`, `snow`, `rain`, `lunarhail`, `pollen`, `marblepillar`, `marbletree`, `statueharp`, `statuemaxwell`, `beemine_maxwell`, `trap_teeth_maxwell`, `sculpture_knight`, `sculpture_bishop`, `sculpture_rook`, `statue_marble`, `lureplant`, `purpleamulet`, `monkey`, `livingtree`, `livingtree_halloween`, `livingtree_root`, `tumbleweed`, `rock_ice`, `catcoonden`, `shadowmeteor`, `meteorwarning`, `warg`, `warglet`, `claywarg`, `spat`, `multiplayer_portal`, `lavae`, `lava_pond`, `scorchedground`, `scorched_skeleton`, `lavae_egg`, `terrorbeak`, `crawlinghorror`, `creepyeyes`, `shadowskittish`, `shadowwatcher`, `shadowhand`, `stagehand`, `tumbleweedspawner`, `meteorspawner`, `dragonfly_spawner`, `moose`, `mossling`, `bearger`, `dragonfly`, `chester`, `grassgekko`, `petrify_announce`, `moonbase`, `moonrock_pieces`, `shadow_rook`, `shadow_knight`, `shadow_bishop`, `beequeenhive`, `klaus_sack`, `antlion_spawner`, `oasislake`, `succulent_plant`, `fish`.
- **Ocean:** 30+ ocean-related prefabs including `boat`, `bullkelp_plant`, `cookiecutter`, `gnarwail`, `malbatross`, `seastack`, `shark`, `oceanhorror`, etc.
- **Moon Island & Rifts:** Prefabs for `gestalt`, `moon_fissure`, `hotspring`, `moon_tree`, `lunarrift_portal`, `lunarthrall_plant`, `alterguardian_phase1`, `moonstorm_...`, `wagstaff_...`, `wagboss_...`, `wagpunk_...`, etc.
- **Events & Seasons:** `gingerbreadhouse`, `gingerbreadpig`, `gingerbreadwarg`, `snowball_item`, `giftsurprise`, `deck_of_cards`, `balatro_machine`, `yothknightwarningsound`, `charlie_stage_post`, `stageusher`, etc.
- **Dynamic prefabs added by looping over `FISH_DATA.fish` and monster warning prefabs** (e.g., `houndwarning_lvl1` through `houndwarning_lvl4`).

## World definition
```lua
MakeWorld("forest", prefabs, assets, common_postinit, master_postinit, {"forest"}, {
    tile_physics_init = tile_physics_init,
    cancrossbarriers_flying = true,
})
```
- **Name:** `"forest"`
- **Tags:** `{"forest"}`
- **Physics overrides:** flying entities may cross barriers.
- **Initialization hooks:** `common_postinit` and `master_postinit` for world setup.