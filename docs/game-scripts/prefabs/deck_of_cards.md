---
id: deck_of_cards
title: Deck Of Cards
description: Manages a deck of playing cards with visual stack states, shuffling via punching, and reveal mechanics.
tags: [inventory, combat, card, sound, fx]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: acbf8dcd
system_scope: inventory
---

# Deck Of Cards

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `deck_of_cards` prefab implements a collectible deck of playing cards used in the Balatro minigame. It provides visual and mechanical support for decks of varying sizes (0–99+ cards), dynamically changing animation state, and network-aware representation of the top card and deck stack size. It integrates with the `deckcontainer` and `playingcard` components and supports interaction via punching (to shuffle), flipping, and splitting.

## Usage example
```lua
local deck = SpawnPrefab("deck_of_cards")
deck.FlipDeck() -- Flip the deck (reveal/hide top card)
deck.components.deckcontainer:AddRandomCard() -- Add a random card
deck:PushEvent("flipdeck") -- Trigger flip via event
```

## Dependencies & tags
**Components used:** `deckcontainer`, `inventoryitem`, `inspectable`, `combat`, `health`, `transform`, `animstate`, `soundemitter`, `network`  
**Tags:** `deck_of_cards`, `deckcontainer`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_revealed` | boolean | `false` | Whether the top card of the deck is visible (revealed). |
| `_hit_recently_count` | number | `0` | Tracks recent hits to determine when to scatter cards. |
| `_deck_size` | net_tinybyte | `0` | Networked bucket index (0–3) representing deck size tiers. |
| `_top_card_id` | net_ushortint | `0` | Networked ID of the top card in the deck. |

## Main functions
### `FlipDeck(inst)`
* **Description:** Toggles the deck's revealed state and reverses the card order (used to visually "flip" the deck, e.g., from face-down to face-up).
* **Parameters:** `inst` (Entity) — the deck instance.
* **Returns:** Nothing.

### `OnPunched(inst, data)`
* **Description:** Handles punch interactions: shuffles the deck after a cooldown-based threshold of hits (`HITS_BEFORE_SCATTER = 10`), or scatters individual cards if threshold is exceeded.
* **Parameters:**  
  - `inst` (Entity) — the deck instance.  
  - `data` (table) — hit data (unused directly).
* **Returns:** Nothing.
* **Error states:** Scattering only occurs when deck size ≥ 2.

### `OnInvImageDirty(inst)`
* **Description:** Constructs and updates the layered inventory image (bottom = deck graphic, top = revealed card if any), then fires `imagechange`.
* **Parameters:** `inst` (Entity) — the deck instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `flipdeck` — triggers `FlipDeck()` to toggle revealed state.  
  - `attacked` — triggers `OnPunched()` to handle shuffling/scattering.  
  - `invimagechanged` — re-computes inventory image on client (if not master).
- **Pushes:**  
  - `imagechange` — fired when inventory image is updated.