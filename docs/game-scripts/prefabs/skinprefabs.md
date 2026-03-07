---
id: skinprefabs
title: Skinprefabs
description: Registers reusable skin definitions for prefabs via CreatePrefabSkin, supporting character, item, and decor variants with static tags, rarity tiers, and per-skin initialization callbacks.
tags: [prefabs, skins, configuration, entity, network]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 387c3da4
system_scope: entity
---

# Skinprefabs

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`skinprefabs.lua` is a data-definitive file that defines reusable skin prefabs for DST entities (e.g., characters, items, decor, buildings) through `CreatePrefabSkin(...)`. Each skin includes metadata such as `base_prefab`, `skin_tags` (for categorization and filtering), `rarity` or `rarity_modifier` (e.g., `PROOFOFPURCHASE`, `EVENT`, `BASE`), and optional `init_fn` callbacks to customize appearance, behavior, or networking logic. The file does not define any runtime component logic — instead, it populates a `prefs` table with static configuration, which is later used by the skin system at runtime. Tags in `skin_tags` are purely descriptive or categorical (e.g., `WINTER`, `VICTORIAN`, `CRAFTABLE`) and do not trigger dynamic `AddTag`/`RemoveTag` behavior within this file. All events and logic are handled externally (e.g., in `backpack_labrat` or other components that respond to skin changes).

## Usage example
```lua
-- Register a new skin for a character prefab (example pattern)
table.insert(prefs, CreatePrefabSkin("wilson_viking", {
    base_prefab = "wilson",
    skin_tags = { "VARG", "PIRATE", "HALLOWED", "BASE", "WILSON" },
    rarity = "EVENT",
    init_fn = function(inst, skin_name)
        -- Custom initialization logic (defined elsewhere, e.g., in a skin-specific init file)
        viking_hat_init_fn(inst, skin_name)
    end,
}))

-- Use in skin browser or crafting UI via tag filtering
-- Example: filter all skins with skin_tags:includes("VICTORIAN")
```

## Dependencies & tags
**Components used:**
- `inventoryitem` — used in skin initialization functions (e.g., `inst.components.inventoryitem:ChangeImageName(...)`)
- `bloomer` — used in followfx skin updates (e.g., `fx.components.bloomer:PushBloom(...)`)
- `AnimState` — used for hue/saturation changes on followfx (e.g., `fx.AnimState:SetHue(...)`)

**Tags:**
`ANCIENT`, `ADVENTURE`, `ANNIVERSARY`, `ARTNOUVEAU`, `BASE`, `BAT`, `BARBER`, `BOY`, `BUILDERS`, `CAWNIVAL`, `CATCOONHAT`, `CHARACTER`, `CHARACTERMODIFIER`, `CHEF`, `CHEST`, `CLASSY`, `CLOTHE`, `COMPLIMENTARY`, `CRAFTABLE`, `CRATE`, `CRYSTAL`, `C_UPDATE`, `COSTUME`, `COTTAGE`, `DISTINGUISHED`, `DOCK_WOODPOSTS`, `DRAGONFLYCHEST`, `DRAGONFLY_FURNACE`, `ELEGANT`, `EYEBRELLAHAT`, `EYETURRET`, `FANTASY`, `FENCE`, `FENCE_GATE`, `FIREFLY`, `FIREPIT`, `FIRESTAFF`, `FIRESUPPRESSOR`, `FISHERMAN`, `FISH`, `FISHINGROD`, `FISHBOX`, `FOOLS`, `FOOTBALLHAT`, `FORMAL`, `FARM_HOE`, `FEATHERFAN`, `FEATHERHAT`, `GAMEOFTHRONES`, `GEMSOCKET`, `GHOST`, `GOLDENAXE`, `GOLDENFARMHOE`, `GOLDENPICKAXE`, `GOLDENPITCHFORK`, `GOLDENSHOVEL`, `GOTHIC`, `GRASS_UMBRELLA`, `HAMBAT`, `HAMMER`, `HANDMEDOWN`, `HAUNTEDDOLL`, `HEARTH`, `HEART`, `HEIRLOOMELEGANT`, `HEATROCK`, `HIVEHAT`, `HOCKEY`, `HALLOWED`, `INSECT`, `INVISIBLE`, `ICE`, `ICESTAFF`, `ICEPACK`, `LAVA`, `LUNAR`, `LUNAR_NY`, `LUNARPLANTHAT`, `LUREPLANT`, `MAST`, `MASTUPGRADE_LAMP`, `MASTUPGRADE_ROD`, `MARKETABLE`, `MASQUERADE`, `MEATRACK`, `MEATRACKMULTI`, `MERMHAT`, `MERMHOUSE_CRAFTED`, `MERMWATCHTOWER`, `MIGHTY`, `MIGHTY_GYM`, `MOLEHAT`, `MOONDIAL`, `MYSTICAL`, `MYTHICAL`, `NATURE`, `NAUTICAL`, `NEXTKIN`, `OARDRIFTWOOD`, `OAR`, `OCEAN_TRAWLER`, `OCEANFISHINGROD`, `ORNATE`, `PANFLUTE`, `PEARL`, `PET`, `PIRATE`, `PLANETS`, `POTTEDFERN`, `PORTABLEBLENDER`, `PORTABLECOOKPOT`, `PORTABLESPICER`, `PREMIUMWATERINGCAN`, `PROOFOFPURCHASE`, `PUNK`, `RAINCOAT`, `RAINOMETER`, `RAZOR`, `RED`, `RELIC`, `RESKIN`, `RETRO`, `ROSE`, `RUINS_BAT`, `RUINSRELIC_CHAIR`, `RUINSHAT`, `SANITYROCK`, `SADDLE_BASIC`, `SCEPTER`, `SCULPTINGTABLE`, `SCIENCEMACHINE`, `SEASIDE`, `SEAFARINGPROTO`, `SEEDPOUCH`, `SEWING_MANNEQUIN`, `SHOVEL`, `SHADOW`, `SIESTAHUT`, `SIESTAHUT_CRAFTED`, `SISTURN`, `SKELETONHAT`, `SPEAR`, `SPRING`, `SPIDERWITCH`, `SPOFFY`, `SQUID`, `SURVIVOR`, `TABLE`, `TENYEARS`, `TENT`, `T_UPDATE`, `TIMELESS`, `TOPHAT`, `TRAP`, `TRAP_TEETH`, `TOWNPORTAL`, `UMBRELLA`, `VALKYRIE`, `VARG`, `VICTORIAN`, `VINE`, `WALTER`, `WALTERHAT`, `WANDA`, `WARLY`, `WARDROBE`, `WASHINGSTON`, `WATHGRITHR`, `WATHGRITHRHAT`, `WAXWELL`, `WEAPON`, `WEBBER`, `WESTERN`, `WICKERBOTTOM`, `WIGWAM`, `WINTER`, `WINTERHAT`, `WINTEROMETER`, `WIZARD`, `WOODCARVEDHAT`, `WOOD_CHAIR`, `WOOD_TABLE_SQUARE`, `WOTC`, `WUMPET`, `WATERINGCAN`, `WATERMELONHAT`, `WAXWELL`, `WORMHOLE`, `WYRM`, `YOTB`, `YOTP`, `YOTC`, `YULE`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `base_prefab` | `string` | *required* | The base prefab name to apply the skin to (e.g., `"wilson"`, `"backpack_labrat"`, `"firepit"`). |
| `skin_tags` | `array of string` | `{}` | Static list of category and style tags (e.g., `["VICTORIAN", "HALLOWED", "CRAFTABLE"]`). Used for UI filtering, not runtime `AddTag`. |
| `rarity` | `string?` | `"BASE"` | Skin rarity tier (e.g., `"PROOFOFPURCHASE"`, `"EVENT"`, `"HEIRLOOMELEGANT"`, `"CHARACTER"`). Often duplicates values in `skin_tags`. |
| `rarity_modifier` | `string?` | *optional* | Modifies rarity logic (e.g., `"MARKETABLE"` sets `marketable = true` internally). |
| `init_fn` | `function(inst, skin_name, ...)?` | *optional* | Initialization callback for custom per-skin logic. Must be defined externally (not in `skinprefabs.lua`). |
| `has_alternate_for_body` | `boolean?` | *optional* | Indicates if alternate torso mesh should be used for character skins. |
| `torso_tuck_builds` | `array of string?` | *optional* | List of builds for which torso tuck is required. |
| `feet_cuff_size` | `number?` | *optional* | Controls feet tuck/cuff visual offset. |
| `granted_items` | `array of string?` | *optional* | Items granted to player when skin equipped (e.g., `"wx78_scanner"`). |
| `share_bigportrait_name` | `string?` | *optional* | If set, uses same big portrait as this name. |
| `marketable` | `boolean?` | *optional* | Internal flag for marketplace listing; not a tag. |

## Main functions
### `backpack_labrat_setfxcolour(inst, fx, colour)`
* **Description:** Configures the hue and saturation of a followfx entity (`fx`) based on `colour` (1 = yellow, 2 = blue, 3 = green), applied via `AnimState:SetHue()` and `AnimState:SetSaturation()`.  
* **Parameters:**  
  `inst` — the `backpack_labrat` instance owning the followfx.  
  `fx` — the followfx entity or component.  
  `colour` — integer (1, 2, or 3).  
* **Returns:** `nil`

### `backpack_labrat_setcolour(inst, colour)`
* **Description:** Updates the `inventoryitem` image for the `backpack_labrat` to reflect the `colour` variant (1 = yellow, 2 = blue, 3 = green), storing the value in `inst._backpack_labrat_colour`. Does not affect followfx visual.  
* **Parameters:**  
  `inst` — the `backpack_labrat` instance.  
  `colour` — integer (1, 2, or 3) or `nil` (for default).  
* **Returns:** `nil`

### `backpack_labrat_fns.attacked(inst, data)`
* **Description:** Event handler invoked on `"attacked"` events. If `data.stimuli == "electric"`, delegates to `playerlightningtargeted`.  
* **Parameters:**  
  `inst` — the `backpack_labrat` instance.  
  `data` — event payload (must include `stimuli`).  
* **Returns:** `nil`

### `backpack_labrat_fns.playerlightningtargeted(inst, data)`
* **Description:** Event handler for `"playerlightningtargeted"`. Sets colour to yellow (if insulated) or green (if not), via `backpack_labrat_setcolour`.  
* **Parameters:**  
  `inst` — the `backpack_labrat` instance.  
  `data` — event payload (must include `insulated` boolean).  
* **Returns:** `nil`

### `backpack_labrat_fns.freeze(inst, data)`
* **Description:** Event handler for `"freeze"`. Sets colour to blue (if not already green) or keeps green (indicating strong cold resistance). Uses `backpack_labrat_setcolour`.  
* **Parameters:**  
  `inst` — the `backpack_labrat` instance.  
  `data` — event payload (unused).  
* **Returns:** `nil`

### `backpack_labrat_fns.haunted(inst, data)`
* **Description:** Event handler for `"haunted"`. Resets the followfx symbol and colour to default, via `backpack_labrat_setfxcolour(..., nil)` and `backpack_labrat_setcolour(..., nil)`.  
* **Parameters:**  
  `inst` — the `backpack_labrat` instance.  
  `data` — event payload (unused).  
* **Returns:** `nil`

## Events & listeners
- **`haunted`**  
  *Handler:* `backpack_labrat_fns.haunted`  
  *Effect:* Resets followfx symbol and colour to default (nil).

- **`playerlightningtargeted`**  
  *Handler:* `backpack_labrat_fns.playerlightningtargeted`  
  *Effect:* Sets colour to yellow (insulated) or green (not insulated).

- **`attacked`**  
  *Handler:* `backpack_labrat_fns.attacked`  
  *Effect:* If `data.stimuli == "electric"`, calls `playerlightningtargeted`.

- **`freeze`**  
  *Handler:* `backpack_labrat_fns.freeze`  
  *Effect:* Sets colour to blue (normal) or green (strong cold resistance).