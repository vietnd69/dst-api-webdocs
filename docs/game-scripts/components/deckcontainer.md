---
id: deckcontainer
title: Deckcontainer
description: Manages a collection of playing cards as a deck, supporting add, remove, shuffle, split, and merge operations.
tags: [inventory, deck, card]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 87487a05
system_scope: entity
---

# Deckcontainer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`DeckContainer` is a component that maintains an ordered list of playing card IDs (`self.cards`) and provides utilities for standard deck operations such as shuffling, reversing, peeking, and merging. It is attached to an entity via `inst:AddComponent("deckcontainer")` and automatically adds the `deckcontainer` tag to the entity. When the entity is removed, the tag is cleaned up. This component is typically used for interactive deck objects (e.g., a deck of cards on a table or held by a character).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("deckcontainer")
inst.components.deckcontainer:AddRandomCard()
inst.components.deckcontainer:AddCards({113, 205, 307})
inst.components.deckcontainer:Shuffle()
print(inst.components.deckcontainer:Count()) -- e.g., 3
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `deckcontainer` on construction, removes on entity removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `cards` | table (array of numbers) | `{}` | Ordered list of card IDs currently in the deck. |
| `on_card_added` | function (optional) | `nil` | Callback invoked when a single card is added (`function(inst, card_id)`). |
| `on_cards_added_bulk` | function (optional) | `nil` | Callback invoked when multiple cards are added (`function(inst, card_ids)`). |
| `on_card_removed` | function (optional) | `nil` | Callback invoked when a card is removed (`function(inst, card_id)`). |
| `on_split_deck` | function (optional) | `nil` | Callback invoked after splitting from another deck (`function(this_inst, source_inst)`). |
| `on_deck_shuffled` | function (optional) | `nil` | Callback invoked after shuffling (`function(inst)`). |

> Note: Callbacks are stored as callable fields on the component instance and can be assigned by modders.

## Main functions
### `MergeDecks(other_deck, moved_count)`
*   **Description:** Moves cards from another deck (`other_deck`) into this deck. Moves at most `moved_count` cards (defaults to the full count of `other_deck`).
*   **Parameters:** 
    *   `other_deck` (DeckContainer) — the source deck to move cards from.
    *   `moved_count` (number, optional) — number of cards to move. Defaults to `other_deck:Count()`.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; relies on `other_deck` having a `.cards` table and `other_deck:Count()` returning a non-negative number.

### `SplitDeck(source_deck, num_to_get)`
*   **Description:** Moves `num_to_get` cards from `source_deck` into this deck, then reverses this deck in-place.
*   **Parameters:** 
    *   `source_deck` (DeckContainer) — the deck to draw cards from.
    *   `num_to_get` (number) — number of cards to transfer.
*   **Returns:** Nothing.
*   **Error states:** If `num_to_get` exceeds `source_deck:Count()`, it may remove more than intended; no bounds check is performed.

### `AddCard(id, position)`
*   **Description:** Inserts a card (`id`) into the deck. If `position` is provided, inserts at that index (1-based); otherwise appends to the end.
*   **Parameters:** 
    *   `id` (number) — card identifier.
    *   `position` (number, optional) — 1-based index for insertion.
*   **Returns:** Nothing.
*   **Error states:** None.

### `AddRandomCard()`
*   **Description:** Generates a random card ID using formula `(100 * suit) + rank`, where `suit` is 1–4 and `rank` is 1–13, then adds it to the deck.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None.

### `AddCards(ids)`
*   **Description:** Appends all card IDs in the `ids` table to the deck (in order).
*   **Parameters:** 
    *   `ids` (table of numbers) — list of card IDs to append.
*   **Returns:** Nothing.
*   **Error states:** None.

### `RemoveCard(position)`
*   **Description:** Removes and returns a card from the deck. If `position` is provided and less than deck size, removes from that index; otherwise removes from the end.
*   **Parameters:** 
    *   `position` (number, optional) — 1-based index to remove.
*   **Returns:** `removed_id` (number) — the card ID that was removed, or `nil` if deck was empty.
*   **Error states:** If the deck becomes empty after removal (`#cards == 0`), the owning entity (`self.inst`) is automatically destroyed via `self.inst:Remove()`.

### `PeekCard(position)`
*   **Description:** Returns the card ID at the specified position without removing it. If `position` is omitted, returns the last card.
*   **Parameters:** 
    *   `position` (number, optional) — 1-based index. Defaults to `#cards`.
*   **Returns:** `card_id` (number) — the card at that position, or `nil` if the deck is empty.
*   **Error states:** Returns `nil` if deck is empty.

### `Shuffle()`
*   **Description:** Randomly reorders the deck in-place using `shuffleArray`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None.

### `Reverse()`
*   **Description:** Reverses the deck order in-place using `table.reverse_inplace`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None.

### `Count()`
*   **Description:** Returns the number of cards currently in the deck.
*   **Parameters:** None.
*   **Returns:** `count` (number) — number of cards.
*   **Error states:** None.

### `OnSave()`
*   **Description:** Returns a serializable snapshot of the deck for persistence.
*   **Parameters:** None.
*   **Returns:** `{cards = self.cards}` (table).

### `OnLoad(data)`
*   **Description:** Restores the deck from saved data. Copies all IDs from `data.cards` into `self.cards`.
*   **Parameters:** 
    *   `data` (table) — must contain a `cards` array of card IDs.
*   **Returns:** Nothing.
*   **Error states:** If `data.cards` is missing or `nil`, no cards are loaded.

### `GetDebugString()`
*   **Description:** Returns a fixed-width string showing the current card count for debugging UI.
*   **Parameters:** None.
*   **Returns:** `debug_string` (string) — e.g., `"   5"` for five cards.

## Events & listeners
- **Listens to:** None identified (no events registered via `inst:ListenForEvent`).
- **Pushes:** None identified (no events fired via `inst:PushEvent`). Callbacks are direct function calls, not events.
