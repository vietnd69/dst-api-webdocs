---
id: cozy_bunnyman
title: Cozy Bunnyman
description: A playable character with trader, combat, and minigame participation behaviors, primarily used for the YOTR Pillow Fight event.
tags: [entity, combat, trader, minigame, npc]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fa5a3844
system_scope: entity
---

# Cozy Bunnyman

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`cozy_bunnyman` is a prefabricated character entity designed for participation in the YOTR (You of the Right) minigame events, especially pillow fights. It implements a rich set of behaviors via components including `combat` (for fighting), `trader` (for accepting tokens/food), `sleeper` (diurnal behavior), `locomotor` (custom movement speeds), and `sanityaura` (provides passive sanity benefits to its leader). It integrates closely with the `SGcozy_bunnyman` stategraph and `cozy_bunnymanbrain` AI, and handles event-specific logic such as arena tracking, pillow ownership, and prize delivery.

## Usage example
This is a prefab definition, not a reusable component. To spawn an instance:
```lua
local bunny = SpawnPrefab("cozy_bunnyman")
if bunny ~= nil then
    -- Customization after spawn (e.g., position)
    bunny.Transform:SetPosition(x, y, z)
    bunny.components.health:SetMaxHealth(150)
end
```

## Dependencies & tags
**Components used:** `talker`, `locomotor`, `embarker`, `drownable`, `bloomer`, `eater`, `combat`, `named`, `health`, `inventory`, `lootdropper`, `knownlocations`, `homeseeker`, `entitytracker`, `trader`, `sanityaura`, `sleeper`, `inspectable`, `timer`.

**Tags added:** `character`, `pig`, `manrabbit`, `scarytoprey`, `cozy_bunnyman`, `trader`, `_named`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fightprizes` | table | `{}` | Stores prize data (`prize`, `winner`) for completed pillow fights. |
| `_return_to_pillow_spot` | boolean | `nil` | Flag indicating whether the bunny should return to its pillow after the event. |
| `shouldhide` | boolean | `nil` | Set when the `shouldhide` timer fires (internal state). |
| `needspillow` | boolean | `nil` | Set when a YOTR token is accepted; indicates a pillow is required. |
| `carrotgamestatus` | string | `nil` | Tracks status in the carrot-eating minigame (e.g., `"prizedelivered"`). |
| `sayspoilsport` | boolean | `nil` | Set if a prize is delivered while a player is still eating. |
| `gamehost` | boolean | `nil` | Set during minigames (status flag). |
| `gooptoeat` | boolean | `nil` | Minigame flag (status indicator). |

## Main functions
### `GetNextArena(inst)`
* **Description:** Selects the closest available arena from `TheWorld.yotr_fightrings` to the bunny’s current position.
* **Parameters:** `inst` (Entity) — the cozy bunnyman instance.
* **Returns:** Arena entity or `nil` if no arenas exist.
* **Error states:** Returns `nil` if `TheWorld.yotr_fightrings` is not set or empty.

### `OnGetItemFromPlayer(inst, giver, item)`
* **Description:** Handles trading behavior when a player offers an item. Accepts `yotr_token` (to register for a fight) or edible items (to eat), but rejects carrots during minigames.
* **Parameters:**  
  `inst` (Entity),  
  `giver` (Entity),  
  `item` (Entity) — the offered item.
* **Returns:** Nothing. Fires events (`reject`, `gotyotrtoken`, `cheer`) and updates state (e.g., tracks arena, sets `needspillow`).

### `OnAttacked(inst, data)`
* **Description:** Reacts to non-pillow attacks by finishing any active minigame, updating timers, and alerting nearby bunnymen.
* **Parameters:**  
  `inst` (Entity),  
  `data` (table) — includes `weapon` (Entity or `nil`).
* **Returns:** Nothing. Does nothing if attacked with a pillow or during minigame participation.

### `OnPillowFightStarted(inst, arena)`
* **Description:** Initializes state when a pillow fight begins (e.g., removes pillow fight location, calculates start position).
* **Parameters:**  
  `inst` (Entity),  
  `arena` (Entity) — the arena where the fight occurs.
* **Returns:** Nothing.

### `OnPillowFightDeactivated(inst)`
* **Description:** Cleans up after a pillow fight ends (drops target, forgets arena, schedules return home).
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `finishgame(inst)`
* **Description:** Resets minigame state on the shrine and all participating bunnymen (called when a fight or carrot game ends).
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `NamePillow(item, inst)`
* **Description:** Assigns a localized ownership name to a pillow if not already named.
* **Parameters:**  
  `item` (Entity) — the pillow,  
  `inst` (Entity) — the bunny claiming it.
* **Returns:** Nothing. Modifies `item.components.named`.

### `connecttofloorpillow(inst)`
* **Description:** Called after spawn to bind floor pillow to home and remove inventory tags for ownership.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `attacked` — triggers `OnAttacked` (combat reaction).  
  `dropitem` — triggers `OnItemDropped` (handles pillow placement).  
  `timerdone` — triggers `ontimerdone` (manages timers like `shouldhide`).  
  `itemget` — triggers `OnGetItem` (handles pillow retrieval).  
  `setupprizes` — triggers `OnSetupPrizes` (sets up loot for winners).  
  `pillowfight_arrivedatarena` — triggers `OnPillowFightArrivedAtArena`.  
  `pillowfight_startgame` — triggers `OnPillowFightStarted`.  
  `pillowfight_ringout`, `pillowfight_ended` — triggers `OnOutOfPillowFight`.  
  `pillowfight_deactivated` — triggers `OnPillowFightDeactivated`.  

- **Pushes:**  
  `gotyotrtoken`, `reject`, `cheer` — triggered in `OnGetItemFromPlayer`.  
  `wrappeditem` — fired by `unwrappable` (via `WrapItems`), not directly here but part of loot delivery.