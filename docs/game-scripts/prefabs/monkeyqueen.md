---
id: monkeyqueen
title: Monkeyqueen
description: Manages the Monkey Queen entity, a boss NPC in Monkey Island that interacts with players and monkeys via trading, state transitions (sleep/wake), and scripted events.
tags: [boss, npc, trading, ai, world]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: df7cd7b9
system_scope: entity
---

# Monkeyqueen

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `monkeyqueen` prefab defines the behavior of the Monkey Queen boss entity. It integrates multiple components to handle trading (via the `trader` component), speech (via the `talker` component), sleep/wake logic (via periodic proximity checks), and event coordination (e.g., the "right_of_passage" timer). The entity uses a custom state graph (`SGmonkeyqueen`) and is registered globally via the `ms_register_monkeyqueen` event.

## Usage example
This prefab is instantiated automatically by the game via `return Prefab("monkeyqueen", fn, assets, prefabs)`. Modders typically interact with it through events or component hooks rather than direct instantiation. Example of listening to its registration:
```lua
TheWorld:ListenForEvent("ms_register_monkeyqueen", function(inst, queen)
    -- queen is the Monkey Queen entity instance
    queen.components.trader:SetAcceptTest(function(...) return true end)
end)
```

## Dependencies & tags
**Components used:** `talker`, `pointofinterest`, `trader`, `updatelooper`, `timer`, `lootdropper`, `inspectable`  
**Tags added:** `trader`, `shelter`, `monkey`, `monkeyqueen`

## Properties
No public properties are initialized directly in the constructor. Component-specific properties (e.g., `inst.components.talker.fontsize`) are set after component addition.

## Main functions
### `fn()`
*   **Description:** Constructor function that creates and configures the Monkey Queen entity. Instantiates the entity, adds visual/audio/physics components, registers state graph, initializes components, and sets up world registration.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — The fully configured Monkey Queen entity instance.
*   **Error states:** Returns a partial client-only entity if `TheWorld.ismastersim` is false.

### `on_accept_item(inst, giver, item)`
*   **Description:** Handler for accepted trade items. Moves the queen to the "getitem" state and removes the item.
*   **Parameters:** 
    *   `inst` (Entity) — The Monkey Queen instance.
    *   `giver` (Entity) — The trader (player or monkey).
    *   `item` (Entity) — The accepted trade item.
*   **Returns:** Nothing.

### `on_refuse_item(inst, giver, item)`
*   **Description:** Handler for refused trade items. Moves the queen to the "refuse" state.
*   **Parameters:** 
    *   `inst` (Entity) — The Monkey Queen instance.
    *   `giver` (Entity) — The trader.
    *   `item` (Entity) — The refused item.
*   **Returns:** Nothing.

### `able_to_accept_trade_test(inst, item, giver)`
*   **Description:** Test function determining if the queen is available to trade. Blocks trades if the queen is in a "busy" state.
*   **Parameters:** 
    *   `inst` (Entity) — The Monkey Queen instance.
    *   `item` (Entity) — The offered item.
    *   `giver` (Entity) — The trader.
*   **Returns:** 
    *   `success` (boolean) — True if trading is allowed.
    *   `reason` (string?) —Localization key like `"QUEENBUSY"` if blocked.
*   **Error states:** Returns `success = false` and `"QUEENBUSY"` if `inst.sg:HasStateTag("busy")`.

### `accept_trade_test(inst, item, giver)`
*   **Description:** Test function verifying if the offered item qualifies as a bribe.
*   **Parameters:** 
    *   `inst` (Entity) — The Monkey Queen instance.
    *   `item` (Entity) — The offered item.
    *   `giver` (Entity) — The trader.
*   **Returns:** `boolean` — True if `item` has the tag `"monkeyqueenbribe"`.

### `speech_override_fn(inst, speech)`
*   **Description:** Overrides speech text based on the speaker's tag. Returns original speech for "wonkey" players; otherwise returns monkey speech.
*   **Parameters:** 
    *   `inst` (Entity) — The Monkey Queen instance.
    *   `speech` (string) — The base speech string.
*   **Returns:** `string` — The final speech string.

### `findwakereason(inst, dist)`
*   **Description:** Finds the closest entity that could wake the queen (player within range or monkey with bananas).
*   **Parameters:** 
    *   `inst` (Entity) — The Monkey Queen instance.
    *   `dist` (number) — Proximity threshold (typically `WAKEUP_DIST` = `10`).
*   **Returns:** `Entity?` — The closest qualifying entity, or `nil`.

### `playerproxcheck(inst, dt)`
*   **Description:** Called periodically to check player/monkey proximity and transition between sleep and wake states.
*   **Parameters:** 
    *   `inst` (Entity) — The Monkey Queen instance.
    *   `dt` (number) — Time delta since last update.
*   **Returns:** Nothing.

### `ontimerdone(inst, data)`
*   **Description:** Handles completion of the "right_of_passage" timer. Triggers victory events for nearby entities with the `"pirate"` tag.
*   **Parameters:** 
    *   `inst` (Entity) — The Monkey Queen instance.
    *   `data` (table?) — Timer data, expected to contain `name = "right_of_passage"`.
*   **Returns:** Nothing.

### `ontalk(inst, script)`
*   **Description:** Overrides default talk behavior. Plays a specific sound for non-happy/non-banana speech.
*   **Parameters:** 
    *   `inst` (Entity) — The Monkey Queen instance.
    *   `script` (string) — The speech script identifier.
*   **Returns:** `nil` — Suppresses default talk handling for certain strings.

### `OnEntitySleep(inst)`
*   **Description:** Handles entity sleep state. Stops ambient looping sound.
*   **Parameters:** `inst` (Entity) — The Monkey Queen instance.
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Handles entity wake state. Starts ambient looping sound.
*   **Parameters:** `inst` (Entity) — The Monkey Queen instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `timerdone` — Triggers `ontimerdone`.
- **Pushes:** `ms_register_monkeyqueen` — Broadcasts the queen entity instance on world initialization.
- **Component event handlers:** `ontalk` (Talker), `onaccept`/`onrefuse` (Trader).