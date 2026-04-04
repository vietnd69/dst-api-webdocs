---
id: containers
title: Containers
description: This module defines widget configurations, validation logic, and item test functions for various inventory containers including backpacks, chests, cookers, and furnaces while handling construction site interactions and button action callbacks via UI callbacks.
tags: [inventory, ui, containers, validation, widgets]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: 9a3c93b6
system_scope: inventory
---

# Containers

> Based on game build **714014** | Last updated: 2026-03-21

## Overview

The `containers` module serves as a central configuration system for inventory container widgets throughout Don't Starve Together. It defines parameter tables that specify slot layouts, item validation functions (`itemtestfn`), and widget button behaviors for diverse container types ranging from standard storage (chests, backpacks) to specialized containers (cooking pots, sewing machines, construction sites, soul jars). Each container type registers its own validation logic through the `params` table, checking entity tags, component states, and skill tree requirements to determine item placement eligibility. The module also handles UI button callbacks that execute player actions via buffered actions or RPC calls depending on network state, enabling interactive container operations like cooking, bundling, construction completion, and incineration. Modders can extend this system by adding new prefab entries to the `params` table with custom `itemtestfn` validators and widget configurations.

## Usage example

```lua
-- Access container widget setup for a custom chest prefab
local container = inst.components.container
containers.widgetsetup(container, "my_custom_chest", {
    widget = "chest_ui",
    pos = Vector3(0, 0, 0),
    size = 9,
    type = "generic",
})

-- Add custom item validation for the container
params.my_custom_chest = {
    widget = "chest_ui",
    pos = Vector3(0, 0, 0),
    size = 9,
    type = "generic",
    itemtestfn = function(container, item, slot)
        return not item:HasTag("irreplaceable")
    end,
}

-- Check if construction site is complete
local is_complete = IsConstructionSiteComplete(inst, doer)
if is_complete then
    EnableRiftsDoAct(inst, doer)
end
```

## Dependencies & tags

**External dependencies:**
- `cooking` -- Required module used to check cooking ingredients
- `screens/redux/riftconfirmscreen` -- Required module used to display confirmation dialogs for rift construction
- `TheWorld` -- Global singleton used to check ismastersim for server-side logic
- `TheFrontEnd` -- Global singleton used to push and pop UI screens
- `STRINGS` -- Global table used to access action strings and popup text
- `ACTIONS` -- Global table used to access action definitions for buffered actions
- `BufferedAction` -- Global function used to queue player actions
- `RPC` -- Global table used to reference RPC functions for network calls
- `SendRPCToServer` -- Global function used to send RPC calls to the server
- `deepcopy` -- Global utility function used to duplicate parameter tables
- `Vector3` -- Global utility used to define spatial coordinates for widget slots
- `ThePlayer` -- Used to identify local player as container opener
- `FOODTYPE` -- Iterated to check edible tags
- `FOODGROUP` -- Accessed for OMNI types in beard sacks
- `containers` -- Referenced to update MAXITEMSLOTS and returned as module

**Components used:**
- `container` -- Accessed via inst.components.container and inst.replica.container for item management and state checks
- `constructionbuilderuidata` -- Accessed via doer.components.constructionbuilderuidata to validate construction ingredients
- `skilltreeupdater` -- Checked on owner entity to verify skill activation
- `health` -- Accessed via item.replica.health to check existence
- `inventoryitem` -- Checked via item.components.inventoryitem:IsHeld()

**Tags:**
- `irreplaceable` -- check
- `dryable` -- check
- `yotb_pattern_fragment` -- check
- `preparedfood` -- check
- `spicedfood` -- check
- `spice` -- check
- `_container` -- check
- `bundle` -- check
- `nobundling` -- check
- `burnt` -- check
- `lightbattery` -- check
- `lightcontainer` -- check
- `spore` -- check
- `winter_ornament` -- check
- `hermithouse_ornament` -- check
- `halloween_ornament` -- check
- `icebox_valid` -- check
- `fresh` -- check
- `stale` -- check
- `spoiled` -- check
- `smallcreature` -- check
- `edible_` -- check
- `cookable` -- check
- `deployable` -- check
- `saltbox_valid` -- check
- `nonpotatable` -- check
- `groundtile` -- check
- `smalloceancreature` -- check
- `oceanfishing_bobber` -- check
- `oceanfishing_lure` -- check
- `slingshotammo` -- check
- `slingshot_band` -- check
- `slingshot_frame` -- check
- `slingshot_handle` -- check
- `treeseed` -- check
- `halloweencandy` -- check
- `lunarseed` -- check
- `pocketwatchpart` -- check
- `oceanfish` -- check
- `bookcabinet_item` -- check
- `beargerfur_sack_valid` -- check
- `blowpipeammo` -- check
- `battlesong` -- check
- `soul` -- check
- `nosouljar` -- check
- `ghostlyelixir` -- check
- `ghostflower` -- check
- `quagmire_stewable` -- check
- `overcooked` -- check
- `takeonly` -- check

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|

## Main functions

### `containers.widgetsetup(container, prefab, data)`
* **Description:** Applies widget configuration parameters to a container instance, setting slots and properties based on prefab or provided data.
* **Parameters:**
  - `container` -- The container component instance to configure
  - `prefab` -- The prefab name string to lookup params, or nil
  - `data` -- Optional data table to override params, or nil
* **Returns:** nil

### `params.shadow_container.itemtestfn(container, item, slot)`
* **Description:** Validates if an item can be placed in the shadow container, rejecting irreplaceable items.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.woby_rack_container.itemtestfn(container, item, slot)`
* **Description:** Validates items for the woby rack, checking for dryable tag or server-side timing conditions.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.meatrack.itemtestfn(container, item, slot)`
* **Description:** Validates items for the meatrack, checking for dryable tag or server-side timing conditions.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.yotb_sewingmachine.itemtestfn(container, item, slot)`
* **Description:** Validates items for the sewing machine, requiring the yotb_pattern_fragment tag.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.yotb_sewingmachine.widget.buttoninfo.fn(inst, doer)`
* **Description:** Executes the YOTB_SEW action via buffered action or RPC.
* **Parameters:**
  - `inst` -- The entity instance owning the widget
  - `doer` -- The player entity performing the action
* **Returns:** nil

### `params.yotb_sewingmachine.widget.buttoninfo.validfn(inst)`
* **Description:** Checks if the container is full to enable the button.
* **Parameters:**
  - `inst` -- The entity instance owning the widget
* **Returns:** boolean

### `params.cookpot.itemtestfn(container, item, slot)`
* **Description:** Validates cooking ingredients and checks if the pot is not burnt.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.cookpot.widget.buttoninfo.fn(inst, doer)`
* **Description:** Executes the COOK action via buffered action or RPC.
* **Parameters:**
  - `inst` -- The entity instance owning the widget
  - `doer` -- The player entity performing the action
* **Returns:** nil

### `params.cookpot.widget.buttoninfo.validfn(inst)`
* **Description:** Checks if the container is full to enable the button.
* **Parameters:**
  - `inst` -- The entity instance owning the widget
* **Returns:** boolean

### `params.portablespicer.itemtestfn(container, item, slot)`
* **Description:** Validates spice and food items for specific slots, excluding wetgoop and burnt cookers.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.portablespicer.widget.buttoninfo.fn(inst, doer)`
* **Description:** Executes the COOK action via buffered action or RPC.
* **Parameters:**
  - `inst` -- The entity instance owning the widget
  - `doer` -- The player entity performing the action
* **Returns:** nil

### `params.portablespicer.widget.buttoninfo.validfn(inst)`
* **Description:** Checks if the container is full to enable the button.
* **Parameters:**
  - `inst` -- The entity instance owning the widget
* **Returns:** boolean

### `params.bundle_container.itemtestfn(container, item, slot)`
* **Description:** Validates items for bundling, excluding irreplaceable, container, bundle, or nobundling tags.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.bundle_container.widget.buttoninfo.fn(inst, doer)`
* **Description:** Executes the WRAPBUNDLE action via buffered action or RPC.
* **Parameters:**
  - `inst` -- The entity instance owning the widget
  - `doer` -- The player entity performing the action
* **Returns:** nil

### `params.bundle_container.widget.buttoninfo.validfn(inst)`
* **Description:** Checks if the container is not empty and not read-only to enable the button.
* **Parameters:**
  - `inst` -- The entity instance owning the widget
* **Returns:** boolean

### `params.construction_container.itemtestfn(container, item, slot)`
* **Description:** Validates construction ingredients against the doer's construction builder UI data.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.construction_container.widget.buttoninfo.fn(inst, doer)`
* **Description:** Executes the APPLYCONSTRUCTION action via buffered action or RPC.
* **Parameters:**
  - `inst` -- The entity instance owning the widget
  - `doer` -- The player entity performing the action
* **Returns:** nil

### `params.construction_container.widget.buttoninfo.validfn(inst)`
* **Description:** Checks if the container is not empty to enable the button.
* **Parameters:**
  - `inst` -- The entity instance owning the widget
* **Returns:** boolean

### `IsConstructionSiteComplete(inst, doer)`
* **Description:** Checks if the construction site has all required ingredients in the container.
* **Parameters:**
  - `inst` -- The construction container entity instance
  - `doer` -- The player entity attempting construction
* **Returns:** boolean

### `EnableRiftsPopUpGoBack()`
* **Description:** Closes the current front end screen.
* **Parameters:** None
* **Returns:** nil

### `EnableRiftsDoAct(inst, doer)`
* **Description:** Executes the APPLYCONSTRUCTION action via buffered action or RPC.
* **Parameters:**
  - `inst` -- The entity instance owning the widget
  - `doer` -- The player entity performing the action
* **Returns:** nil

### `params.enable_shadow_rift_construction_container.widget.buttoninfo.fn(inst, doer)`
* **Description:** Handles button action, optionally triggering override logic for rifts.
* **Parameters:**
  - `inst` -- The entity instance owning the widget
  - `doer` -- The player entity performing the action
* **Returns:** nil

### `params.enable_shadow_rift_construction_container.widget.overrideactionfn(inst, doer)`
* **Description:** Shows a confirmation dialog if the construction site is complete, otherwise returns false.
* **Parameters:**
  - `inst` -- The entity instance owning the widget
  - `doer` -- The player entity performing the action
* **Returns:** boolean

### `params.mushroom_light.itemtestfn(container, item, slot)`
* **Description:** Validates light battery or container items, excluding burnt lights.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.mushroom_light2.itemtestfn(container, item, slot)`
* **Description:** Validates light battery, spore, or container items, excluding burnt lights.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.yots_lantern_post.itemtestfn(container, item, slot)`
* **Description:** Validates light tags using helper table, excluding burnt lights.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.hermitcrab_lightpost.widget.bganim_visualfn(bganim, container, doer)`
* **Description:** Sets the symbol mult colour of the coral symbol based on container anim state.
* **Parameters:**
  - `bganim` -- The background animation widget
  - `container` -- The container component instance
  - `doer` -- The player entity
* **Returns:** nil

### `params.hermithouse2.itemtestfn(container, item, slot)`
* **Description:** Validates hermit house ornament items.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.winter_tree.itemtestfn(container, item, slot)`
* **Description:** Validates winter or hermit house ornament items, excluding burnt trees.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.sisturn.itemtestfn(container, item, slot)`
* **Description:** Determines if an item is valid for the sisturn container, checking owner skilltree activation.
* **Parameters:**
  - `container` -- The container component instance holding the items
  - `item` -- The item entity being tested for validity
  - `slot` -- The slot index in the container
* **Returns:** boolean indicating if the item is accepted

### `params.offering_pot.itemtestfn(container, item, slot)`
* **Description:** Checks if the container is not burnt and the item is kelp.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.merm_toolshed.itemtestfn(container, item, slot)`
* **Description:** Validates twigs or rocks for specific slots in the merm toolshed.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.merm_armory.itemtestfn(container, item, slot)`
* **Description:** Validates log or cutgrass for specific slots in the merm armory.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.livingtree_halloween.itemtestfn(container, item, slot)`
* **Description:** Checks if item has halloween_ornament tag and container is not burnt.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.icebox.itemtestfn(container, item, slot)`
* **Description:** Validates perishable or edible items for the icebox.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.saltbox.itemtestfn(container, item, slot)`
* **Description:** Validates cookable perishable items or saltbox_valid tagged items.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.teleportato_base.itemtestfn(container, item, slot)`
* **Description:** Checks if item does not have nonpotatable tag.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.teleportato_base.widget.buttoninfo.fn(inst, doer)`
* **Description:** Placeholder function for teleportato activation, currently unsupported.
* **Parameters:**
  - `inst` -- The entity instance owning the widget
  - `doer` -- The player entity activating the button
* **Returns:** nil

### `params.balatro_machine.itemtestfn(container, item, slot)`
* **Description:** Checks if container is not burnt.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.balatro_machine.widget.buttoninfo.fn(inst, doer)`
* **Description:** Activates the container via BufferedAction or RPC depending on network state.
* **Parameters:**
  - `inst` -- The entity instance owning the widget
  - `doer` -- The player entity activating the button
* **Returns:** nil

### `params.antlionhat.itemtestfn(container, item, slot)`
* **Description:** Checks if item has groundtile tag and tile property.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.fish_box.itemtestfn(container, item, slot)`
* **Description:** Checks if item has smalloceancreature tag.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.oceanfishingrod.itemtestfn(container, item, slot)`
* **Description:** Validates oceanfishing_bobber or oceanfishing_lure tags for specific slots.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.beard_sack_1.itemtestfn(container, item, slot)`
* **Description:** Checks if item is edible according to OMNI food group.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.beard_sack_2.itemtestfn(container, item, slot)`
* **Description:** Checks if item is edible according to OMNI food group.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.beard_sack_3.itemtestfn(container, item, slot)`
* **Description:** Checks if item is edible according to OMNI food group.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.slingshot.itemtestfn(container, item, slot)`
* **Description:** Validates slingshotammo tag and checks owner skilltree for required skill.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The item entity being tested
  - `slot` -- The slot index
* **Returns:** boolean

### `params.slingshotmodscontainer.itemtestfn(container, item, slot)`
* **Description:** Validates items for the slingshot mods container based on skill requirements and specific slingshot tags.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The inventory item entity
  - `slot` -- The slot index being checked
* **Returns:** boolean indicating if the item is valid for the slot
* **Error states:** Returns false if owner lacks required skill or item lacks correct tag

### `params.tacklecontainer.itemtestfn(container, item, slot)`
* **Description:** Validates items for the tackle container by checking for fishing bobber or lure tags.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The inventory item entity
  - `slot` -- The slot index being checked
* **Returns:** boolean indicating if the item is valid for the slot

### `params.seedpouch.itemtestfn(container, item, slot)`
* **Description:** Validates items for the seed pouch by checking prefab name or treeseed tag.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The inventory item entity
  - `slot` -- The slot index being checked
* **Returns:** boolean indicating if the item is valid for the slot

### `params.candybag.itemtestfn(container, item, slot)`
* **Description:** Validates items for the candy bag by checking halloween or trinket tags.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The inventory item entity
  - `slot` -- The slot index being checked
* **Returns:** boolean indicating if the item is valid for the slot

### `params.alterguardianhatshard.itemtestfn(container, item, slot)`
* **Description:** Validates items for the alter guardian hat shard container by checking spore tag.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The inventory item entity
  - `slot` -- The slot index being checked
* **Returns:** boolean indicating if the item is valid for the slot

### `params.alterguardianhat.itemtestfn(container, item, slot)`
* **Description:** Validates items for the alter guardian hat by checking spore or lunarseed tags.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The inventory item entity
  - `slot` -- The slot index being checked
* **Returns:** boolean indicating if the item is valid for the slot

### `params.pocketwatch.itemtestfn(container, item, slot)`
* **Description:** Validates items for the pocketwatch by checking pocketwatchpart tag.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The inventory item entity
  - `slot` -- The slot index being checked
* **Returns:** boolean indicating if the item is valid for the slot

### `params.ocean_trawler.itemtestfn(container, item, slot)`
* **Description:** Validates items for the ocean trawler by checking cookable or oceanfish tags.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The inventory item entity
  - `slot` -- The slot index being checked
* **Returns:** boolean indicating if the item is valid for the slot

### `params.bookstation.itemtestfn(container, item, slot)`
* **Description:** Validates items for the book station by checking bookcabinet_item tag.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The inventory item entity
  - `slot` -- The slot index being checked
* **Returns:** boolean indicating if the item is valid for the slot

### `params.beargerfur_sack.itemtestfn(container, item, slot)`
* **Description:** Validates items for the beargers fur sack by checking prepared food tags.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The inventory item entity
  - `slot` -- The slot index being checked
* **Returns:** boolean indicating if the item is valid for the slot

### `params.houndstooth_blowpipe.itemtestfn(container, item, slot)`
* **Description:** Validates items for the houndstooth blowpipe by checking blowpipeammo tag.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The inventory item entity
  - `slot` -- The slot index being checked
* **Returns:** boolean indicating if the item is valid for the slot

### `params.battlesong_container.itemtestfn(container, item, slot)`
* **Description:** Validates items for the battlesong container by checking battlesong tag.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The inventory item entity
  - `slot` -- The slot index being checked
* **Returns:** boolean indicating if the item is valid for the slot

### `params.wortox_souljar.itemtestfn(container, item, slot)`
* **Description:** Validates items for the wortox souljar by checking soul tag and excluding nosouljar.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The inventory item entity
  - `slot` -- The slot index being checked
* **Returns:** boolean indicating if the item is valid for the slot

### `params.elixir_container.itemtestfn(container, item, slot)`
* **Description:** Validates items for the elixir container by checking ghostly elixir or ghostflower tags.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The inventory item entity
  - `slot` -- The slot index being checked
* **Returns:** boolean indicating if the item is valid for the slot

### `params.dragonflyfurnace.itemtestfn(container, item, slot)`
* **Description:** Validates items for the dragonfly furnace by excluding irreplaceable items.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The inventory item entity
  - `slot` -- The slot index being checked
* **Returns:** boolean indicating if the item is valid for the slot

### `params.dragonflyfurnace.widget.buttoninfo.fn(inst, doer)`
* **Description:** Executes the incinerate action when the dragonfly furnace button is clicked.
* **Parameters:**
  - `inst` -- The entity instance owning the widget
  - `doer` -- The player entity performing the action
* **Returns:** nil
* **Error states:** Checks for container component or replica before sending RPC

### `params.dragonflyfurnace.widget.buttoninfo.validfn(inst)`
* **Description:** Checks if the dragonfly furnace container is valid for interaction.
* **Parameters:**
  - `inst` -- The entity instance owning the widget
* **Returns:** boolean indicating if the button is valid

### `params.slingshotammo_container.itemtestfn(container, item, slot)`
* **Description:** Validates items for the slingshot ammo container by checking slingshotammo tag.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The inventory item entity
  - `slot` -- The slot index being checked
* **Returns:** boolean indicating if the item is valid for the slot

### `params.quagmire_pot.itemtestfn(container, item, slot)`
* **Description:** Validates items for the quagmire pot by checking stewable tags and held status.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The inventory item entity
  - `slot` -- The slot index being checked
* **Returns:** boolean indicating if the item is valid for the slot
* **Error states:** Excludes spoiled food, prepared food, overcooked, or takeonly tags

### `params.quagmire_pot_syrup.itemtestfn(container, item, slot)`
* **Description:** Validates items for the quagmire pot syrup by checking stewable tags and sap logic.
* **Parameters:**
  - `container` -- The container component instance
  - `item` -- The inventory item entity
  - `slot` -- The slot index being checked
* **Returns:** boolean indicating if the item is valid for the slot

## Events & listeners

* **Listens to:** None
* **Pushes:** None