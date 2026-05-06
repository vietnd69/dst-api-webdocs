---
id: spider
title: Spider
description: Defines multiple spider variant prefabs with shared constructor logic, variant-specific behaviors, combat systems, trading mechanics, and mutation support.
tags: [prefabs, creatures, combat, ai, monsters]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 714cf30b
system_scope: entity
---

# Spider

> Based on game build **722832** | Last updated: 2026-04-28

## Overview

This prefab file registers eight distinct spider variants: basic spider, warrior, hider, spitter, dropper, moon, healer, and water spider. All variants share a common constructor (`create_common`) that establishes base components including locomotor, health, combat, follower, sleeper, eater, inventory, trader, and sanityaura. Each variant overrides specific stats, behaviors, and abilities through dedicated creator functions. The file implements spider-specific mechanics such as trading with players, sleep/wake cycles tied to cave day, follower summoning when attacked, mutation via spidermutator food items, and Halloween moon transformation. Water spiders receive additional amphibiouscreature and timer components for land/water transitions.

## Usage example

```lua
-- Spawn a basic spider at player position
local spider = SpawnPrefab("spider")
spider.Transform:SetPosition(player.Transform:GetWorldPosition())

-- Spawn a warrior spider with custom health
local warrior = SpawnPrefab("spider_warrior")
warrior.components.health:SetMaxHealth(300)

-- Spawn a moon spider and trigger spike attack
local moon = SpawnPrefab("spider_moon")
moon:DoSpikeAttack(moon.Transform:GetWorldPosition())

-- Check if spider can be traded with
if spider.components.trader ~= nil then
    -- Trader uses test/abletoaccepttest functions set via SetAcceptTest/SetAbleToAcceptTest
    -- onaccept callback is triggered when trade succeeds
end
```

## Dependencies & tags

**External dependencies:**
- `brains/spiderbrain` -- Required for default spider AI behavior
- `brains/spider_waterbrain` -- Required for water spider AI behavior
- `TheSim` -- FindEntities for spider detection
- `TheWorld` -- Access state.iscaveday and Map methods
- `TUNING` -- Spider stats, distances, health, damage, speeds, mutation chances
- `GLOBAL` -- EQUIPSLOTS, FOODTYPE, TWOPI, FRAMES constants
- `SpawnPrefab` -- Spawn moonspider_spike and heal FX prefabs
- `CreateEntity` -- Create weapon entity for spitter
- `GetRandomWithVariance` -- Randomize spike attack positions
- `shuffleArray` -- Shuffle variations array for spike attack
- `SpringCombatMod` -- Modify combat radius based on season
- `FindEntity` -- Find combat targets
- `GetClosestInstWithTag` -- Find nearest spider den for summoning
- `MakeCharacterPhysics` -- Setup character physics body
- `MakeFeedableSmallLivestockPristine` -- Setup pristine state for livestock
- `MakeMediumBurnableCharacter` -- Setup burnable component for character
- `MakeMediumFreezableCharacter` -- Setup freezable component for character
- `MakeFeedableSmallLivestock` -- Setup livestock feeding behavior
- `MakeHauntablePanic` -- Setup ghost haunting behavior
- `MakeInventoryPhysics` -- Setup physics for spitter weapon

**Components used:**
- `spawnfader` -- Added in create_common for spawn fade effect
- `locomotor` -- Movement speeds, pathcaps, platform hopping
- `embarker` -- Boat embarkation with embark_speed
- `drownable` -- Water drowning behavior
- `lootdropper` -- Random loot drops (monstermeat, silk, spidergland)
- `burnable` -- Fire flammability via MakeMediumBurnableCharacter
- `freezable` -- Freezing behavior via MakeMediumFreezableCharacter
- `health` -- HP management and death handling
- `combat` -- Attack damage, target tracking, ShareTarget
- `follower` -- Leader following with OnChangedLeader callback
- `sleeper` -- Sleep/wake tests based on cave day and conditions
- `knownlocations` -- Store investigate location for retarget distance
- `eater` -- Diet setup, CanEat/Eat for food and mutation
- `inspectable` -- Allows player inspection
- `inventory` -- Item management, DropEverything, Equip, Unequip
- `trader` -- Item trading with AcceptTest and onaccept/onrefuse callbacks
- `inventoryitem` -- Pickup behavior, sinks, nobounce, canbepickedupalive
- `sanityaura` -- Sanity aura with CalcSanityAura function
- `acidinfusible` -- Acid infusion for spitter with infuse/uninfuse callbacks
- `halloweenmoonmutable` -- Halloween moon mutation to spider_moon prefab
- `amphibiouscreature` -- Water spider land/water transition (water variant only)
- `timer` -- Added for water spider (water variant only)
- `entitytracker` -- Used on corpse entity for tracking leader/home during respawn (not on spider itself)
- `homeseeker` -- Home den reference for return behavior

**Tags:**
- `cavedweller` -- add
- `monster` -- add
- `hostile` -- add
- `scarytoprey` -- add
- `canbetrapped` -- add
- `smallcreature` -- add
- `spider` -- add
- `drop_inventory_onpickup` -- add
- `drop_inventory_onmurder` -- add
- `trader` -- add
- `spider_warrior` -- add (warrior variant)
- `spider_hider` -- add (hider variant)
- `spider_spitter` -- add (spitter variant)
- `spider_moon` -- add (moon variant)
- `spider_healer` -- add (healer variant)
- `spider_water` -- add (water variant)
- `lunar_aligned` -- add (moon variant)
- `soulless` -- add (moon variant)
- `nosteal` -- add
- `spiderwhisperer` -- check (for ally detection)
- `companion` -- check (for ally detection)
- `playerghost` -- check (exclude from targeting)
- `FX` -- check
- `NOCLICK` -- check
- `DECOR` -- check
- `INLIMBO` -- check
- `creaturecorpse` -- check
- `shadowthrall_parasite_hosted` -- check (for target sharing)
- `spiderdisguise` -- check
- `_combat` -- check
- `character` -- check
- `spiderden` -- check (for summoning)
- `spidercocoon` -- check

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | - | Base spider animation and sound assets (ds_spider_basic.zip, spider_build.zip, ds_spider_boat_jump.zip, ds_spider_parasite_death.zip, spider.fsb) |
| `warrior_assets` | table | - | Warrior spider variant assets (ds_spider_basic.zip, ds_spider_warrior.zip, spider_warrior_build.zip, ds_spider_parasite_death.zip, spider.fsb) |
| `hiderassets` | table | - | Hider spider variant assets (ds_spider_basic.zip, ds_spider_caves.zip, ds_spider_caves_boat_jump.zip, ds_spider_parasite_death.zip, spider.fsb) |
| `spitterassets` | table | - | Spitter spider variant assets (ds_spider_basic.zip, ds_spider2_caves.zip, ds_spider2_caves_boat_jump.zip, ds_spider_parasite_death.zip, spider.fsb) |
| `dropperassets` | table | - | Dropper spider variant assets (ds_spider_basic.zip, ds_spider_warrior.zip, spider_white.zip, ds_spider_parasite_death.zip, spider.fsb) |
| `moon_assets` | table | - | Moon spider variant assets (ds_spider_basic.zip, ds_spider_moon.zip, ds_spider_moon_boat_jump.zip, spider.fsb) |
| `healer_assets` | table | - | Healer spider variant assets (spider_cannon.zip, spider_wolf_build.zip, ds_spider_parasite_death.zip, spider.fsb) |
| `water_assets` | table | - | Water spider variant assets (spider_water.zip, spider_water_water.zip, spider.fsb) |
| `prefabs` | table | - | Array of 11 prefab dependencies: spidergland, monstermeat, silk, spider_web_spit, spider_web_spit_acidinfused, moonspider_spike, spider_mutate_fx, spider_heal_fx, spider_heal_target_fx, spider_heal_ground_fx, spidercorpse |
| `TUNING.SPIDER_HEALTH` | number | - | Basic spider max health |
| `TUNING.SPIDER_DAMAGE` | number | - | Basic spider combat damage |
| `TUNING.SPIDER_ATTACK_PERIOD` | number | - | Basic spider attack period |
| `TUNING.SPIDER_WALK_SPEED` | number | - | Basic spider walk speed |
| `TUNING.SPIDER_RUN_SPEED` | number | - | Basic spider run speed |
| `TUNING.SPIDER_WARRIOR_HEALTH` | number | - | Warrior spider max health |
| `TUNING.SPIDER_WARRIOR_DAMAGE` | number | - | Warrior spider combat damage |
| `TUNING.SPIDER_WARRIOR_ATTACK_PERIOD` | number | - | Warrior spider attack period |
| `TUNING.SPIDER_WARRIOR_ATTACK_RANGE` | number | - | Warrior spider attack range |
| `TUNING.SPIDER_WARRIOR_HIT_RANGE` | number | - | Warrior spider hit range |
| `TUNING.SPIDER_WARRIOR_WALK_SPEED` | number | - | Warrior spider walk speed |
| `TUNING.SPIDER_WARRIOR_RUN_SPEED` | number | - | Warrior spider run speed |
| `TUNING.SPIDER_WARRIOR_TARGET_DIST` | number | - | Warrior spider target distance |
| `TUNING.SPIDER_WARRIOR_WAKE_RADIUS` | number | - | Warrior spider wake radius |
| `TUNING.SPIDER_HIDER_HEALTH` | number | - | Hider spider max health |
| `TUNING.SPIDER_HIDER_DAMAGE` | number | - | Hider spider combat damage |
| `TUNING.SPIDER_HIDER_ATTACK_PERIOD` | number | - | Hider spider attack period |
| `TUNING.SPIDER_HIDER_WALK_SPEED` | number | - | Hider spider walk speed |
| `TUNING.SPIDER_HIDER_RUN_SPEED` | number | - | Hider spider run speed |
| `TUNING.SPIDER_SPITTER_HEALTH` | number | - | Spitter spider max health |
| `TUNING.SPIDER_SPITTER_DAMAGE_MELEE` | number | - | Spitter spider melee damage |
| `TUNING.SPIDER_SPITTER_DAMAGE_RANGED` | number | - | Spitter spider ranged weapon damage |
| `TUNING.SPIDER_SPITTER_ATTACK_PERIOD` | number | - | Spitter spider attack period |
| `TUNING.SPIDER_SPITTER_ATTACK_RANGE` | number | - | Spitter spider attack range |
| `TUNING.SPIDER_SPITTER_HIT_RANGE` | number | - | Spitter spider hit range |
| `TUNING.SPIDER_SPITTER_WALK_SPEED` | number | - | Spitter spider walk speed |
| `TUNING.SPIDER_SPITTER_RUN_SPEED` | number | - | Spitter spider run speed |
| `TUNING.SPIDER_MOON_HEALTH` | number | - | Moon spider max health |
| `TUNING.SPIDER_MOON_DAMAGE` | number | - | Moon spider combat damage |
| `TUNING.SPIDER_MOON_ATTACK_PERIOD` | number | - | Moon spider attack period |
| `TUNING.SPIDER_HEALER_HEALTH` | number | - | Healer spider max health |
| `TUNING.SPIDER_HEALER_DAMAGE` | number | - | Healer spider combat damage |
| `TUNING.SPIDER_WATER_HEALTH` | number | - | Water spider max health |
| `TUNING.SPIDER_WATER_DAMAGE` | number | - | Water spider combat damage |
| `TUNING.SPIDER_WATER_ATTACK_PERIOD` | number | - | Water spider attack period |
| `TUNING.SPIDER_WATER_HIT_RANGE` | number | - | Water spider hit range |
| `TUNING.SPIDER_WATER_WALKSPEED` | number | - | Water spider walk speed |
| `TUNING.SPIDER_WATER_RUNSPEED` | number | - | Water spider run speed |
| `TUNING.SPIDER_WATER_FISH_TARGET_DIST` | number | - | Water spider fish target distance |
| `TUNING.SPIDER_FLAMMABILITY` | number | - | Spider burnable flammability |
| `TUNING.SPIDER_PERISH_TIME` | number | - | Spider livestock perish time |
| `TUNING.SPIDER_FOLLOWER_COUNT` | number | - | Max spiders that can follow a player |
| `TUNING.SPIDER_SUMMON_WARRIORS_RADIUS` | number | - | Radius for summoning warriors when attacked |
| `TUNING.SPIDER_INVESTIGATETARGET_DIST` | number | - | Target distance when investigating |
| `TUNING.SPIDER_TARGET_DIST` | number | - | Default spider target distance |
| `TUNING.SPIDER_HEALING_RADIUS` | number | - | Radius for healer spider healing |
| `TUNING.SPIDER_HEALING_AMOUNT` | number | - | Amount healed by healer spider |
| `TUNING.HEALING_MEDSMALL` | number | - | Healing amount for spiderwhisperer |
| `TUNING.ACID_INFUSION_MULT` | table | - | Acid infusion multipliers (STRONGER) |
| `TUNING.SANITYAURA_SMALL` | number | - | Small sanity aura value |
| `TUNING.SANITYAURA_MED` | number | - | Medium sanity aura value |
| `TUNING.SPIDER_PRERIFT_MUTATION_SPAWN_CHANCE` | number | - | Lunar mutation chance for basic spider |
| `TUNING.SPIDER_WARRIOR_PRERIFT_MUTATION_SPAWN_CHANCE` | number | - | Lunar mutation chance for warrior/hider/spitter/dropper/healer/water variants |

## Main functions

### `ShouldAcceptItem(inst, item, giver)`
* **Description:** Tests whether the spider should accept a traded item. Returns false with reason string if dead or holding item that cannot be eaten. Returns true if giver has spiderwhisperer tag and item is edible, or if item is equippable to HEAD slot.
* **Parameters:**
  - `inst` -- Spider entity instance
  - `item` -- Item entity being offered
  - `giver` -- Player entity offering the item
* **Returns:** boolean or string (false with reason), or nil (true)
* **Error states:** Errors if inst has no health or inventoryitem component (no nil guards present)

### `GetOtherSpiders(inst, radius, tags)`
* **Description:** Finds all valid spiders within radius. Filters out dead spiders, player ghosts, and invalid entities. Returns array of valid spider entities including the calling instance.
* **Parameters:**
  - `inst` -- Spider entity instance
  - `radius` -- Search radius for finding spiders
  - `tags` -- Optional tags to filter by (defaults to SPIDER_TAGS)
* **Returns:** table of spider entities
* **Error states:** Errors if inst has no Transform component or health component (no nil guards present)

### `OnGetItemFromPlayer(inst, giver, item)`
* **Description:** Handles item receipt from player. If item is edible, spider eats it and may become follower. If giver is leader, nearby spiders may also become followers. If item is head equippable, spider equips it as hat.
* **Parameters:**
  - `inst` -- Spider entity instance
  - `giver` -- Player entity giving the item
  - `item` -- Item entity being given
* **Returns:** nil
* **Error states:** Errors if inst has no eater, inventoryitem, combat, follower, inventory, or AnimState component (no nil guards present)

### `OnRefuseItem(inst, item)`
* **Description:** Handles refused item trade. Plays taunt animation and wakes spider if asleep.
* **Parameters:**
  - `inst` -- Spider entity instance
  - `item` -- Item entity being refused
* **Returns:** nil
* **Error states:** Errors if inst has no sg or sleeper component (no nil guards present)

### `IsSpiderAlly(inst, target)`
* **Description:** Checks if target is allied with spider. Returns true if combat considers target ally, or if target is companion with spiderwhisperer leader.
* **Parameters:**
  - `inst` -- Spider entity instance
  - `target` -- Target entity to check alliance
* **Returns:** boolean
* **Error states:** Errors if inst has no combat component or target has no follower component

### `FindTarget(inst, radius)`
* **Description:** Finds valid combat target within radius. Excludes bedazzled spiders targeting players/monsters, spider allies, and entities with excluded tags.
* **Parameters:**
  - `inst` -- Spider entity instance
  - `radius` -- Search radius for targets
* **Returns:** entity or nil
* **Error states:** Errors if inst has no knownlocations or combat component (no nil guards present)

### `NormalRetarget(inst)`
* **Description:** Standard retarget function for basic spiders. Uses investigate location distance or default spider target distance from TUNING.
* **Parameters:**
  - `inst` -- Spider entity instance
* **Returns:** entity or nil
* **Error states:** None

### `WarriorRetarget(inst)`
* **Description:** Retarget function for warrior-type spiders. Uses warrior-specific target distance from TUNING.
* **Parameters:**
  - `inst` -- Spider entity instance
* **Returns:** entity or nil
* **Error states:** None

### `keeptargetfn(inst, target)`
* **Description:** Validates whether combat should keep current target. Returns false if target is dead, has no combat/health, or is the spider's leader/follower ally.
* **Parameters:**
  - `inst` -- Spider entity instance
  - `target` -- Target entity to validate
* **Returns:** boolean
* **Error states:** None

### `BasicWakeCheck(inst)`
* **Description:** Checks if spider should stay awake. Returns true if has combat target, has home, is burning, frozen, taking fire damage, has leader, or is summoned.
* **Parameters:**
  - `inst` -- Spider entity instance
* **Returns:** boolean
* **Error states:** Errors if inst has no combat, homeseeker, burnable, freezable, health, or follower component (no nil guards present)

### `ShouldSleep(inst)`
* **Description:** Determines if spider should sleep. Returns true during cave day if BasicWakeCheck fails.
* **Parameters:**
  - `inst` -- Spider entity instance
* **Returns:** boolean
* **Error states:** Errors if inst lacks combat, homeseeker, burnable, freezable, health, or follower component (via BasicWakeCheck call)

### `ShouldWake(inst)`
* **Description:** Determines if spider should wake. Returns true if not cave day, BasicWakeCheck passes, or warrior spider finds target in wake radius.
* **Parameters:**
  - `inst` -- Spider entity instance
* **Returns:** boolean
* **Error states:** Errors if inst lacks combat, homeseeker, burnable, freezable, health, or follower component (via BasicWakeCheck call)

### `DoReturn(inst)`
* **Description:** Returns spider to home den if not following a leader. Calls childspawner:GoHome on the home entity.
* **Parameters:**
  - `inst` -- Spider entity instance
* **Returns:** nil
* **Error states:** None

### `OnIsCaveDay(inst, iscaveday)`
* **Description:** World state watcher callback for iscaveday. Wakes spider when cave day ends. Calls DoReturn if spider is asleep during cave day.
* **Parameters:**
  - `inst` -- Spider entity instance
  - `iscaveday` -- boolean indicating if it is cave day
* **Returns:** nil
* **Error states:** Errors if inst has no sleeper component

### `OnEntitySleep(inst)`
* **Description:** Called when entity goes to sleep. Calls DoReturn if during cave day.
* **Parameters:**
  - `inst` -- Spider entity instance
* **Returns:** nil
* **Error states:** None

### `SummonFriends(inst, attacker)`
* **Description:** Called when spider is hit. Finds nearest spider den and triggers its onhitfn to summon warrior spiders.
* **Parameters:**
  - `inst` -- Spider entity instance
  - `attacker` -- Entity that attacked
* **Returns:** nil
* **Error states:** None

### `IsHost(dude)`
* **Description:** Checks if entity has shadowthrall_parasite_hosted tag for combat target sharing.
* **Parameters:**
  - `dude` -- Entity to check for host tag
* **Returns:** boolean
* **Error states:** None

### `OnAttacked(inst, data)`
* **Description:** Handles attacked event. Sets combat target to attacker. Shares target with nearby spiders if not parasite-hosted, or with host entities if parasite-hosted.
* **Parameters:**
  - `inst` -- Spider entity instance
  - `data` -- Event data with attacker info
* **Returns:** nil
* **Error states:** Errors if inst has no combat, health, or follower component

### `SetHappyFace(inst, is_happy)`
* **Description:** Overrides face symbol to show happy expression or clears override.
* **Parameters:**
  - `inst` -- Spider entity instance
  - `is_happy` -- boolean to show/hide happy face
* **Returns:** nil
* **Error states:** Errors if inst has no AnimState component

### `OnStartLeashing(inst, data)`
* **Description:** Called when spider starts leashing to player. Shows happy face, enables pickup, and unlocks recipe for leader if they can learn it.
* **Parameters:**
  - `inst` -- Spider entity instance
  - `data` -- Event data
* **Returns:** nil
* **Error states:** Errors if inst has no inventoryitem, follower, or recipe property

### `OnStopLeashing(inst, data)`
* **Description:** Called when spider stops leashing. Resets defensive and no_targeting flags, disables pickup, hides happy face if not bedazzled.
* **Parameters:**
  - `inst` -- Spider entity instance
  - `data` -- Event data
* **Returns:** nil
* **Error states:** Errors if inst has no inventoryitem component

### `OnTrapped(inst, data)`
* **Description:** Called when spider is trapped. Drops all inventory items.
* **Parameters:**
  - `inst` -- Spider entity instance
  - `data` -- Event data
* **Returns:** nil
* **Error states:** Errors if inst has no inventory component

### `OnEat(inst, data)`
* **Description:** Called when spider eats. Triggers mutation if food has spidermutator component and can mutate this spider.
* **Parameters:**
  - `inst` -- Spider entity instance
  - `data` -- Event data with food info
* **Returns:** nil
* **Error states:** None

### `OnDropped(inst, data)`
* **Description:** Called when spider is dropped. Transitions to idle or sleep state based on ShouldWake/ShouldSleep checks.
* **Parameters:**
  - `inst` -- Spider entity instance
  - `data` -- Event data
* **Returns:** nil
* **Error states:** Errors if inst has no sg component

### `OnGoToSleep(inst)`
* **Description:** Called when spider goes to sleep. Enables pickup while sleeping.
* **Parameters:**
  - `inst` -- Spider entity instance
* **Returns:** nil
* **Error states:** Errors if inst has no inventoryitem component

### `OnWakeUp(inst)`
* **Description:** Called when spider wakes up. Disables pickup if no leader.
* **Parameters:**
  - `inst` -- Spider entity instance
* **Returns:** nil
* **Error states:** Errors if inst has no inventoryitem or follower component

### `CalcSanityAura(inst, observer)`
* **Description:** Calculates sanity aura for observer. Returns 0 if observer is spiderwhisperer, spider is bedazzled, or leader is spiderwhisperer. Otherwise returns sanityaura component aura value.
* **Parameters:**
  - `inst` -- Spider entity instance
  - `observer` -- Entity observing the spider
* **Returns:** number
* **Error states:** Errors if inst has no sanityaura or follower component (no nil guards present)

### `HalloweenMoonMutate(inst, new_inst)`
* **Description:** Called during Halloween moon mutation. Transfers follower leader from original to mutated spider.
* **Parameters:**
  - `inst` -- Original spider entity
  - `new_inst` -- Mutated spider entity
* **Returns:** nil
* **Error states:** None

### `MakeWeapon(inst)`
* **Description:** Creates ranged weapon for spider spitter. Creates entity with weapon, inventoryitem, equippable components. Sets projectile to spider_web_spit. Equips then unequips to hands slot.
* **Parameters:**
  - `inst` -- Spider spitter entity instance
* **Returns:** nil
* **Error states:** Errors if inst has no inventory component

### `DoSpikeAttack(inst, pt)`
* **Description:** Moon spider spike attack. Spawns 2-4 moonspider_spike prefabs in random pattern around position. Randomizes spike animation symbols.
* **Parameters:**
  - `inst` -- Moon spider entity instance
  - `pt` -- Vector3 position for attack center
* **Returns:** nil
* **Error states:** Errors if TheWorld.Map is unavailable (no nil guard present)

### `SpawnHealFx(inst, fx_prefab, scale)`
* **Description:** Spawns healing effect prefab at spider position with specified scale.
* **Parameters:**
  - `inst` -- Healer spider entity instance
  - `fx_prefab` -- Prefab name for heal effect
  - `scale` -- Scale multiplier for effect (default 1)
* **Returns:** nil
* **Error states:** Errors if inst has no Transform component (no nil guard present)

### `DoHeal(inst)`
* **Description:** Healer spider healing ability. Plays sound and FX, finds nearby spiders, heals them if not targeting each other. Sets healtime timestamp.
* **Parameters:**
  - `inst` -- Healer spider entity instance
* **Returns:** nil
* **Error states:** Errors if inst has no SoundEmitter, combat, or follower component (no nil guards present)

### `OnPickup(inst)`
* **Description:** Called when spider is picked up. Pushes detachchild event, removes homeseeker component and home reference.
* **Parameters:**
  - `inst` -- Spider entity instance
* **Returns:** nil
* **Error states:** None

### `Spitter_OnAcidInfuse(inst)`
* **Description:** Called when spitter is acid-infused. Changes weapon projectile to acid-infused variant.
* **Parameters:**
  - `inst` -- Spider spitter entity instance
* **Returns:** nil
* **Error states:** None (returns early if no weapon)

### `Spitter_OnAcidUninfuse(inst)`
* **Description:** Called when spitter acid infusion ends. Changes weapon projectile back to normal variant.
* **Parameters:**
  - `inst` -- Spider spitter entity instance
* **Returns:** nil
* **Error states:** None (returns early if no weapon)

### `SoundPath(inst, event)`
* **Description:** Returns sound path based on spider variant tags. Different paths for healer, moon, warrior, hider/spitter, and basic spiders.
* **Parameters:**
  - `inst` -- Spider entity instance
  - `event` -- Sound event name
* **Returns:** string sound path
* **Error states:** None

### `OnChangedLeader(inst, new_leader, prev_leader)`
* **Description:** Follower component callback when leader changes. Saves previous leader to _last_leader for corpse data restoration.
* **Parameters:**
  - `inst` -- Spider entity instance
  - `new_leader` -- New leader entity
  - `prev_leader` -- Previous leader entity
* **Returns:** nil
* **Error states:** None

### `SaveCorpseData(inst, corpse)`
* **Description:** Saves spider leader and home to corpse entitytracker for restoration on respawn. Returns isemergencychild flag if applicable.
* **Parameters:**
  - `inst` -- Spider entity instance
  - `corpse` -- Corpse entity to save data to
* **Returns:** table or nil
* **Error states:** Errors if inst has no homeseeker or _last_leader, or corpse has no entitytracker component

### `create_common(bank, build, tag, common_init, extra_data)`
* **Description:** Common constructor for all spider variants. Creates entity with physics, anim, sound, shadow, network. Adds base tags and components (locomotor, health, combat, follower, sleeper, eater, inventory, trader, sanityaura, acidinfusible). Sets up event listeners and world state watchers. Returns early on client.
* **Parameters:**
  - `bank` -- Animation bank name
  - `build` -- Animation build name
  - `tag` -- Optional variant tag to add
  - `common_init` -- Optional common init function
  - `extra_data` -- Optional table with sg, brain, pathcaps, SetHappyFaceFn
* **Returns:** entity instance
* **Error states:** Errors if any component addition or method call fails

### `create_spider()`
* **Description:** Creates basic spider prefab. Calls create_common, sets health, combat damage/period, retarget function, locomotor speeds, sanity aura. Adds halloweenmoonmutable component.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** Errors if create_common fails or TUNING values missing

### `create_warrior()`
* **Description:** Creates spider warrior prefab. Calls create_common with warrior tag, sets warrior-specific health, combat, locomotor values. Sets recipe for mutation.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** Errors if create_common fails or TUNING values missing

### `create_hider()`
* **Description:** Creates spider hider prefab. Calls create_common with hider tag and assets, sets hider-specific health, combat, locomotor values. Sets recipe for mutation.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** Errors if create_common fails or TUNING values missing

### `create_spitter()`
* **Description:** Creates spider spitter prefab. Calls create_common with spitter tag, sets acidinfusible callbacks, creates weapon via MakeWeapon, sets spitter-specific combat and locomotor values.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** Errors if create_common or MakeWeapon fails

### `create_dropper()`
* **Description:** Creates spider dropper prefab. Calls create_common with warrior tag and white build, sets warrior-equivalent stats. Sets recipe for mutation.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** Errors if create_common fails or TUNING values missing

### `spider_moon_common_init(inst)`
* **Description:** Common init for moon spider. Overrides web symbol, sets scale to 1.25, adds lunar_aligned and soulless tags.
* **Parameters:**
  - `inst` -- Moon spider entity instance
* **Returns:** nil
* **Error states:** Errors if inst has no AnimState or Transform component

### `LoadCorpseData(inst, corpse)`
* **Description:** Restores spider leader and home from corpse entitytracker. Adds spider as follower to leader, registers with childspawner (emergency or normal).
* **Parameters:**
  - `inst` -- Respawned spider entity
  - `corpse` -- Corpse entity with saved data
* **Returns:** nil
* **Error states:** Errors if corpse has no entitytracker or corpsedata

### `create_moon()`
* **Description:** Creates moon spider prefab. Calls create_common with moon init, sets DoSpikeAttack and LoadCorpseData methods, sets moon-specific health, combat, locomotor values. Sets sg.mem flags for no corpse and no lunar mutate.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** Errors if create_common fails or TUNING values missing

### `create_healer()`
* **Description:** Creates spider healer prefab. Calls create_common with healer tag, sets healer-specific health, combat, locomotor values. Sets DoHeal method and recipe for mutation.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** Errors if create_common fails or TUNING values missing

### `WaterSpider_SetHappyFace(inst, is_happy)`
* **Description:** Water spider variant of SetHappyFace. Overrides waterforest_eyes and fangs symbols for happy expression.
* **Parameters:**
  - `inst` -- Water spider entity instance
  - `is_happy` -- boolean to show/hide happy face
* **Returns:** nil
* **Error states:** Errors if inst has no AnimState component

### `OnEnterWater(inst)`
* **Description:** Called when water spider enters water. Saves original hop_distance, sets to 4, changes anim build to water variant.
* **Parameters:**
  - `inst` -- Water spider entity instance
* **Returns:** nil
* **Error states:** Errors if inst has no locomotor or AnimState component

### `OnExitWater(inst)`
* **Description:** Called when water spider exits water. Restores original hop_distance, changes anim build back to land variant.
* **Parameters:**
  - `inst` -- Water spider entity instance
* **Returns:** nil
* **Error states:** Errors if inst has no locomotor or AnimState component

### `WaterRetarget(inst)`
* **Description:** Water spider retarget function. Uses lower target distance for fish targets, otherwise uses investigate or default spider distance.
* **Parameters:**
  - `inst` -- Water spider entity instance
* **Returns:** entity or nil
* **Error states:** Errors if inst has no knownlocations or combat component

### `create_water()`
* **Description:** Creates water spider (water strider) prefab. Calls create_common with water extradata (custom SG, brain, pathcaps). Adds amphibiouscreature and timer components. Sets water-specific combat, locomotor, embark_speed, health values. Disables sinking.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** Errors if create_common fails or TUNING values missing

## Events & listeners

**Listens to:**
- `attacked` -- Triggers OnAttacked to set combat target and share aggro with nearby spiders
- `startleashing` -- Triggers OnStartLeashing when spider starts following a player
- `stopleashing` -- Triggers OnStopLeashing when spider stops following a player
- `ontrapped` -- Triggers OnTrapped to drop inventory when trapped
- `oneat` -- Triggers OnEat to handle mutation from food
- `ondropped` -- Triggers OnDropped to transition to idle or sleep state
- `gotosleep` -- Triggers OnGoToSleep to enable pickup while sleeping
- `onwakeup` -- Triggers OnWakeUp to disable pickup if no leader
- `onpickup` -- Triggers OnPickup to remove homeseeker component

**Pushes:**
- `makefriend` -- Pushed to player when spider becomes follower
- `detachchild` -- Pushed when spider is picked up from den

**World state watchers:**
- `iscaveday` -- Triggers OnIsCaveDay; wakes spider when cave day ends, calls DoReturn if asleep during cave day