---
id: deckcontainer
title: Deckcontainer
description: This component allows an entity to manage a collection of 'cards' in a deck-like structure, offering operations such as adding, removing, shuffling, and combining.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: inventory
---

# Deckcontainer

## Overview
The `Deckcontainer` component provides an entity with the ability to function as a container for a collection of "cards" (represented by numerical IDs). It offers a robust set of functionalities for manipulating this collection, including adding, removing, peeking at, shuffling, reversing, and combining or splitting decks. It also integrates with the game's save/load system.

## Dependencies & Tags
This component does not explicitly rely on other components being added to the entity via `inst:AddComponent()`.
It adds the `deckcontainer` tag to its host entity during initialization and removes it upon entity removal.
It uses global helper functions `shuffleArray`, `table.reverse_inplace`, and `ConcatArrays` which are assumed to be available in the environment.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `inst` | `Entity` | (reference) | A reference to the entity this component is attached to. |
| `cards` | `table` | `{}` | A table storing the numerical IDs of the cards currently in the deck. |
| `on_card_added` | `function` | `nil` | An optional callback function invoked when a single card is added to the deck, taking `(inst, card_id)` as arguments. |
| `on_cards_added_bulk` | `function` | `nil` | An optional callback function invoked when multiple cards are added using `AddCards`, taking `(inst, ids_table)` as arguments. |
| `on_card_removed` | `function` | `nil` | An optional callback function invoked when a card is removed from the deck, taking `(inst, removed_card_id)` as arguments. |
| `on_split_deck` | `function` | `nil` | An optional callback function invoked after `SplitDeck` completes, taking `(self_inst, source_deck_inst)` as arguments. |
| `on_deck_shuffled` | `function` | `nil` | An optional callback function invoked after `Shuffle` completes, taking `(inst)` as arguments. |

## Main Functions
### `OnRemoveEntity()`
*   **Description:** This function is called when the entity this component is attached to is being removed. It handles cleanup by removing the "deckcontainer" tag from the entity.
*   **Parameters:** None.

### `OnRemoveFromEntity()`
*   **Description:** An alias for `OnRemoveEntity()`, providing backward compatibility or alternative naming.
*   **Parameters:** None.

### `MergeDecks(other_deck, moved_count)`
*   **Description:** Merges cards from another `DeckContainer` component (`other_deck`) into this deck. By default, it moves all cards from `other_deck`, but a `moved_count` can specify a subset. Cards are moved in order from the `other_deck`'s front.
*   **Parameters:**
    *   `other_deck`: (`DeckContainer`) The target `DeckContainer` instance from which cards will be moved.
    *   `moved_count`: (`number`, optional) The number of cards to move from `other_deck`. Defaults to the total count of cards in `other_deck`.

### `SplitDeck(source_deck, num_to_get)`
*   **Description:** Moves a specified number of cards from a `source_deck` into this deck. The cards are added to this deck and then this deck is reversed, effectively placing the first card taken at the top of this new deck. An optional `on_split_deck` callback is triggered if set.
*   **Parameters:**
    *   `source_deck`: (`DeckContainer`) The `DeckContainer` instance from which cards will be taken.
    *   `num_to_get`: (`number`) The number of cards to move from `source_deck` to this deck.

### `AddCard(id, position)`
*   **Description:** Adds a single card ID to the deck. If `position` is specified, the card is inserted at that index; otherwise, it's added to the end. An optional `on_card_added` callback is triggered if set.
*   **Parameters:**
    *   `id`: (`number`) The numerical ID of the card to add.
    *   `position`: (`number`, optional) The 1-based index where the card should be inserted.

### `AddRandomCard()`
*   **Description:** Generates a random card ID (in the format `(100 * random_1_4) + random_1_13`) and adds it to the deck using `AddCard()`.
*   **Parameters:** None.

### `AddCards(ids)`
*   **Description:** Adds multiple card IDs from a provided table to the end of the deck. An optional `on_cards_added_bulk` callback is triggered if set.
*   **Parameters:**
    *   `ids`: (`table`) A table containing the numerical IDs of the cards to add.

### `RemoveCard(position)`
*   **Description:** Removes a card from the deck. If `position` is specified, the card at that index is removed; otherwise, the last card is removed. If the deck becomes empty after removal, the host entity itself is removed. An optional `on_card_removed` callback is triggered if set.
*   **Parameters:**
    *   `position`: (`number`, optional) The 1-based index of the card to remove.
*   **Returns:** (`number`) The ID of the card that was removed.

### `PeekCard(position)`
*   **Description:** Returns the ID of a card in the deck without removing it. If `position` is specified, the card at that index is returned; otherwise, the last card in the deck is returned.
*   **Parameters:**
    *   `position`: (`number`, optional) The 1-based index of the card to peek at.
*   **Returns:** (`number`) The ID of the card at the specified (or last) position.

### `Shuffle()`
*   **Description:** Randomizes the order of cards within the deck using the global `shuffleArray` function. An optional `on_deck_shuffled` callback is triggered if set.
*   **Parameters:** None.

### `Reverse()`
*   **Description:** Reverses the order of all cards in the deck using the global `table.reverse_inplace` function.
*   **Parameters:** None.

### `Count()`
*   **Description:** Returns the current number of cards in the deck.
*   **Parameters:** None.
*   **Returns:** (`number`) The total count of cards.

### `OnSave()`
*   **Description:** Prepares the component's data for saving. It returns a table containing the `cards` table.
*   **Parameters:** None.
*   **Returns:** (`table`) A table with a `cards` key holding the current deck's card IDs.

### `OnLoad(data)`
*   **Description:** Loads saved data into the component. If `data.cards` exists, it concatenates the loaded cards into the current deck using the global `ConcatArrays` function.
*   **Parameters:**
    *   `data`: (`table`) The table containing the saved component data.

### `GetDebugString()`
*   **Description:** Returns a formatted string representing the current count of cards in the deck, useful for debugging overlays.
*   **Parameters:** None.
*   **Returns:** (`string`) A string indicating the number of cards.