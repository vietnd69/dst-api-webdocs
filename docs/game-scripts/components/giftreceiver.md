---
id: giftreceiver
title: Giftreceiver
description: Manages the player's gift count and coordinates gift-related interactions with a gift machine component.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: fc384c8b
---

# Giftreceiver

## Overview
The `GiftReceiver` component tracks the number of gifts available for a player and manages communication with a `GiftMachine` component when the player opens or clears gifts. It ensures that the player’s classified UI state (e.g., "has gifts") and the gift machine's internal list of eligible receivers are kept in sync.

## Dependencies & Tags
- **Components used**: Relies on `inst.player_classified` (assumed to have `hasgift` and `hasgiftmachine` properties) and `TheInventory:GetClientGiftCount()`.
- **Tags**: None identified.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `giftcount` | `number` | `0` | Current number of gifts available to the player (synchronized via `TheInventory`). Triggers UI updates when changed. |
| `giftmachine` | `Entity | nil` | `nil` | Reference to the `GiftMachine` entity currently associated with this receiver. Controls gift-opening interaction and receiver registration. |

## Main Functions

### `RefreshGiftCount()`
* **Description:** Fetches the current gift count from `TheInventory` and updates the local state. If the count changes and a gift machine is assigned, notifies the machine by pushing `ms_addgiftreceiver` or `ms_removegiftreceiver` events.
* **Parameters:** None.

### `SetGiftMachine(inst)`
* **Description:** Assigns a new `GiftMachine` entity as the receiver’s associated machine. Updates both the old and new machines (if applicable) by pushing `ms_removegiftreceiver` or `ms_addgiftreceiver` events to manage the machine’s internal list of eligible receivers.
* **Parameters:**  
  - `inst`: The new `GiftMachine` entity to associate, or `nil` to clear the association.

### `OpenNextGift()`
* **Description:** Initiates the gift-opening process *if* the player has gifts and a valid gift machine is assigned. Pushes the `ms_opengift` event to signal intent.
* **Parameters:** None.

### `OnStartOpenGift()`
* **Description:** Notifies the assigned gift machine that a gift is beginning to be opened by pushing the `ms_giftopened` event.
* **Parameters:** None.

### `OnStopOpenGift(usewardrobe)`
* **Description:** Signals completion of the gift-opening interaction. Pushes `ms_doneopengift` with optional `wardrobe` data if `usewardrobe` is true.
* **Parameters:**  
  - `usewardrobe`: `boolean` indicating whether the wardrobe window should be opened after opening the gift.

### `HasGift()`
* **Description:** Returns whether the player currently has any gifts available.
* **Parameters:** None.  
* **Returns:** `boolean` — `true` if `giftcount > 0`, otherwise `false`.

## Events & Listeners
- **Listens for `ms_closepopup`** → Triggers `onclosepopup` handler, which calls `OnStopOpenGift` if the closed popup is `POPUPS.GIFTITEM`.
- **Listens for `ms_updategiftitems`** (via `OnInit` callback) → Calls `OnUpdateGiftItems`, which in turn calls `RefreshGiftCount`.
- **Pushes `ms_opengift`** in `OpenNextGift()`.
- **Pushes `ms_addgiftreceiver` / `ms_removegiftreceiver`** to the assigned `giftmachine` when `giftcount` or `giftmachine` changes.
- **Pushes `ms_giftopened`** to the assigned `giftmachine` in `OnStartOpenGift()`.
- **Pushes `ms_doneopengift`** in `OnStopOpenGift()`.