---
id: staff
title: Staff
description: Defines multiple magical staff prefabs with unique abilities including fire, ice, teleportation, deconstruction, and light creation.
tags: [prefab, weapon, magic, equipment]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 3b437c20
system_scope: entity
---

# Staff

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
The `staff.lua` prefab file defines nine magical staff variants, each with distinct combat or utility functions. This is a prefab definition file that returns an array of Prefab objects via factory functions (red, blue, purple, yellow, green, orange, opal, etc.). Each staff is an equippable weapon that consumes finite uses and provides special abilities when attacking or casting. Staff types interact with different entity components (burnable, freezable, inventory, etc.) and apply sanity costs to the caster. The file uses a shared `commonfn()` constructor for base setup, with color-specific functions adding unique components and behaviors.

## Usage example
```lua
-- Spawn a specific staff variant
local firestaff = SpawnPrefab("firestaff")
local icestaff = SpawnPrefab("icestaff")
local telestaff = SpawnPrefab("telestaff")

-- Access staff components after spawning
if firestaff.components.weapon then
    firestaff.components.weapon:SetDamage(0)
end

if firestaff.components.finiteuses then
    firestaff.components.finiteuses:SetMaxUses(TUNING.FIRESTAFF_USES)
end

-- Staffs are equippable inventory items
if firestaff.components.inventoryitem then
    firestaff.components.inventoryitem:SetOnPickupFn(...)
end
```

## Dependencies & tags
**External dependencies:**
- `prefabs/telebase` -- required for purple staff teleportation logic (FindNearestActiveTelebase)

**Components used:**
- `finiteuses` -- tracks staff durability, calls onfinished when depleted
- `inspectable` -- allows players to examine the staff
- `inventoryitem` -- enables pickup and inventory storage
- `tradable` -- allows trading between players
- `equippable` -- handles equip/unequip animations and callbacks
- `weapon` -- defines attack behavior for red, blue, orange staffs
- `spellcaster` -- defines casting behavior for purple, yellow, green, opal staffs
- `blinkstaff` -- teleportation mechanics for orange staff
- `reticule` -- targeting reticule for yellow, orange, opal staffs
- `shadowlevel` -- shadow creature aggression level (most staffs)
- `floater` -- water floating behavior and animation swaps
- `hauntable` -- ghost haunting reactions

**Tags:**
- `firestaff` -- red staff identifier
- `icestaff` -- blue staff identifier
- `weapon` -- combat-capable staffs (red, blue, orange)
- `rangedweapon` -- projectile-attacking staffs (red, blue)
- `rangedlighter` -- red staff can ignite targets
- `extinguisher` -- blue staff can extinguish fires
- `nopunch` -- prevents melee punching (purple, yellow, green, opal)
- `allow_action_on_impassable` -- allows targeting impassable locations (yellow, opal)
- `shadowlevel` -- affects shadow creature aggression (most staffs)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `projectiledelay` | number | `FRAMES` | Instance variable set during construction; delay between projectile launches (red, blue staffs) |
| `icestaff_coldness` | number | `1` | Instance variable set during construction; coldness value applied on ice staff hit (blue variants) |
| `scrapbook_specialinfo` | string | varies | Instance variable set during construction; scrapbook info identifier (REDSTAFF, BLUESTAFF, etc.) |
| `fxcolour` | table | varies | Instance variable set during construction; RGB color table for spell effects |
| `castsound` | string | varies | Instance variable set during construction; sound path for casting animation |
| `scrapbook_adddeps` | table | `nil` | Instance variable set during construction; additional scrapbook dependencies (opal: moonbase) |

> Note: These are instance variables set on individual entity instances during prefab construction, not class properties or data table fields.

## Main functions
### `commonfn(colour, suffix, tags, hasskin, hasshadowlevel)`
* **Description:** Base constructor function that creates the shared staff entity structure with common components (finiteuses, inventoryitem, equippable, etc.).
* **Parameters:**
  - `colour` -- string color name for animation (red, blue, purple, etc.)
  - `suffix` -- string suffix for animation name (used for ice staff variants)
  - `tags` -- table of tags to add to the entity
  - `hasskin` -- boolean indicating if skin support is enabled
  - `hasshadowlevel` -- boolean indicating if shadowlevel component should be added
* **Returns:** Entity instance (client-side returns early, server-side continues with component setup)
* **Error states:** Errors if `TheWorld` is nil when checking `ismastersim` — no nil guard present.

### `red()`
* **Description:** Creates the fire staff prefab with weapon component, fire projectile, and burn attack behavior.
* **Parameters:** None
* **Returns:** Fire staff entity instance
* **Error states:** None

### `blue_common(build, coldness)`
* **Description:** Shared constructor for ice staff variants with configurable coldness level.
* **Parameters:**
  - `build` -- string build name (blue)
  - `coldness` -- number coldness value to apply on hit (1, 2, or 3)
* **Returns:** Ice staff entity instance
* **Error states:** None

### `blue()`, `blue2()`, `blue3()`
* **Description:** Wrapper functions that call `blue_common()` with coldness values 1, 2, and 3 respectively.
* **Parameters:** None
* **Returns:** Ice staff entity instance with corresponding coldness level
* **Error states:** None

### `purple()`
* **Description:** Creates the teleport staff prefab with spellcaster component for entity teleportation.
* **Parameters:** None
* **Returns:** Teleport staff entity instance
* **Error states:** None

### `yellow()`
* **Description:** Creates the light staff prefab with spellcaster component for placing permanent lights.
* **Parameters:** None
* **Returns:** Yellow staff entity instance
* **Error states:** None

### `green()`
* **Description:** Creates the deconstruction staff prefab with spellcaster component for dismantling structures.
* **Parameters:** None
* **Returns:** Green staff entity instance
* **Error states:** None

### `orange()`
* **Description:** Creates the blink staff prefab with blinkstaff component for short-range teleportation.
* **Parameters:** None
* **Returns:** Orange staff entity instance
* **Error states:** None

### `opal()`
* **Description:** Creates the opal staff prefab with spellcaster component for placing cold lights (moonbase variant).
* **Parameters:** None
* **Returns:** Opal staff entity instance
* **Error states:** None

### `onattack_red(inst, attacker, target, skipsanity)`
* **Description:** Attack handler for fire staff that ignites targets, unfreezes frozen entities, and wakes sleeping targets.
* **Parameters:**
  - `inst` -- staff entity instance
  - `attacker` -- entity wielding the staff
  - `target` -- entity being attacked
  - `skipsanity` -- boolean to skip sanity cost
* **Returns:** None
* **Error states:** None

### `onattack_blue(inst, attacker, target, skipsanity)`
* **Description:** Attack handler for ice staff that extinguishes fires, smothers smoldering, and applies coldness to freeze targets.
* **Parameters:**
  - `inst` -- staff entity instance
  - `attacker` -- entity wielding the staff
  - `target` -- entity being attacked
  - `skipsanity` -- boolean to skip sanity cost
* **Returns:** None
* **Error states:** None

### `teleport_start(teleportee, staff, caster, loctarget, target_in_ocean, no_teleport)`
* **Description:** Initiates teleportation sequence with lightning strike effects and invincibility frames.
* **Parameters:**
  - `teleportee` -- entity being teleported
  - `staff` -- staff entity performing teleport
  - `caster` -- player/entity casting the spell
  - `loctarget` -- target location entity (telebase, hitched entity, etc.)
  - `target_in_ocean` -- boolean indicating if target is in ocean
  - `no_teleport` -- boolean to skip actual teleport (still consumes uses)
* **Returns:** None
* **Error states:** Errors if `staff` lacks `finiteuses` component (nil dereference on `staff.components.finiteuses:Use(1)` — no guard present in source).

### `teleport_continue(teleportee, locpos, loctarget, staff)`
* **Description:** Executes the actual position change and triggers end sequence after delay for players.
* **Parameters:**
  - `teleportee` -- entity being teleported
  - `locpos` -- destination position vector
  - `loctarget` -- target location entity
  - `staff` -- staff entity
* **Returns:** None
* **Error states:** None

### `teleport_end(teleportee, locpos, loctarget, staff)`
* **Description:** Finalizes teleportation by restoring visibility, removing invincibility, and triggering events.
* **Parameters:**
  - `teleportee` -- entity being teleported
  - `locpos` -- destination position vector
  - `loctarget` -- target location entity
  - `staff` -- staff entity
* **Returns:** None
* **Error states:** None

### `teleport_func(inst, target, pos, caster)`
* **Description:** Main spell function for purple staff that resolves teleport destination and initiates teleport sequence.
* **Parameters:**
  - `inst` -- staff entity instance
  - `target` -- target entity to teleport
  - `pos` -- target position (unused, target used instead)
  - `caster` -- entity casting the spell
* **Returns:** None
* **Error states:** Errors if both `target` and `caster` are nil (no nil guard before `target.Transform:GetWorldPosition()` access).

### `destroystructure(staff, target)`
* **Description:** Deconstructs buildable structures, returning ingredients based on durability percent and dropping container contents.
* **Parameters:**
  - `staff` -- green staff entity instance
  - `target` -- structure entity to deconstruct
* **Returns:** None
* **Error states:** Errors if `staff` lacks `inventoryitem` or `finiteuses` component (nil dereference on `staff.components.inventoryitem.owner` or `staff.components.finiteuses` — no guard present in source).

### `createlight(staff, target, pos)`
* **Description:** Spawns a permanent light entity at the specified position.
* **Parameters:**
  - `staff` -- staff entity instance (yellow or opal)
  - `target` -- unused parameter
  - `pos` -- position vector for light placement
* **Returns:** None
* **Error states:** Errors if `staff` lacks `finiteuses` or `inventoryitem` component (nil dereference on `staff.components.finiteuses` or `staff.components.inventoryitem.owner` — no guard present in source).

### `onblink(staff, pos, caster)`
* **Description:** Callback triggered when orange staff blink teleportation completes, applies sanity cost and consumes uses.
* **Parameters:**
  - `staff` -- orange staff entity instance
  - `pos` -- destination position
  - `caster` -- entity that blinked
* **Returns:** None
* **Error states:** None

### `onfinished(inst)`
* **Description:** Called when staff durability is depleted, plays shatter sound and removes the entity.
* **Parameters:** `inst` -- staff entity instance
* **Returns:** None
* **Error states:** None

### `onunequip(inst, owner)`
* **Description:** Hides carry animation and shows normal arm animation when staff is unequipped.
* **Parameters:**
  - `inst` -- staff entity instance
  - `owner` -- player/entity unequipping the staff
* **Returns:** None
* **Error states:** None

### `onunequip_skinned(inst, owner)`
* **Description:** Extended unequip handler for skinned staffs that pushes unequip event before calling base onunequip.
* **Parameters:**
  - `inst` -- staff entity instance
  - `owner` -- player/entity unequipping the staff
* **Returns:** None
* **Error states:** None

### `projectilelaunched_red(inst, attacker, target, proj)`
* **Description:** Called when red staff projectile is launched; adds controlled_burner tag if attacker has it.
* **Parameters:**
  - `inst` -- fire staff entity instance
  - `attacker` -- entity wielding the staff
  - `target` -- target entity
  - `proj` -- projectile entity instance
* **Returns:** None
* **Error states:** None

### `onlight(inst, target)`
* **Description:** Called when red staff successfully lights a target; consumes one use from finiteuses.
* **Parameters:**
  - `inst` -- fire staff entity instance
  - `target` -- entity that was lit
* **Returns:** None
* **Error states:** None

### `onhauntred(inst, haunter)`
* **Description:** Haunt reaction for red staff; finds nearby lightable entities within range and ignites them.
* **Parameters:**
  - `inst` -- fire staff entity instance
  - `haunter` -- ghost entity performing haunt
* **Returns:** boolean -- true if haunt succeeded, false otherwise
* **Error states:** None

### `onhauntblue(inst, haunter)`
* **Description:** Haunt reaction for blue staff; finds nearby freezable entities and applies coldness to freeze them.
* **Parameters:**
  - `inst` -- ice staff entity instance
  - `haunter` -- ghost entity performing haunt
* **Returns:** boolean -- true if haunt succeeded, false otherwise
* **Error states:** None

### `onhauntpurple(inst)`
* **Description:** Haunt reaction for purple staff; finds nearby entity with locomotor and teleports it.
* **Parameters:** `inst` -- teleport staff entity instance
* **Returns:** boolean -- true if haunt succeeded, false otherwise
* **Error states:** None

### `onhauntorange(inst)`
* **Description:** Haunt reaction for orange staff; finds nearby entity and blinks it to a random walkable offset position.
* **Parameters:** `inst` -- blink staff entity instance
* **Returns:** boolean -- true if haunt succeeded, false otherwise
* **Error states:** None

### `onhauntgreen(inst)`
* **Description:** Haunt reaction for green staff; finds nearby deconstructable structure and destroys it.
* **Parameters:** `inst` -- deconstruction staff entity instance
* **Returns:** boolean -- true if haunt succeeded, false otherwise
* **Error states:** None

### `onhauntlight(inst)`
* **Description:** Haunt reaction for yellow/opal staff; creates a permanent light at a random walkable offset position.
* **Parameters:** `inst` -- light staff entity instance (yellow or opal)
* **Returns:** boolean -- true if haunt succeeded, false otherwise
* **Error states:** None

### `getrandomposition(caster, teleportee, target_in_ocean)`
* **Description:** Generates a random valid teleport destination; searches ocean points if target is aquatic, otherwise searches passable land nodes.
* **Parameters:**
  - `caster` -- entity casting the teleport spell
  - `teleportee` -- entity being teleported
  - `target_in_ocean` -- boolean indicating if target is in ocean
* **Returns:** Position vector (Point or Vector3) for teleport destination
* **Error states:** None

### `teleport_targets_sort_fn(a, b)`
* **Description:** Sort function for teleport targets by distance (ascending order).
* **Parameters:**
  - `a` -- first target with distance property
  - `b` -- second target with distance property
* **Returns:** boolean -- true if a.distance < b.distance
* **Error states:** None

### `NoHoles(pt)`
* **Description:** Validates that a position is not blocked by ground holes.
* **Parameters:** `pt` -- position vector to check
* **Returns:** boolean -- true if position is not blocked, false otherwise
* **Error states:** None

### `blinkstaff_reticuletargetfn()`
* **Description:** Returns valid blink target position for orange staff reticule using NoHoles validation.
* **Parameters:** None
* **Returns:** Position vector for blink target
* **Error states:** None

### `CheckSpawnedLoot(loot)`
* **Description:** Checks if spawned loot should sink; handles inventory items and entities near holes or in water.
* **Parameters:** `loot` -- spawned loot entity instance
* **Returns:** None
* **Error states:** None

### `SpawnLootPrefab(inst, lootprefab)`
* **Description:** Spawns a loot prefab at the staff's position with random velocity; applies sinking check after delay.
* **Parameters:**
  - `inst` -- staff entity instance (source position)
  - `lootprefab` -- string prefab name to spawn
* **Returns:** Spawned loot entity instance, or `nil` if spawn failed
* **Error states:** None

### `HasRecipe(guy)`
* **Description:** Checks if an entity prefab has a recipe in AllRecipes (for deconstruction validation).
* **Parameters:** `guy` -- entity to check
* **Returns:** boolean -- true if prefab has a recipe, false otherwise
* **Error states:** None

### `light_reticuletargetfn()`
* **Description:** Returns valid light placement position for yellow/opal staff reticule (slightly raised above ground).
* **Parameters:** None
* **Returns:** Position vector for light placement
* **Error states:** None

## Events & listeners
- **Listens to:** None directly (components handle their own event subscriptions)
- **Pushes:**
  - `attacked` -- fired on target when staff hits (red, blue staffs)
  - `teleported` -- fired on entity after teleport completes (purple staff)
  - `teleport_move` -- fired when entity position changes during teleport
  - `on_loot_dropped` -- fired on spawned loot items (green staff deconstruct)
  - `ondeconstructstructure` -- fired on target structure before removal (green staff)
  - `equipskinneditem` -- fired on owner when skinned staff is equipped
  - `unequipskinneditem` -- fired on owner when skinned staff is unequipped