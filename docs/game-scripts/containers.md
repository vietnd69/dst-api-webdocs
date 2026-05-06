---
id: containers
title: Containers
description: Defines container widget configurations for various inventory containers including setup functions, item test functions, button actions, and validation functions for backpacks, chests, cookers, and specialty containers.
tags: [inventory, containers, ui, widgets, configuration]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: data_config
source_hash: 190f6538
system_scope: inventory
---

# Containers

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`containers.lua` is a data configuration file that defines widget configurations for all inventory container types in Don't Starve Together. It exports a `containers` table containing prefab-specific configuration entries, each with `itemtestfn` functions to validate item placement, widget button actions for container interactions, and validation functions to control UI element availability. This file is required by the `container` component and UI systems to determine what items can be placed in specific containers and what actions are available to players. Configuration entries cover standard containers (chests, backpacks), cooking stations (cookpot, portable spicer), specialty containers (icebox, saltbox), event-specific containers (YOTB sewing machine, Quagmire pots), and character-specific containers (WX-78 backup body, Wortox soul jar). The file returns the `containers` table which is accessed via `require("containers")` by the container component and UI systems.

**Prefab aliases and shared configurations:** Many prefabs share container configurations through direct assignment or `deepcopy`. Notable aliases include: `params.icepack = params.backpack`, `params.hutch = params.chester`, `params.wobybig = params.wobysmall`, `params.archive_cookpot = params.cookpot`, `params.portablecookpot = params.cookpot`, `params.shadow_container = deepcopy(params.shadowchester)`, `params.rabbitkinghorn_container = deepcopy(params.shadow_container)`, `params.merm_toolshed_upgraded = deepcopy(params.merm_toolshed)`, `params.merm_armory = deepcopy(params.merm_toolshed)`, `params.merm_armory_upgraded = deepcopy(params.merm_armory)`, `params.saltbox = deepcopy(params.icebox)`, `params.pandoraschest = params.treasurechest`, `params.chest_mimic = params.pandoraschest`, `params.skullchest = params.treasurechest`, `params.terrariumchest = params.treasurechest`, `params.minotaurchest = params.shadowchester`, `params.dragonflychest = deepcopy(params.shadowchester)`, `params.quagmire_casseroledish = params.quagmire_pot`, `params.quagmire_casseroledish_small = params.quagmire_pot_small`, `params.quagmire_grill = params.quagmire_pot`, `params.quagmire_grill_small = params.quagmire_pot_small`, `params.winter_twiggytree = params.winter_tree`, `params.winter_deciduoustree = params.winter_tree`, `params.winter_palmconetree = params.winter_tree`, `params.enable_lunar_rift_construction_container = params.enable_shadow_rift_construction_container`, `params.mushroom_light2 = deepcopy(params.mushroom_light)`, `params.hermitcrab_lightpost = deepcopy(params.yots_lantern_post)`, `params.houndstooth_blowpipe = deepcopy(params.slingshot)`, `params.slingshotex = deepcopy(params.slingshot)`, `params.slingshot999ex = deepcopy(params.slingshotex)`, `params.slingshot2ex = deepcopy(params.slingshot2)`, `params.supertacklecontainer.itemtestfn = params.tacklecontainer.itemtestfn`, `params.offering_pot_upgraded.itemtestfn = params.offering_pot.itemtestfn`, `params.construction_repair_container = deepcopy(params.construction_container)`, `params.construction_rebuild_container = deepcopy(params.construction_container)`, `params.construction_container_1x1 = deepcopy(params.construction_container)`, `params.meatrack_hermit.itemtestfn = params.meatrack.itemtestfn`, `params.meatrack_hermit_multi.itemtestfn = params.meatrack.itemtestfn`, `params.sunkenchest` (independent definition, 3x5 layout).

## Usage example
```lua
local containers = require "containers"

-- Access a specific container configuration by prefab name
local cookpot_config = containers.params.cookpot

-- Test if an item can be placed in the cookpot
local can_place = cookpot_config.itemtestfn(container_component, item_entity, slot_index)

-- Check if the cookpot action button should be enabled
local button_enabled = cookpot_config.widget.buttoninfo.validfn(container_inst)

-- Execute the cookpot button action
cookpot_config.widget.buttoninfo.fn(container_inst, player_doer)
```

## Dependencies & tags
**External dependencies:**
- `cooking` -- Required for IsCookingIngredient function to validate cooking ingredients
- `screens/redux/riftconfirmscreen` -- Required for RiftConfirmScreen dialog in shadow rift construction
- `TheWorld` -- Accessed for ismastersim check and entity parent retrieval
- `ThePlayer` -- Accessed for container ownership checks on client
- `TheFrontEnd` -- Accessed for PushScreen and PopScreen calls in rift confirmation
- `STRINGS` -- Accessed for action text strings (ACTIONS.YOTB_SEW, ACTIONS.COOK, etc.)
- `ACTIONS` -- Accessed for action codes passed to BufferedAction and SendRPCToServer
- `RPC` -- Accessed for DoWidgetButtonAction RPC to server
- `BufferedAction` -- Used to create and execute actions on master sim
- `SendRPCToServer` -- Used to send widget button actions from client to server
- `FOODTYPE` -- Iterated to check edible tags in icebox itemtestfn
- `FOODGROUP` -- Accessed for OMNI.types in beard_sack itemtestfn functions
- `Vector3` -- Used to create position vectors for slotpos arrays
- `deepcopy` -- Used to clone container configurations for variant prefabs

**Components used:**
- `container` -- Accessed via container parameter and inst.components.container for GetOpeners, IsBusy, IsFull, IsEmpty, IsReadOnlyContainer, Has methods
- `constructionbuilderuidata` -- Accessed via doer.components.constructionbuilderuidata:GetConstructionSite() and GetIngredientForSlot()
- `skilltreeupdater` -- Accessed via owner/components.skilltreeupdater:IsActivated() for skill checks
- `inventoryitem` -- Accessed via item.components.inventoryitem:IsHeld() and container.replica.inventoryitem:IsHeldBy()
- `replica.container` -- Accessed via inst.replica.container for client-side container state checks

**Tags:**
- `irreplaceable` -- check
- `dryable` -- check
- `yotb_pattern_fragment` -- check
- `preparedfood` -- check
- `spicedfood` -- check
- `spice` -- check
- `burnt` -- check
- `lightbattery` -- check
- `lightcontainer` -- check
- `spore` -- check
- `hermithouse_ornament` -- check
- `winter_ornament` -- check
- `halloween_ornament` -- check
- `icebox_valid` -- check
- `fresh` -- check
- `stale` -- check
- `spoiled` -- check
- `smallcreature` -- check
- `cookable` -- check
- `deployable` -- check
- `slingshotammo` -- check
- `slingshot_band` -- check
- `slingshot_frame` -- check
- `slingshot_handle` -- check
- `oceanfishing_bobber` -- check
- `oceanfishing_lure` -- check
- `treeseed` -- check
- `halloweencandy` -- check
- `groundtile` -- check
- `smalloceancreature` -- check
- `bookcabinet_item` -- check
- `beargerfur_sack_valid` -- check
- `blowpipeammo` -- check
- `battlesong` -- check
- `soul` -- check
- `nosouljar` -- check
- `ghostlyelixir` -- check
- `ghostflower` -- check
- `pocketwatchpart` -- check
- `oceanfish` -- check
- `quagmire_stewable` -- check
- `overcooked` -- check
- `quagmire_sap` -- check
- `takeonly` -- check
- `nonpotatable` -- check
- `saltbox_valid` -- check
- `lunarseed` -- check
- `_container` -- check
- `bundle` -- check
- `nobundling` -- check

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `containers` | table | --- | The returned table containing all container configurations, accessed via `require("containers")`. |
| `containers.params` | table | --- | Table mapping prefab names to container configuration entries. |
| `containers.MAXITEMSLOTS` | number | --- | Calculated maximum slot count across all container configurations. |
| `params.<prefab>.widget` | table | --- | Widget configuration including `slotpos`, `animbank`, `animbuild`, `pos`, `buttoninfo`, and other UI properties. |
| `params.<prefab>.type` | string | --- | Container type identifier (e.g., "chest", "pack", "cooker", "hand_inv", "inv", "backpack", "side_inv_behind", "chest_addon", "top_rack"). |
| `params.<prefab>.acceptsstacks` | boolean | --- | Whether the container accepts stacked items. |
| `params.<prefab>.itemtestfn` | function | --- | Function to test if an item can be placed in the container. |
| `params.<prefab>.priorityfn` | function reference | --- | References itemtestfn for container priority selection. Only defined for `seedpouch` and `candybag`. |
| `params.<prefab>.usespecificslotsforitems` | boolean | --- | Whether items must be placed in specific slots. |
| `params.<prefab>.openlimit` | number | --- | Maximum number of this container type that can be open simultaneously. |
| `params.<prefab>.excludefromcrafting` | boolean | --- | Whether the container is excluded from crafting recipes. |
| `params.<prefab>.issidewidget` | boolean | --- | Whether the container widget is displayed as a side widget. |
| `LIGHT_TAGS` | table | --- | File-scope constant: Tags used by yots_lantern_post.itemtestfn to validate light-related items (`"lightbattery"`, `"spore"`, `"lightcontainer"`). |
| `WX78_BACKUPBODY_POS` | Vector3 | --- | File-scope constant: Position vector for WX-78 backup body container widget. |
| `WX78_INVENTORY_CONTAINER_OFFSET` | Vector3 | --- | File-scope constant: Position offset for WX-78 inventory container widget. |
| `WX78_INVENTORY_CONTAINER_SLOTPOS` | table | --- | File-scope constant: Array of slot positions for WX-78 inventory container in backup body. |
| `AGHAT_SLOTSTART` | number | --- | File-scope constant: Starting Y position for alterguardianhat slot positions (72 * 5 - 22). |
| `AGHAT_SLOTDIFF` | number | --- | File-scope constant: Y position difference between alterguardianhat slots (72). |
| `SLOT_BG` | table | --- | File-scope constant: Slot background image config for alterguardianhat (`{ image = "spore_slot.tex", atlas = "images/hud2.xml" }`). |
| `ALTERGUARDIANHAT_ITEMS` | table | --- | File-scope constant: Tags used by alterguardianhat.itemtestfn (`"spore"`, `"lunarseed"`). |
| `hermithouse2_slotbg` | table | --- | File-scope constant: Slot background config for hermithouse2 container (`{ image = "inv_slot_hermithouse.tex", atlas = "images/hud2.xml" }`). |
| `battlesong_container_bg` | table | --- | File-scope constant: Slot background config for battlesong_container (`{ image = "battlesong_slot.tex", atlas = "images/hud2.xml" }`). |
| `dryer_slotbg` | table | --- | File-scope constant: Slot background config for meatrack_hermit_multi container (`{ image = "inv_slot_kelp.tex", atlas = "images/hud2.xml" }`). |
| `elixir_container_bg` | table | --- | File-scope constant: Slot background config for elixir_container (`{ image = "elixir_slot.tex", atlas = "images/hud2.xml" }`). |
| `slingshotammo_container_bg` | table | --- | File-scope constant: Slot background config for slingshotammo_container (`{ image = "slingshot_ammo_slot.tex" }`). |

## Main functions
### `containers.widgetsetup(container, prefab, data)`
* **Description:** Applies widget configuration from params table to a container, setting properties and calculating numslots from slotpos array length.
* **Parameters:**
  - `container` -- Container component instance to configure
  - `prefab` -- String prefab name or nil to use container.inst.prefab
  - `data` -- Optional data table override or nil to use params[prefab]
* **Returns:** None
* **Error states:** None

### `params.shadow_container.itemtestfn(container, item, slot)`
* **Description:** Tests if item can be placed in shadow container. Returns true if item does not have the irreplaceable tag.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested for placement
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.woby_rack_container.itemtestfn(container, item, slot)`
* **Description:** Tests if item can be placed in woby drying rack. Accepts dryable items or handles edge cases for items with zero time alive during woby transform.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.meatrack.itemtestfn(container, item, slot)`
* **Description:** Tests if item can be placed in meatrack. Accepts dryable items or handles edge cases for items failing to move.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.meatrack_hermit.itemtestfn(container, item, slot)`
* **Description:** Tests if item can be placed in hermit crab meatrack (1x1 variant). Uses same logic as params.meatrack.itemtestfn -- accepts dryable items or handles edge cases for items failing to move.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.meatrack_hermit_multi.itemtestfn(container, item, slot)`
* **Description:** Tests if item can be placed in hermit crab meatrack (3x3 variant). Uses same logic as params.meatrack.itemtestfn -- accepts dryable items or handles edge cases for items failing to move.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.yotb_sewingmachine.itemtestfn(container, item, slot)`
* **Description:** Tests if item can be placed in sewing machine. Only accepts items with yotb_pattern_fragment tag.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.yotb_sewingmachine.widget.buttoninfo.fn(inst, doer)`
* **Description:** Executes YOTB_SEW action via BufferedAction on master or SendRPCToServer on client.
* **Parameters:**
  - `inst` -- Container entity instance
  - `doer` -- Player entity performing the action
* **Returns:** None
* **Error states:** None

### `params.yotb_sewingmachine.widget.buttoninfo.validfn(inst)`
* **Description:** Validates if sewing machine button should be enabled. Returns true if replica container exists and is full.
* **Parameters:**
  - `inst` -- Container entity instance
* **Returns:** boolean
* **Error states:** None

### `params.cookpot.itemtestfn(container, item, slot)`
* **Description:** Tests if item is a valid cooking ingredient using cooking.IsCookingIngredient and container is not burnt.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.cookpot.widget.buttoninfo.fn(inst, doer)`
* **Description:** Executes COOK action via BufferedAction on master or SendRPCToServer on client.
* **Parameters:**
  - `inst` -- Container entity instance
  - `doer` -- Player entity performing the action
* **Returns:** None
* **Error states:** None

### `params.cookpot.widget.buttoninfo.validfn(inst)`
* **Description:** Validates if cookpot button should be enabled. Returns true if replica container exists and is full.
* **Parameters:**
  - `inst` -- Container entity instance
* **Returns:** boolean
* **Error states:** None

### `params.portablespicer.itemtestfn(container, item, slot)`
* **Description:** Tests if item can be placed in portable spicer. Slot 1 accepts prepared food without spicedfood tag, slot 2 accepts spice items.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index (1=food, 2=spice) or nil
* **Returns:** boolean
* **Error states:** None

### `params.portablespicer.widget.buttoninfo.fn(inst, doer)`
* **Description:** Executes COOK action via BufferedAction on master or SendRPCToServer on client.
* **Parameters:**
  - `inst` -- Container entity instance
  - `doer` -- Player entity performing the action
* **Returns:** None
* **Error states:** None

### `params.portablespicer.widget.buttoninfo.validfn(inst)`
* **Description:** Validates if portable spicer button should be enabled. Returns true if replica container exists and is full.
* **Parameters:**
  - `inst` -- Container entity instance
* **Returns:** boolean
* **Error states:** None

### `params.bundle_container.itemtestfn(container, item, slot)`
* **Description:** Tests if item can be bundled. Rejects items with irreplaceable, _container, bundle, or nobundling tags.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.bundle_container.widget.buttoninfo.fn(inst, doer)`
* **Description:** Executes WRAPBUNDLE action via BufferedAction on master or SendRPCToServer on client.
* **Parameters:**
  - `inst` -- Container entity instance
  - `doer` -- Player entity performing the action
* **Returns:** None
* **Error states:** None

### `params.bundle_container.widget.buttoninfo.validfn(inst)`
* **Description:** Validates if bundle button should be enabled. Returns true if replica container exists, is not empty, and is not read-only.
* **Parameters:**
  - `inst` -- Container entity instance
* **Returns:** boolean
* **Error states:** None

### `params.construction_container.itemtestfn(container, item, slot)`
* **Description:** Tests if item matches the required ingredient for construction slot using constructionbuilderuidata:GetIngredientForSlot.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index
* **Returns:** boolean
* **Error states:** None

### `params.construction_container.widget.buttoninfo.fn(inst, doer)`
* **Description:** Executes APPLYCONSTRUCTION action via BufferedAction on master or SendRPCToServer on client.
* **Parameters:**
  - `inst` -- Container entity instance
  - `doer` -- Player entity performing the action
* **Returns:** None
* **Error states:** None

### `params.construction_container.widget.buttoninfo.validfn(inst)`
* **Description:** Validates if construction button should be enabled. Returns true if replica container exists and is not empty.
* **Parameters:**
  - `inst` -- Container entity instance
* **Returns:** boolean
* **Error states:** None

### `params.construction_repair_container.widget.buttoninfo.fn(inst, doer)`
* **Description:** Executes APPLYCONSTRUCTION.REPAIR action via BufferedAction on master or SendRPCToServer on client. Inherited from params.construction_container via deepcopy; button text differs to indicate repair action.
* **Parameters:**
  - `inst` -- Container entity instance
  - `doer` -- Player entity performing the action
* **Returns:** None
* **Error states:** None

### `params.construction_rebuild_container.widget.buttoninfo.fn(inst, doer)`
* **Description:** Executes APPLYCONSTRUCTION.REBUILD action via BufferedAction on master or SendRPCToServer on client. Inherited from params.construction_container via deepcopy; button text differs to indicate rebuild action.
* **Parameters:**
  - `inst` -- Container entity instance
  - `doer` -- Player entity performing the action
* **Returns:** None
* **Error states:** None

### `IsConstructionSiteComplete(inst, doer)` (local)
* **Description:** Local function that checks if all construction site ingredients are present in the container with sufficient quantities.
* **Parameters:**
  - `inst` -- Container entity instance
  - `doer` -- Player entity
* **Returns:** boolean
* **Error states:** None

### `EnableRiftsPopUpGoBack()` (local)
* **Description:** Local function that pops the current screen from TheFrontEnd.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `EnableRiftsDoAct(inst, doer)` (local)
* **Description:** Local function that executes APPLYCONSTRUCTION action via BufferedAction or SendRPCToServer.
* **Parameters:**
  - `inst` -- Container entity instance
  - `doer` -- Player entity performing the action
* **Returns:** None
* **Error states:** None

### `params.enable_shadow_rift_construction_container.widget.buttoninfo.fn(inst, doer)`
* **Description:** Executes rift construction action, showing confirmation dialog if construction site is complete.
* **Parameters:**
  - `inst` -- Container entity instance
  - `doer` -- Player entity performing the action
* **Returns:** None
* **Error states:** None

### `params.enable_shadow_rift_construction_container.widget.overrideactionfn(inst, doer)`
* **Description:** Shows RiftConfirmScreen dialog if construction site is complete and doer has HUD. Returns true if dialog shown.
* **Parameters:**
  - `inst` -- Container entity instance
  - `doer` -- Player entity
* **Returns:** boolean
* **Error states:** None

### `params.mushroom_light.itemtestfn(container, item, slot)`
* **Description:** Tests if item has lightbattery or lightcontainer tag and container is not burnt.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.mushroom_light2.itemtestfn(container, item, slot)`
* **Description:** Tests if item has lightbattery, spore, or lightcontainer tag and container is not burnt.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.yots_lantern_post.itemtestfn(container, item, slot)`
* **Description:** Tests if item has any light-related tags (lightbattery, spore, lightcontainer) and container is not burnt.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.hermitcrab_lightpost.widget.bganim_visualfn(bganim, container, doer)`
* **Description:** Sets coral symbol color on background animation to match container's AnimState coral symbol color.
* **Parameters:**
  - `bganim` -- Background animation widget
  - `container` -- Container component instance
  - `doer` -- Player entity
* **Returns:** None
* **Error states:** None

### `params.hermithouse2.itemtestfn(container, item, slot)`
* **Description:** Tests if item has hermithouse_ornament tag.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.winter_tree.itemtestfn(container, item, slot)`
* **Description:** Tests if item has winter_ornament or hermithouse_ornament tag and container is not burnt.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.sisturn.itemtestfn(container, item, slot)`
* **Description:** Tests if item is valid for sisturn. Checks owner's skilltreeupdater for wendy_sisturn_3 skill to allow additional flower types.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.offering_pot.itemtestfn(container, item, slot)`
* **Description:** Tests if item is kelp and container is not burnt.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.merm_toolshed.itemtestfn(container, item, slot)`
* **Description:** Tests if item matches slot requirements: slot 1 accepts twigs, slot 2 accepts rocks.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index (1=twigs, 2=rocks) or nil
* **Returns:** boolean
* **Error states:** None

### `params.merm_armory.itemtestfn(container, item, slot)`
* **Description:** Tests if item matches slot requirements for merm armory: slot 1 accepts log, slot 2 accepts cutgrass. Also checks that container is not burnt.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index (1=log, 2=cutgrass) or nil
* **Returns:** boolean
* **Error states:** None

### `params.livingtree_halloween.itemtestfn(container, item, slot)`
* **Description:** Tests if item has halloween_ornament tag and container is not burnt.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.icebox.itemtestfn(container, item, slot)`
* **Description:** Tests if item is icebox_valid, or is perishable food with fresh/stale/spoiled tags and edible tag, excluding small creatures.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.saltbox.itemtestfn(container, item, slot)`
* **Description:** Tests if item is perishable cookable food without deployable/smallcreature tags and no health replica, or has saltbox_valid tag.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.teleportato_base.itemtestfn(container, item, slot)`
* **Description:** Tests if item does not have nonpotatable tag.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.teleportato_base.widget.buttoninfo.fn(inst, doer)`
* **Description:** Placeholder function for teleportato activation. Currently commented out as not supported in multiplayer.
* **Parameters:**
  - `inst` -- Container entity instance
  - `doer` -- Player entity performing the action
* **Returns:** None
* **Error states:** None

### `params.balatro_machine.itemtestfn(container, item, slot)`
* **Description:** Tests if container is not burnt. Item prefab check is commented out.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.balatro_machine.widget.buttoninfo.fn(inst, doer)`
* **Description:** Executes ACTIVATE_CONTAINER action via BufferedAction on master or SendRPCToServer on client.
* **Parameters:**
  - `inst` -- Container entity instance
  - `doer` -- Player entity performing the action
* **Returns:** None
* **Error states:** None

### `params.antlionhat.itemtestfn(container, item, slot)`
* **Description:** Tests if item has groundtile tag and has a tile property.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.fish_box.itemtestfn(container, item, slot)`
* **Description:** Tests if item has smalloceancreature tag.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.oceanfishingrod.itemtestfn(container, item, slot)`
* **Description:** Tests if item matches fishing rod slot requirements: slot 1 accepts bobbers, slot 2 accepts lures.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index (1=bobber, 2=lure) or nil
* **Returns:** boolean
* **Error states:** None

### `params.beard_sack_1.itemtestfn(container, item, slot)`
* **Description:** Tests if item has edible tag matching any FOODGROUP.OMNI.types.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.beard_sack_2.itemtestfn(container, item, slot)`
* **Description:** Tests if item has edible tag matching any FOODGROUP.OMNI.types.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.beard_sack_3.itemtestfn(container, item, slot)`
* **Description:** Tests if item has edible tag matching any FOODGROUP.OMNI.types.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.slingshot.itemtestfn(container, item, slot)`
* **Description:** Tests if item has slingshotammo tag. Also checks REQUIRED_SKILL against owner's skilltreeupdater if present.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.slingshotmodscontainer.itemtestfn(container, item, slot)`
* **Description:** Tests if item matches slingshot mod slot requirements and checks REQUIRED_SKILL against owner's skilltreeupdater.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index (1=band, 2=frame, 3=handle) or nil
* **Returns:** boolean
* **Error states:** None

### `params.tacklecontainer.itemtestfn(container, item, slot)`
* **Description:** Tests if item has oceanfishing_bobber or oceanfishing_lure tag.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.seedpouch.itemtestfn(container, item, slot)`
* **Description:** Tests if item prefab is seeds, matches _seeds pattern, or has treeseed tag.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None



### `params.candybag.itemtestfn(container, item, slot)`
* **Description:** Tests if item has halloweencandy, halloween_ornament tag, or prefab starts with trinket_.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None



### `params.alterguardianhatshard.itemtestfn(container, item, slot)`
* **Description:** Tests if item has spore tag.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.alterguardianhat.itemtestfn(container, item, slot)`
* **Description:** Tests if item has spore or lunarseed tag using HasAnyTag.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.pocketwatch.itemtestfn(container, item, slot)`
* **Description:** Tests if item has pocketwatchpart tag.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.ocean_trawler.itemtestfn(container, item, slot)`
* **Description:** Tests if item has cookable or oceanfish tag.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.bookstation.itemtestfn(container, item, slot)`
* **Description:** Tests if item has bookcabinet_item tag.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None



### `params.beargerfur_sack.itemtestfn(container, item, slot)`
* **Description:** Tests if item has beargerfur_sack_valid or preparedfood tag.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.houndstooth_blowpipe.itemtestfn(container, item, slot)`
* **Description:** Tests if item has blowpipeammo tag.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.battlesong_container.itemtestfn(container, item, slot)`
* **Description:** Tests if item has battlesong tag.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.wortox_souljar.itemtestfn(container, item, slot)`
* **Description:** Tests if item has soul tag but not nosouljar tag.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.elixir_container.itemtestfn(container, item, slot)`
* **Description:** Tests if item has ghostlyelixir or ghostflower tag.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.dragonflyfurnace.itemtestfn(container, item, slot)`
* **Description:** Tests if item does not have irreplaceable tag.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.dragonflyfurnace.widget.buttoninfo.fn(inst, doer)`
* **Description:** Executes INCINERATE action via BufferedAction on master or SendRPCToServer on client.
* **Parameters:**
  - `inst` -- Container entity instance
  - `doer` -- Player entity performing the action
* **Returns:** None
* **Error states:** None

### `params.dragonflyfurnace.widget.buttoninfo.validfn(inst)`
* **Description:** Validates if furnace button should be enabled. Returns true if replica container exists and is not empty.
* **Parameters:**
  - `inst` -- Container entity instance
* **Returns:** boolean
* **Error states:** None

### `params.slingshotammo_container.itemtestfn(container, item, slot)`
* **Description:** Tests if item has slingshotammo tag.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.wx78_backupbody.itemtestfn(container, item, slot)`
* **Description:** Tests if item does not have irreplaceable tag.
* **Parameters:**
  - `container` -- Container component instance
  - `item` -- Item entity being tested
  - `slot` -- Slot index or nil
* **Returns:** boolean
* **Error states:** None

### `params.cookpot`
* **Description:** Container configuration for cookpot (1x4 vertical layout, 4 slots). Cooker type with COOK button action. itemtestfn validates cooking ingredients via cooking.IsCookingIngredient and checks container is not burnt.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.portablespicer`
* **Description:** Container configuration for portable spicer (1x2 vertical layout, 2 slots). Cooker type with SPICE button action. usespecificslotsforitems=true; slot 1 accepts prepared food without spicedfood tag, slot 2 accepts spice items.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.bundle_container`
* **Description:** Container configuration for bundle container (2x2 layout, 4 slots). Cooker type with WRAPBUNDLE button action. itemtestfn rejects items with irreplaceable, _container, bundle, or nobundling tags.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.construction_container`
* **Description:** Container configuration for construction container (4x1 horizontal layout, 4 slots). Cooker type with APPLYCONSTRUCTION button action. usespecificslotsforitems=true; itemtestfn validates items match required ingredients via constructionbuilderuidata:GetIngredientForSlot.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.enable_shadow_rift_construction_container`
* **Description:** Container configuration for shadow rift construction (1 slot). Cooker type with APPLYCONSTRUCTION.OFFER button action. Shows RiftConfirmScreen dialog if construction site is complete.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.mushroom_light`
* **Description:** Container configuration for mushroom light (1x4 vertical layout, 4 slots). Cooker type. itemtestfn accepts items with lightbattery or lightcontainer tag, checks container is not burnt.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.mushroom_light2`
* **Description:** Container configuration for mushroom light variant (1x4 vertical layout, 4 slots). Cooker type. itemtestfn accepts items with lightbattery, spore, or lightcontainer tag, checks container is not burnt.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.yots_lantern_post`
* **Description:** Container configuration for YOTB lantern post (1x1 layout, 1 slot). Chest type. itemtestfn accepts items with lightbattery, spore, or lightcontainer tag, checks container is not burnt.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.hermithouse2`
* **Description:** Container configuration for hermit house 2 (2x2 layout, 4 slots). Cooker type. itemtestfn accepts items with hermithouse_ornament tag.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.winter_tree`
* **Description:** Container configuration for winter tree (2x4 layout, 8 slots). Cooker type. itemtestfn accepts items with winter_ornament or hermithouse_ornament tag, checks container is not burnt.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.sisturn`
* **Description:** Container configuration for sisturn (2x2 layout, 4 slots). Cooker type with openlimit of 1. itemtestfn checks owner's skilltreeupdater for wendy_sisturn_3 skill to allow additional flower types (petals, moon_tree_blossom, petals_evil).
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.offering_pot`
* **Description:** Container configuration for offering pot (2x2 layout, 4 slots). Cooker type. itemtestfn accepts kelp prefab, checks container is not burnt.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.offering_pot_upgraded`
* **Description:** Container configuration for upgraded offering pot (3x2 layout, 6 slots). Cooker type. Shares itemtestfn with params.offering_pot.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.merm_toolshed`
* **Description:** Container configuration for merm toolshed (1x2 vertical layout, 2 slots). Cooker type. usespecificslotsforitems=true; slot 1 accepts twigs, slot 2 accepts rocks. Checks container is not burnt.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.merm_toolshed_upgraded`
* **Description:** Container configuration for upgraded merm toolshed. Deepcopy of params.merm_toolshed.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.merm_armory`
* **Description:** Container configuration for merm armory (1x2 vertical layout, 2 slots). Cooker type. Deepcopy of params.merm_toolshed with different slotbg. usespecificslotsforitems=true; slot 1 accepts log, slot 2 accepts cutgrass. Checks container is not burnt.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.merm_armory_upgraded`
* **Description:** Container configuration for upgraded merm armory. Deepcopy of params.merm_armory.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.livingtree_halloween`
* **Description:** Container configuration for living tree halloween (3x1 horizontal layout, 3 slots). Cooker type. itemtestfn accepts items with halloween_ornament tag, checks container is not burnt.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.icebox`
* **Description:** Container configuration for icebox (3x3 layout, 9 slots). Chest type. itemtestfn accepts icebox_valid items or perishable food with fresh/stale/spoiled and edible tags, excluding small creatures.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.saltbox`
* **Description:** Container configuration for saltbox (3x3 layout, 9 slots). Chest type. Deepcopy of params.icebox. itemtestfn accepts perishable cookable food without deployable/smallcreature tags and no health replica, or saltbox_valid items.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.krampus_sack`
* **Description:** Container configuration for krampus sack (2x8 layout, 16 slots). Side widget pack with openlimit of 1.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.piggyback`
* **Description:** Container configuration for piggyback (2x6 layout, 12 slots). Side widget pack with openlimit of 1.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.teleportato_base`
* **Description:** Container configuration for teleportato base (1x4 vertical layout, 4 slots). Cooker type with ACTIVATE button (currently commented out, not supported in multiplayer). itemtestfn rejects items with nonpotatable tag.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.balatro_machine`
* **Description:** Container configuration for balatro machine (1x5 horizontal layout, 5 slots). Cooker type with openlimit of 1 and ACTIVATE button. itemtestfn checks container is not burnt.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.treasurechest`
* **Description:** Container configuration for treasure chest (3x3 layout, 9 slots). Chest type with upgraded anim variants.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.antlionhat`
* **Description:** Container configuration for antlion hat (1x1 layout, 1 slot). hand_inv type, excludefromcrafting=true. itemtestfn accepts items with groundtile tag and tile property.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.fish_box`
* **Description:** Container configuration for fish box (5x4 layout, 20 slots). Chest type. itemtestfn accepts items with smalloceancreature tag.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.oceanfishingrod`
* **Description:** Container configuration for ocean fishing rod (1x2 vertical layout, 2 slots). hand_inv type, excludefromcrafting=true, usespecificslotsforitems=true. Slot 1 accepts bobbers, slot 2 accepts lures.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.beard_sack_1`
* **Description:** Container configuration for beard sack tier 1 (1x1 layout, 1 slot). side_inv_behind type, acceptsstacks=true. itemtestfn accepts items with edible tags matching FOODGROUP.OMNI.types.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.beard_sack_2`
* **Description:** Container configuration for beard sack tier 2 (2x1 layout, 2 slots). side_inv_behind type, acceptsstacks=true. itemtestfn accepts items with edible tags matching FOODGROUP.OMNI.types.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.beard_sack_3`
* **Description:** Container configuration for beard sack tier 3 (3x1 layout, 3 slots). side_inv_behind type, acceptsstacks=true. itemtestfn accepts items with edible tags matching FOODGROUP.OMNI.types.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.slingshot`
* **Description:** Container configuration for slingshot (1 slot). hand_inv type, excludefromcrafting=true. itemtestfn accepts slingshotammo items and checks REQUIRED_SKILL against owner's skilltreeupdater if present.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.slingshotex`
* **Description:** Container configuration for slingshot extended variant. Deepcopy of params.slingshot with different animbank/animbuild.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.slingshot999ex`
* **Description:** Container configuration for slingshot 999 extended variant. Deepcopy of params.slingshotex with different animbank/animbuild.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.slingshot2`
* **Description:** Container configuration for slingshot 2 (2 slots vertical). hand_inv type, excludefromcrafting=true. Shares itemtestfn with params.slingshot.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.slingshot2ex`
* **Description:** Container configuration for slingshot 2 extended variant. Deepcopy of params.slingshot2 with different animbank/animbuild.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.slingshotmodscontainer`
* **Description:** Container configuration for slingshot mods container (3 slots). Cooker type with openlimit of 1, usespecificslotsforitems=true, acceptsstacks=false. Slot 1 accepts slingshot_band, slot 2 accepts slingshot_frame, slot 3 accepts slingshot_handle. Checks REQUIRED_SKILL against owner's skilltreeupdater.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.tacklecontainer`
* **Description:** Container configuration for tackle container (3x2 layout, 6 slots). Chest type. itemtestfn accepts items with oceanfishing_bobber or oceanfishing_lure tag.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.supertacklecontainer`
* **Description:** Container configuration for super tackle container (3x5 layout, 15 slots). Chest type. Shares itemtestfn with params.tacklecontainer.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.sunkenchest`
* **Description:** Container configuration for sunken chest (3x5 layout, 15 slots). Independent definition (not deepcopy) to ensure it is not potentially messed with; no custom itemtestfn.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.sacred_chest`
* **Description:** Container configuration for sacred chest (3x2 layout, 6 slots). Chest type. No custom itemtestfn; uses default container validation.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.seedpouch`
* **Description:** Container configuration for seed pouch (2x8 layout, 16 slots). Side widget pack with openlimit of 1. itemtestfn accepts seeds prefab, _seeds pattern match, or treeseed tag. priorityfn references itemtestfn.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.candybag`
* **Description:** Container configuration for candy bag (2x8 layout, 16 slots). Side widget pack with openlimit of 1. itemtestfn accepts halloweencandy, halloween_ornament tags, or prefab starting with trinket_. priorityfn references itemtestfn.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.alterguardianhatshard`
* **Description:** Container configuration for alter guardian hat shard (1x1 layout, 1 slot). Chest type, acceptsstacks=false. itemtestfn accepts items with spore tag.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.alterguardianhat`
* **Description:** Container configuration for alter guardian hat (1x6 vertical layout, 6 slots). hand_inv type, excludefromcrafting=true, acceptsstacks=false. itemtestfn accepts items with spore or lunarseed tag.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.pocketwatch`
* **Description:** Container configuration for pocketwatch (3x2 layout, 6 slots). hand_inv type, excludefromcrafting=true. itemtestfn accepts items with pocketwatchpart tag.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.ocean_trawler`
* **Description:** Container configuration for ocean trawler (1x4 vertical layout, 4 slots). Cooker type, acceptsstacks=false. itemtestfn accepts items with cookable or oceanfish tag.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.bookstation`
* **Description:** Container configuration for book station (4x5 layout, 20 slots). Chest type. itemtestfn accepts items with bookcabinet_item tag.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.beargerfur_sack`
* **Description:** Container configuration for bearger fur sack (2x3 layout, 6 slots). Chest type. itemtestfn accepts items with beargerfur_sack_valid or preparedfood tag.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.houndstooth_blowpipe`
* **Description:** Container configuration for houndstooth blowpipe. Deepcopy of params.slingshot with different slotbg. itemtestfn accepts items with blowpipeammo tag.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.battlesong_container`
* **Description:** Container configuration for battlesong container (2x4 layout, 8 slots). Chest type. itemtestfn accepts items with battlesong tag.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.wortox_souljar`
* **Description:** Container configuration for wortox soul jar (1x1 layout, 1 slot). Chest type. itemtestfn accepts items with soul tag but not nosouljar tag.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.elixir_container`
* **Description:** Container configuration for wendy elixir container (3x3 layout, 9 slots). Chest type. itemtestfn accepts items with ghostlyelixir or ghostflower tag.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.dragonflyfurnace`
* **Description:** Container configuration for dragonfly furnace (2x2 layout, 4 slots). Cooker type with INCINERATE button action. itemtestfn rejects items with irreplaceable tag.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.slingshotammo_container`
* **Description:** Container configuration for slingshot ammo container (3x2 layout, 6 slots). Chest type. itemtestfn accepts items with slingshotammo tag.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.wx78_backupbody`
* **Description:** Container configuration for WX-78 backup body (5x3 layout, 15 slots). Chest type. itemtestfn rejects items with irreplaceable tag.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.wx78_drone_delivery`
* **Description:** Container configuration for WX-78 delivery drone (3x2 layout). No custom itemtestfn defined; uses default container item validation.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.wx78_drone_delivery_small`
* **Description:** Container configuration for WX-78 small delivery drone (3x1 layout). No custom itemtestfn defined; uses default container item validation.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.wx78_inventorycontainer`
* **Description:** Container configuration for WX-78 inventory container (1 slot with dynamic positioning). inv type with dynamic typefn returning "chest_addon" when in backup body. Uses slotposfn, slotscalefn, slothighlightscalefn, animfn, posfn, bottom_align_tip_fn, top_align_tip_fn for dynamic widget behavior based on whether container is in backup body.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.quagmire_pot`
* **Description:** Container configuration for quagmire pot (1x4 vertical layout, 4 slots). Cooker type, acceptsstacks=false. itemtestfn accepts quagmire_stewable items that are not quagmire_sap and not held or prepared/overcooked food.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.quagmire_pot_small`
* **Description:** Container configuration for quagmire pot small (1x3 vertical layout, 3 slots). Cooker type, acceptsstacks=false. Shares itemtestfn with params.quagmire_pot.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.quagmire_casseroledish`
* **Description:** Container configuration alias; references params.quagmire_pot configuration.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.quagmire_casseroledish_small`
* **Description:** Container configuration alias; references params.quagmire_pot_small configuration.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.quagmire_grill`
* **Description:** Container configuration alias; references params.quagmire_pot configuration.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.quagmire_grill_small`
* **Description:** Container configuration alias; references params.quagmire_pot_small configuration.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.quagmire_pot_syrup`
* **Description:** Container configuration for quagmire pot syrup (1x3 vertical layout, 3 slots). Cooker type, acceptsstacks=false. itemtestfn accepts quagmire_stewable items that are either not held or are quagmire_sap without takeonly tag.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.quagmire_backpack_small`
* **Description:** Container configuration for Quagmire small backpack (4-slot horizontal layout). backpack type.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.quagmire_backpack`
* **Description:** Container configuration for Quagmire backpack (8-slot horizontal layout). backpack type.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.backpack`
* **Description:** Container configuration for backpack (2x4 layout, 8 slots). Side widget with openlimit of 1.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.spicepack`
* **Description:** Container configuration for spicepack (2x3 layout, 6 slots). Side widget with openlimit of 1.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.chester`
* **Description:** Container configuration for Chester (3x3 layout, 9 slots). Standard chest type.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.shadowchester`
* **Description:** Container configuration for Shadow Chester (3x4 layout, 12 slots). Deprecated but kept for dragonflychest, minotaurchest, mods, and legacy save data.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `params.wobysmall`
* **Description:** Container configuration for Woby small form (3x3 layout, 9 slots). Chest type with side_align_tip.
* **Parameters:** None (configuration entry)
* **Returns:** None
* **Error states:** None

### `wx78_inventorycontainer_isinbackupbody(container, doer)` (local)
* **Description:** Local function that checks if container inventoryitem is not held by doer.
* **Parameters:**
  - `container` -- Container component instance
  - `doer` -- Player entity
* **Returns:** boolean
* **Error states:** None

### `wx78_inventorycontainer_getcolumn(container)` (local)
* **Description:** Local function that returns column index (1-5) based on container slot position in parent container.
* **Parameters:**
  - `container` -- Container component instance
* **Returns:** number
* **Error states:** None

### `params.wx78_inventorycontainer.widget.slotposfn(container, doer)`
* **Description:** Returns slot position from WX78_INVENTORY_CONTAINER_SLOTPOS if in backup body, nil otherwise.
* **Parameters:**
  - `container` -- Container component instance
  - `doer` -- Player entity
* **Returns:** Vector3 or nil
* **Error states:** None

### `params.wx78_inventorycontainer.widget.slotscalefn(container, doer)`
* **Description:** Returns slot scale 0.85 if in backup body, nil otherwise.
* **Parameters:**
  - `container` -- Container component instance
  - `doer` -- Player entity
* **Returns:** number or nil
* **Error states:** None

### `params.wx78_inventorycontainer.widget.slothighlightscalefn(container, doer)`
* **Description:** Returns slot highlight scale 1.08 if in backup body, nil otherwise.
* **Parameters:**
  - `container` -- Container component instance
  - `doer` -- Player entity
* **Returns:** number or nil
* **Error states:** None

### `params.wx78_inventorycontainer.widget.animfn(container, doer, anim)`
* **Description:** Returns animation name with column suffix if in backup body, nil otherwise.
* **Parameters:**
  - `container` -- Container component instance
  - `doer` -- Player entity
  - `anim` -- Base animation name string
* **Returns:** string or nil
* **Error states:** None

### `params.wx78_inventorycontainer.widget.posfn(container, doer)`
* **Description:** Returns WX78_BACKUPBODY_POS if in backup body, or calculates position from HUD inv tile.
* **Parameters:**
  - `container` -- Container component instance
  - `doer` -- Player entity
* **Returns:** Vector3 or nil
* **Error states:** None

### `params.wx78_inventorycontainer.widget.bottom_align_tip_fn(container, doer)`
* **Description:** Returns -90 if in backup body, nil otherwise.
* **Parameters:**
  - `container` -- Container component instance
  - `doer` -- Player entity
* **Returns:** number or nil
* **Error states:** None

### `params.wx78_inventorycontainer.widget.top_align_tip_fn(container, doer)`
* **Description:** Returns 70 if not in backup body, nil otherwise.
* **Parameters:**
  - `container` -- Container component instance
  - `doer` -- Player entity
* **Returns:** number or nil
* **Error states:** None

### `params.wx78_inventorycontainer.typefn(container, doer)`
* **Description:** Returns container type identifier. Returns "chest_addon" if container is in backup body, nil otherwise.
* **Parameters:**
  - `container` -- Container component instance
  - `doer` -- Player entity
* **Returns:** string or nil
* **Error states:** None

## Events & listeners
None.