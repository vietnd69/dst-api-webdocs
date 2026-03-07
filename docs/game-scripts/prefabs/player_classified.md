---
id: player_classified
title: Player Classified
description: Manages classified player state, network synchronization, and client-server event coordination for player entity components.
tags: [network, player, synchronization, hud, camera]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 79efbdbc
system_scope: network
---

# Player Classified

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`player_classified` is a classified component that encapsulates comprehensive player state data and handles bidirectional communication between server and client. It serves as the central synchronization point for player attributes like health, hunger, sanity, temperature, camera settings, HUD visibility, crafting state, and more. It uses `net_*` variables for network replication and registers event listeners for both server and client to drive client-side effects and state updates (e.g., HUD rendering, sound playback, camera changes). The component is attached automatically to the player entity via `AttachClassified()` and is not typically added manually by mods.

## Usage example
This component is internal to the engine and not intended for direct modder usage. However, a modder may interact with it indirectly through high-level APIs (e.g., `inst.components.player_classified:SetGhostMode(true)` or `inst.components.player_classified:BufferBuild("campfire")`). Typically, you interact with components like `health`, `sanity`, `playercontroller`, or `playervision`, which coordinate changes via `player_classified`.

## Dependencies & tags
**Components used:** None directly accessed via `inst.components.X`. However, it integrates closely with:
- `health`, `hunger`, `sanity`, `wereness`, `locomotor`, `playercontroller`, `playervision`, `playerspeedmult`, `playervoter`, `boatcannonuser`, `focalpoint`
- Network layer via `net_*` types (`net_ushortint`, `net_bool`, `net_event`, etc.)
**Tags:** Adds `"CLASSIFIED"` tag to the entity instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `currenthealth` | `net_ushortint` | `100` | Current health value (0–65535 range). |
| `maxhealth` | `net_ushortint` | `100` | Maximum health value. |
| `currenthunger` | `net_ushortint` | `100` | Current hunger value. |
| `maxhunger` | `net_ushortint` | `100` | Maximum hunger value. |
| `currentsanity` | `net_ushortint` | `100` | Current sanity value. |
| `maxsanity` | `net_ushortint` | `100` | Maximum sanity value. |
| `currenttemperature` | number | `TUNING.STARTING_TEMP` | Current player temperature (client-side computed). |
| `currenttemperaturedata` | `net_byte` | `0` | Network-encoded temperature (used for replication). |
| `isghostmode` | `net_bool` | `false` | Whether player is in ghost mode. |
| `cameradistance` | `net_smallbyte` | `0` | Camera zoom distance offset. |
| `iscamerazoomed` | `net_bool` | `false` | Whether camera is currently zoomed. |
| `ishudvisible` | `net_bool` | `true` | Whether HUD is visible. |
| `isactionsvisible` | `net_bool` | `true` | Whether action ring is visible. |
| `iscraftingenabled` | `net_bool` | `true` | Whether crafting UI should be shown/enabled. |
| `inspirationdraining` | `net_bool` | `false` | Whether inspiration is currently draining. |
| `inspirationsongs` | array of `net_tinybyte` | 3 slots | Active inspiration battle songs (by net ID). |
| `inmightygym` | `net_tinybyte` | `0` | Weight class on mighty gym (0 = not on gym; 1–7 = weight level). |
| `upgrademodules` | array of `net_smallbyte` | 6 slots | Upgrade module IDs for WX78. |
| `freesoulhops` | `net_tinybyte` | `0` | Free soulhops count for Wortox. |
| `isattackedbydanger` | `net_bool` | `false` | Whether last attack came from a "danger" attacker. |
| `isattackredirected` | `net_bool` | `false` | Whether last attack was redirected. |
| `wormholetravelevent` | `net_tinybyte` | `0` | Stores wormhole travel type on client (WORM, TENTAPILLAR, etc.). |
| `hou ndwarningevent` | `net_smallbyte` | `0` | Stores hound/worm warning level/type. |
| `techtrees` | table | `TECH.NONE` | Local copy of unlocked tech levels (client/server). |
| `techtrees_no_temp` | table | `TECH.NONE` | Tech levels without temporary bonuses. |
| `player_classified._parent` | entity instance | `nil` | Reference to the owning player entity (set on replication). |

*Note: Most `net_*` variables are not directly accessed by modders; interactions happen through component APIs or public methods (see "Main functions").*

## Main functions
### `SetValue(name, value)`
* **Description:** Server-only helper that asserts and sets a `net_ushortint` variable with clamped, ceiling-normalized values.
* **Parameters:** 
  - `name` (string) — field name (e.g., `"health.currenthealth"`).
  - `value` (number) — integer value in range `[0, 65535]`.
* **Returns:** Nothing.
* **Error states:** Asserts if `value` is out of bounds.

### `SetOldagerRate(dps)`
* **Description:** Sets the oldager rate (damage per second) in the range `[-30, 30]`. Encodes signed DPS into an unsigned network variable.
* **Parameters:** `dps` (number) — rate of oldager damage/restore per second.
* **Returns:** Nothing.
* **Error states:** Asserts if `dps` is outside `[-30, 30]`.

### `GetOldagerRate()`
* **Description:** Retrieves the current oldager rate from the network-encoded value.
* **Parameters:** None.
* **Returns:** number — decoded DPS value.

### `SetTemperature(temperature)`
* **Description:** Server-only function to set the player’s current temperature and encode it into `currenttemperaturedata` for network sync.
* **Parameters:** `temperature` (number) — temperature in world units.
* **Returns:** Nothing.

### `PushPausePredictionFrames(frames)`
* **Description:** Forces a dirty update for `pausepredictionframes`, triggering a client `cancelmovementprediction` event.
* **Parameters:** `frames` (number) — number of frames to pause.
* **Returns:** Nothing.

### `SetGhostMode(isghostmode)`
* **Description:** Server-side setter that sets `isghostmode` and immediately invokes the dirty handler to update client vision and HUD state.
* **Parameters:** `isghostmode` (boolean) — ghost mode toggle.
* **Returns:** Nothing.

### `ShowHUD(show)`
* **Description:** Server-side helper to show/hide the HUD and trigger `playerhuddirty` event.
* **Parameters:** `show` (boolean).
* **Returns:** Nothing.

### `ShowCrafting(show)`
* **Description:** Server-side helper to enable/disable crafting UI and show/hide crafting controls.
* **Parameters:** `show` (boolean).
* **Returns:** Nothing.

### `EnableMapControls(enable)`
* **Description:** Server-side helper to toggle minimap button visibility and HUD controls state.
* **Parameters:** `enable` (boolean).
* **Returns:** Nothing.

### `BufferBuild(recipename)`
* **Description:** Client-side function to queue a build for preview and cost deduction (only if ingredients are available). Triggers a network RPC and `refreshcrafting` event.
* **Parameters:** `recipename` (string) — recipe name (must be valid and cost-deductible).
* **Returns:** Nothing.

### `OnEntityReplicated(inst)`
* **Description:** Client-side callback (not exported, but invoked automatically). Attaches this classified to the parent player and links replica components.
* **Parameters:** `inst` — the classified instance.
* **Returns:** Nothing.

### `BufferBuild(inst, recipename)`
* **Description:** Internal helper for `BufferBuild` — actually removes ingredients if valid and sends RPC to server.
* **Parameters:** 
  - `inst` — classified instance.
  - `recipename` (string).
* **Returns:** Nothing.

## Events & listeners
### Listens to (server-side, `RegisterNetListeners_mastersim`)
- `healthdelta`, `hungerdelta`, `sanitydelta`, `werenessdelta` — triggers pulse updates on dirty values.
- `attacked`, `builditem`, `buildstructure`, `consumehealthcost` — fires client pulse events.
- `learnrecipe`, `learnmap`, `repair`, `performaction`, `actionfailed` — triggers client sounds and events.
- `carefulwalking`, `wormholetravel`, `houndwarning`, `play_theme_music`, `craftedextraelixir` — state sync and sound triggers.
- `makefriend`, `feedincontainer`, `idplantseed` — event triggers.

### Listens to (client-side, `RegisterNetListeners_local`)
- Dirty events like `healthdirty`, `hungerdirty`, `sanitydirty`, `temperaturedirty`, `moisturedirty`, `techtreesdirty`, `recipesdirty`, `iscraftingenableddirty`, `bufferedbuildsdirty`, `isperformactionsuccessdirty`, `pausepredictionframesdirty`, `isstrafingdirty`, `iscarefulwalkingdirty`, `externalvelocityvectordirty`, `playerspeedmultdirty`, `isghostmodedirty`, `actionmeterdirty`, `playerhuddirty`, `playercamerashake`, `playerscreenflashdirty`, `attunedresurrectordirty`, `cannondirty`, `bathingpooldirty`, and many more — drives state updates, event pushing, and client-side effects (HUD, camera, sounds).

### Listens to (common, `RegisterNetListeners_common`)
- `gym_bell_start`, `playworkcritsound`, `inmightygymdirty`, `stormleveldirty`, `isinmiasmadirty`, `isacidsizzlingdirty`, `hasinspirationbuffdirty`, `builder.build`, `builder.damaged`, `builder.opencraftingmenu`, `builder.learnrecipe`, `inked`, `MapExplorer.learnmap`, `MapSpotRevealer.revealmapspot`, `repair.repair`, `giftsdirty`, `yotbskindirty`, `ismounthurtdirty`, `playercameradirty`, `playercameraextradistdirty`, `playercamerasnap`, `playerminimapcenter`, `playerminimapclose`, `playerfadedirty`, `wormholetraveldirty`, `leader.makefriend`, `eater.feedincontainer`, `morguedirty`, `houndwarningdirty`, `idplantseedevent`, `startfarmingmusicevent`, `ingredientmoddirty`, `inspectacles_gamedirty`, `roseglasses_cooldowndirty`, `wortoxpanflutebuffdirty`, `craftedextraelixirdirty`.

### Pushes
- `healthdelta`, `hungerdelta`, `sanitydelta`, `werenessdelta`, `inspirationdelta`, `mightinessdelta`, `energylevelupdate`, `upgrademodulesdirty`, `freesoulhopschanged`, `item_buff_changed`, `inspectaclesgamechanged`, `roseglassescooldownchanged`, `moisturedelta`, `temperaturedelta`, `techtreechange`, `refreshcrafting`, `unlockrecipe`, `performaction`, `startfiredamage`, `stopfiredamage`, `changefiredamage`, `startlunarburn`, `stoplunarburn`, `startstrafing`, `stopstrafing`, `carefulwalking`, `attacked`, `buildsuccess`, `damaged`, `inked`, `mounthurt`, `giftreceiverupdate`, `yotbskinupdate`, `aimingcannonchanged`, `cancelmovementprediction`, and many client-side UI/sound state events.

### Special Events
- `ghostvision` — pushed on `isghostmodedirty` change; toggles ghost vision mode.
- `startfreezing`, `stopfreezing`, `startoverheating`, `stopoverheating`, `startstarving`, `stopstarving` — state change events based on thresholds.