---
id: balatrowidget
title: Balatrowidget
description: The Balatrowidget widget implements the full UI and game logic for the Balatro minigame, handling card selection, discard, scoring with joker effects, and round progression.
tags: [ui, game, balatro]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 2bb0474e
system_scope: ui
---

# Balatrowidget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The Balatrowidget is a UI widget that manages the Balatro minigame session. It provides the complete interface for card display, joker selection, discard logic, and score computation. It handles both singleplayer and multiplayer discard synchronization, schedules timed visual/sound effects for joker interactions (e.g., chip/mult adjustments), maintains game state across rounds, and integrates with the controller and animation systems.

## Usage example
```lua
local balatrowidget = BalatroWidget(
    parent,
    inst,
    cards,      -- table of 5 encoded card values (suit*100 + rank)
    jokerchoices, -- table of 3 joker names for selection
    "forest"
)
balatrowidget:OpenWithAnimations()
-- Later, during gameplay:
balatrowidget:MarkForDiscard(2) -- discard card slot 2
balatrowidget:Deal() -- submit discard and proceed
-- After discard is processed:
local final_score = balatrowidget:GetFinalScore()
```

## Dependencies & tags
**Components used:** None directly referenced — uses Widget as base class and creates child widgets.  
**Tags:** None found across all chunks.

**External dependencies:**
- `Widget`
- `UIAnim`, `UIAnimButton`, `ImageButton`, `Text`, `Image`
- `BALATRO_UTIL` — card/joker constants, encoding utilities, UI helpers
- `TheFrontEnd` — sound management (play/kill/set parameters)
- `TheInput` — controller detection and localized controls
- `STRINGS` — localized text (hand names, joker names, button labels)
- `POPUPS` — Balatro popup types and `SendMessageToServer`
- `FRAMES` — time unit for queued animations (approx. 1/30s)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `self.root` | Widget | nil | Root widget container |
| `self.owner` | Entity | nil | Owner entity of the widget |
| `self.target` | Entity | nil | Target entity of the widget |
| `self.parentscreen` | Screen | nil | Parent screen for navigation |
| `self.discard` | Table | `{}` | Map of discarded card slots: `discard[slot] = true` |
| `self.joker_choice` | String/nil | nil | Currently selected joker (e.g., `"waxwell"`) |
| `self.joker_choice_id` | Number/nil | nil | Index (1–3) of selected joker |
| `self.round` | Number | 1 | Current round number |
| `self._score` | Number/nil | nil | Final computed score (only set at end of game) |
| `self.chips` | Number | 0 | Current hand chip count |
| `self.mult` | Number | 0 | Current hand multiplier |
| `self.slots` | Table | `{}` | 5 card slots containing encoded card IDs (suit*100 + rank) |
| `self.newslots` | Table/nil | nil | Replacement cards received from server after discard |
| `self.jokerchoices` | Table | `{}` | 3 available joker names for selection |
| `self.joker` | String | `"waxwell"` | Selected joker name (set after selection) |
| `self.queue` | Table | `{}` | Animation queue storing `{fn = func, time = t}` entries |

## Main functions

### `BalatroWidget:OnPopupMessage(doer, data)`
* **Description:** Handles client-side popup messages; specifically processes `POPUPS.BALATRO` messages of type `NEW_CARDS` to populate `self.newslots`, then triggers `ReceiveDeal`. |
* **Parameters:**  
  - `doer` — entity sending the event (unused)  
  - `data` — table with keys `popup` and `args`; `args` must contain card data for `NEW_CARDS`  
* **Returns:** `nil`
* **Error states:** Returns early if `popup` is not `POPUPS.BALATRO` or `args` is `nil`.

### `BalatroWidget:GetFinalScore()`
* **Description:** Returns the final score of the current game session. |
* **Parameters:** None |
* **Returns:** `self._score` — the final computed score (number), or `nil` if the game is not yet complete. |
* **Error states:** Returns `nil` if called before game completion (i.e., before round 3 ends).

### `BalatroWidget:calcMultSnd(s)`
* **Description:** Maps a multiplier tier index `s` (clamped to ≤7) to its corresponding sound multiplier value. |
* **Parameters:** `s` — integer tier index (0-based). |
* **Returns:** Float value from `MULTSND` table: `0.15`, `0.25`, `0.35`, `0.5`, `0.6`, `0.7`, `0.75`. |
* **Error states:** `s` is clamped to max 7 before indexing.

### `BalatroWidget:settextwithcontroll(wiget, text, control)`
* **Description:** Appends localized controller key hint to text (e.g., `"Press [ACCEPT] to Deal"`) if a controller is attached. |
* **Parameters:**  
  - `wiget` — widget whose text will be set  
  - `text` — base string  
  - `control` — control ID constant (e.g., `CONTROL_ACCEPT`)  
* **Returns:** `nil`

### `BalatroWidget:setupgamenotes()`
* **Description:** Constructs and populates `self.root.game_notes` with hand ranks, mult tiers, and card ranks tables. |
* **Parameters:** None |
* **Returns:** `nil`

### `BalatroWidget:UnselectJoker(i)`
* **Description:** Removes visual selection from joker card `i`: resets scale/position, hides highlight, clears selection state. |
* **Parameters:** `i` — joker index (1–3). |
* **Returns:** `nil`

### `BalatroWidget:SelectJoker(i)`
* **Description:** Visually selects joker card `i`, sets internal selection (`self.joker_choice`, `self.joker_choice_id`), unselects others, and enables the deal button. |
* **Parameters:** `i` — joker index (1–3). |
* **Returns:** `nil`
* **Error states:** Only performs action if joker not already selected.

### `BalatroWidget:StartSelectJoker()`
* **Description:** Starts the joker selection UI: shows background, builds 3 joker cards via closure, binds controller/key interactions, and preselects first joker on controller. |
* **Parameters:** None |
* **Returns:** `nil`

### `BalatroWidget:ClearJokerSelection()`
* **Description:** Hides all 3 joker selection cards. |
* **Parameters:** None |
* **Returns:** `nil`

### `BalatroWidget:ControllerUnselectCard()`
* **Description:** Removes controller highlight from the previously selected card (if any). |
* **Parameters:** None |
* **Returns:** `nil`

### `BalatroWidget:ControllerSelectCard(card)`
* **Description:** Visually selects card slot `card` for controller mode: scales up, displays button hint, unselects previous card. |
* **Parameters:** `card` — card slot index (1–5). |
* **Returns:** `nil`

### `BalatroWidget:StartPlayGame()`
* **Description:** Transitions from joker selection to gameplay: closes joker UI, shows score labels, enables card slots, schedules initial card flip animations, starts controller selection, and sets mode to `"deal"`. |
* **Parameters:** None |
* **Returns:** `nil`

### `BalatroWidget:OpenWithAnimations()`
* **Description:** Plays background open animation on the widget. |
* **Parameters:** None |
* **Returns:** `nil`

### `BalatroWidget:CloseWithAnimations()`
* **Description:** Stops updates and sounds, plays close animation, and pops the parent screen on animation completion. |
* **Parameters:** None |
* **Returns:** `nil`

### `BalatroWidget:MarkForDiscard(slot)`
* **Description:** Marks `slot` as discarded: moves card down, dims it, updates deal button text. |
* **Parameters:** `slot` — card slot index (1–5). |
* **Returns:** `nil`

### `BalatroWidget:UnmarkForDiscard(slot)`
* **Description:** Removes discard flag from `slot`: restores card position/color, re-enables deal button if no cards are discarded. |
* **Parameters:** `slot` — card slot index (1–5). |
* **Returns:** `nil`

### `BalatroWidget:AddMult(amt)`
* **Description:** Adds `amt` to `self.mult`, updates `self.root.mult` text. |
* **Parameters:** `amt` — number to add. |
* **Returns:** `nil`

### `BalatroWidget:AddChips(amt)`
* **Description:** Adds `amt` to `self.chips` (floored at 0), updates `self.root.chips` text. |
* **Parameters:** `amt` — number to add (can be negative). |
* **Returns:** `nil`

### `BalatroWidget:calcrank(score)`
* **Description:** Returns the index of the highest score tier in `BALATRO_UTIL.SCORE_RANKS` that `score` meets or exceeds. |
* **Parameters:** `score` — integer score. |
* **Returns:** Integer index into `SCORE_RANKS`, or `nil` if `score` is below all thresholds. |

### `BalatroWidget:EnableDealButton(set)`
* **Description:** Enables/disables the deal button, and manages controller card selection accordingly. |
* **Parameters:** `set` — boolean: `true` to enable, `false` to disable. |
* **Returns:** `nil`

### `BalatroWidget:choose()`
* **Description:** Confirms selected joker: sets `self.joker`, sends `CHOOSE_JOKER` popup to server, and calls `StartPlayGame()`. |
* **Parameters:** None |
* **Returns:** `nil`

### `BalatroWidget:ScoreWarly()`
* **Description:** Applies Warly joker effect: +1 mult per unique suit in hand (max 4). Triggers animation/loop sound if all 4 suits present. |
* **Parameters:** None |
* **Returns:** `nil`

### `BalatroWidget:ScoreWilson()`
* **Description:** Applies Wilson joker effect: +1 mult (up to 3x per value-matched pair) per matching-value pair in hand. Triggers animation/loop sound if at least one pair exists. |
* **Parameters:** None |
* **Returns:** `nil`

### `BalatroWidget:ScoreWanda_start()`
* **Description:** Applies Wanda deal effect: +80 chips over ~24 seconds. |
* **Parameters:** None |
* **Returns:** `nil`

### `BalatroWidget:ScoreWanda_discard(card)`
* **Description:** Applies Wanda discard effect on `card`: -15 chips over ~9 seconds. |
* **Parameters:** `card` — discarded card slot index (1–5). |
* **Returns:** `nil`

### `BalatroWidget:ScoreWigfrid(card)`
* **Description:** Applies Wigfrid effect on `card`: +25 chips over ~7.5 seconds if suit is `SPADES`. |
* **Parameters:** `card` — discarded card slot index (1–5). |
* **Returns:** `nil`
* **Error states:** Only triggers for SPADES suit.

### `BalatroWidget:ScoreWickerbottom(card)`
* **Description:** Applies Wickerbottom effect on `card`: +1 mult if rank is Queen (12). |
* **Parameters:** `card` — discarded card slot index (1–5). |
* **Returns:** `nil`
* **Error states:** Only triggers for rank 12.

### `BalatroWidget:ScoreWolfgang(card)`
* **Description:** Applies Wolfgang effect on `card`: +25 chips over ~7.5 seconds if rank is King (13). |
* **Parameters:** `card` — discarded card slot index (1–5). |
* **Returns:** `nil`
* **Error states:** Only triggers for rank 13.

### `BalatroWidget:ScoreWx78(card)`
* **Description:** Applies Wx78 effect on `card`: +2 mult after ~15 frames and triggers mult sound if suit is `HEARTS`. |
* **Parameters:** `card` — discarded card slot index (1–5). |
* **Returns:** `nil`
* **Error states:** Only triggers for HEARTS suit.

### `BalatroWidget:ScoreWormwood(card)`
* **Description:** Applies Wormwood effect on `card`: +15 chips over ~9 seconds if suit is `CLUBS` and card not discarded. |
* **Parameters:** `card` — discarded card slot index (1–5). |
* **Returns:** `nil`
* **Error states:** Only triggers for CLUBS suit and `not self.discard[card]`.

### `BalatroWidget:ScoreWinona(card)`
* **Description:** Applies Winona effect on `card`: +1 mult after ~15 frames if suit is `HEARTS` and card not discarded. |
* **Parameters:** `card` — discarded card slot index (1–5). |
* **Returns:** `nil`
* **Error states:** Only triggers for HEARTS suit and `not self.discard[card]`.

### `BalatroWidget:ScoreWendy(card, oldcard)`
* **Description:** Applies Wendy effect: +5 chips and +2 mult over ~7.5 seconds if discarded card suit matches `oldcard`’s suit. |
* **Parameters:**  
  - `card` — discarded card slot index (1–5)  
  - `oldcard` — original card ID (encoded suit*100 + rank)  
* **Returns:** `nil`
* **Error states:** Only triggers if suits match.

### `BalatroWidget:ScoreWebber(card, oldcard)`
* **Description:** Applies Webber effect: +2 mult if old card suit was red (`HEARTS`/`DIAMONDS`) and new suit is black (`SPADES`/`CLUBS`). |
* **Parameters:**  
  - `card` — discarded card slot index (1–5)  
  - `oldcard` — original card ID  
* **Returns:** `nil`
* **Error states:** Only triggers for red→black suit change.

### `BalatroWidget:ScoreWoodie(card)`
* **Description:** Applies Woodie effect: +7 chips over ~4.5 seconds for discarded card. |
* **Parameters:** `card` — discarded card slot index (1–5). |
* **Returns:** `nil`

### `BalatroWidget:ScoreWortox_deal(card)`
* **Description:** Applies Wortox deal effect: +15 chips over ~9 seconds if discarded card suit is `HEARTS`. |
* **Parameters:** `card` — discarded card slot index (1–5). |
* **Returns:** `nil`
* **Error states:** Only triggers for HEARTS suit.

### `BalatroWidget:ScoreWortox_hand(card)`
* **Description:** Applies Wortox hand effect: -11 chips, +1 mult after ~15 frames if discarded card suit is `HEARTS`. |
* **Parameters:** `card` — discarded card slot index (1–5). |
* **Returns:** `nil`
* **Error states:** Only triggers for HEARTS suit.

### `BalatroWidget:ScoreWillow(card)`
* **Description:** Applies Willow effect: +20 chips over ~12 seconds if discarded card rank > 10. |
* **Parameters:** `card` — discarded card slot index (1–5). |
* **Returns:** `nil`
* **Error states:** Only triggers for rank > 10.

### `BalatroWidget:ScoreMaxwell(card)`
* **Description:** Applies Maxwell effect: +1 mult after ~15 frames if discarded card suit is `HEARTS`. |
* **Parameters:** `card` — discarded card slot index (1–5). |
* **Returns:** `nil`
* **Error states:** Only triggers for HEARTS suit.

### `BalatroWidget:ScoreWes()`
* **Description:** Applies Wes effect: +30 chips over ~18 seconds if any cards are discarded. |
* **Parameters:** None |
* **Returns:** `nil`
* **Error states:** Runs unconditionally if discarding cards; affects all 5 card slots.

### `BalatroWidget:ScoreWurt(card)`
* **Description:** Applies Wurt effect: +1 chip per face card (rank > 10) in hand × 10. Counts face cards, plays flip/chip sounds, animates joker card, and adds chips over time. |
* **Parameters:** `card` — discarded card slot index (1–5). |
* **Returns:** `nil`

### `BalatroWidget:ScoreWalter()`
* **Description:** Applies Walter effect: +15 chips per discarded suit. Counts discarded suits and triggers animations/sounds for each discarded card. |
* **Parameters:** None |
* **Returns:** `nil`
* **Error states:** Requires `self.joker == "walter"` to be true.

### `BalatroWidget:Deal()`
* **Description:** Sends discard request to server if in multiplayer. Encodes discard state, sets `waitingtime`, fires `DISCARD_CARDS` popup, and if no cards discarded (`byte == 0`), calls `ReceiveDeal()` immediately. |
* **Parameters:** None |
* **Returns:** `nil`
* **Error states:** Relies on `BALATRO_UTIL.EncodeDiscardData` and external constants (`DISCARD_REQUEST_TIMEOUT`).

### `BalatroWidget:ReceiveDeal()`
* **Description:** Handles post-discard logic: validates/updates cards, triggers all joker scoring (`ScoreXxx`), animates draw/flip sequences, recalculates hand score/mult, and handles round progression (including game-end on round 3). |
* **Parameters:** None |
* **Returns:** `nil`
* **Error states:**  
  - Requires `self.newslots` to be non-nil (populated from `Deal()` or server response).  
  - Clears `self.newslots` at completion.  
  - Delegates to multiple helpers: `Calchand()`, `AddChips()`, `AddMult()`, `UpdateCardArt()`, `JimboTalk()`, `SetLightMode_Blink()`.

### `BalatroWidget:UpdateCardArt(slot)`
* **Description:** Updates visual representation of card `slot` (suit/number) using AnimState symbol overrides and color mult. |
* **Parameters:** `slot` — card index (1–5). |
* **Returns:** `nil`
* **Error states:** Assumes `self.slots[slot]` decodes to valid suit/rank; uses `colors[suit]` table.

### `BalatroWidget:JimboTalk(st)`
* **Description:** Animates Jimbo’s speech bubble and talking animation: appends text character-by-character and cycles `"talk1"/"talk2"/"talk3"/"idle"` animations. Attempts to play `"talking"` sound loop. |
* **Parameters:** `st` — string to display. |
* **Returns:** `nil`
* **Error states:** Relies on AnimState supporting talk/idle states and `talking` sound channel.

### `BalatroWidget:OnUpdate(dt)`
* **Description:** Main update loop: handles discard timeout, processes animation queue (`self.queue`), updates machine frame via `BALATRO_UTIL.UpdateLoop`. |
* **Parameters:** `dt` — delta time. |
* **Returns:** `nil`
* **Error states:** Requires `DISCARD_REQUEST_TIMEOUT` defined; queue elements must have `.fn`, `.time`, or `.id`.

### `BalatroWidget:Calchand()`
* **Description:** Computes poker hand rank from `self.slots`. Returns integer 1–10:  
  `1=High Card`, `2=Pair`, `3=Two Pair`, `4=Three of a Kind`, `5=Straight`, `6=Flush`, `7=Full House`, `8=Four of a Kind`, `9=Straight Flush`, `10=Royal Flush`. |
* **Parameters:** None |
* **Returns:** Integer hand rank. |
* **Error states:**  
  - Assumes `self.slots[1..5]` contain valid encoded values.  
  - Uses `HIGH_STRAIGHT` constant (not defined in snippets but required).

### `BalatroWidget:OnControl(control, down)`
* **Description:** Handles controller input: `BACK/CANCEL` → close, `MISC_2` → toggle notes, `MISC_1` → deal/skip, `ACCEPT` → toggle discard, directional buttons → card/joker selection. |
* **Parameters:**  
  - `control` — control constant (e.g., `CONTROL_ACCEPT`)  
  - `down` — boolean: `true` on press, `false` on release  
* **Returns:** `true` if handled, else `false`
* **Error states:** Depends on `self.mode`, `self.root` elements, and controller utilities.

### `BalatroWidget:GetHelpText()`
* **Description:** Builds localized control hints string based on current mode (`"joker"`/`"deal"`) and UI state (e.g., enabled deal button, discard selection). |
* **Parameters:** None |
* **Returns:** Space-separated localized hint string (e.g., `"Press [ACCEPT] to toggle discard"`). |
* **Error states:** Requires `STRINGS.BALATRO.*`, `STRINGS.NAMES.*`, and `subfmt`.

### `BalatroWidget:KillSounds()`
* **Description:** Stops all looping and talking sounds (`LP`, `mult`, `talking`). |
* **Parameters:** None |
* **Returns:** `nil`
* **Error states:** Requires `TheFrontEnd:GetSound()` to be valid.

## Events & listeners
- **Listens to:** `client_popupmessage`  
  - Handled by `self.OnPopupMessage`  
  - Triggers `ReceiveDeal()` when receiving `POPUPS.BALATRO` with `args.popup == "NEW_CARDS"`  
- **Pushes:** None in either chunk (server communication is indirect via `POPUPS.BALATRO:SendMessageToServer`).