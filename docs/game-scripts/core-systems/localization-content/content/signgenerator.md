---
id: signgenerator
title: Sign Generator
description: Utility module for generating random sign descriptions based on ground type and predefined string patterns
sidebar_position: 4
slug: game-scripts/core-systems/signgenerator
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Sign Generator

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The **Sign Generator** is a utility module that generates random descriptive text for signs based on the player's current ground type and predefined string patterns. It creates contextually appropriate descriptions by combining quantifiers, adjectives, nouns, and additions from the `STRINGS.SIGNS` data structure.

## Usage Example

```lua
local signgenerator = require("signgenerator")

-- Generate random description for a sign
local description = signgenerator(inst, doer)
-- Returns something like: "Very Dangerous Swamp of Perilousness"
```

## Functions

### GenerateRandomDescription(inst, doer) {#generate-random-description}

**Status:** `stable`

**Description:**
Generates a random descriptive text string for signs based on the doer's current ground tile type. The function combines various text elements with configurable probability to create varied and contextually appropriate descriptions.

**Parameters:**
- `inst` (entity): The sign entity instance (currently unused in function logic)
- `doer` (entity): The player entity used to determine current ground tile type

**Returns:**
- (string): A randomly generated description formatted according to available components

**Algorithm:**
1. **Quantifier Selection** (40% chance): Randomly selects from `STRINGS.SIGNS.QUANTIFIERS`
2. **Adjective Selection** (100% chance): Always selects from `STRINGS.SIGNS.ADJECTIVES`
3. **Noun Selection** (100% chance): Selects from ground-type-specific nouns or defaults
4. **Addition Selection** (20% chance): Randomly selects from `STRINGS.SIGNS.ADDITIONS`
5. **Format Assembly**: Combines elements using appropriate format string

**Example:**
```lua
-- Player standing on marsh ground (tile type 8)
local description = GenerateRandomDescription(inst, player)
-- Possible outputs:
-- "Wet Marsh"
-- "Extremely Dangerous Swamp of Shadows"
-- "Lonely Bog infested with Monsters"
```

**Format Patterns:**
The function uses four different format strings based on component availability:
- `QUANT_ADJ_NOUN_ADD_FMT`: When both quantifier and addition are present
- `QUANT_ADJ_NOUN_FMT`: When only quantifier is present
- `ADJ_NOUN_ADD_FMT`: When only addition is present
- `ADJ_NOUN_FMT`: When neither quantifier nor addition are present

## Data Structures

### STRINGS.SIGNS Components

The module relies on predefined string collections in `STRINGS.SIGNS`:

#### Quantifiers (40% probability)
```lua
STRINGS.SIGNS.QUANTIFIERS = {
    "Really", "Very", "Quite", "Very Very", "Extremely",
    "Moderately", "Minimally", "Sort of", "Totally"
}
```

#### Adjectives (100% probability)
```lua
STRINGS.SIGNS.ADJECTIVES = {
    "Sunny", "Dark", "Dangerous", "Creepy", "Wet", "Huge",
    "Picturesque", "Boring", "Magnificent", "Awesome", ...
}
```

#### Ground-Type Specific Nouns
The module selects nouns based on the doer's current tile type:

| Ground Type | Example Nouns |
|-------------|---------------|
| Road (2) | "Road", "Path" |
| Rock (3) | "Crag", "Area", "Rocky Place" |
| Dirt (4) | "Patch", "Turf", "Tract" |
| Savanna (5) | "Savannah", "Grassland", "Prairie" |
| Grass (6) | "Field", "Pasture", "Garden" |
| Forest (7) | "Forest", "Woods", "Grove" |
| Marsh (8) | "Marsh", "Swamp", "Bog" |
| Cave Types (13-25) | "Cave" |
| Desert (31) | "Desert", "Badlands", "Flats" |

#### Default Nouns
Used when no ground-type-specific nouns are available:
```lua
STRINGS.SIGNS.DEFAULT_NOUNS = {
    "Spot", "Area", "Region", "Point", "Locality", "Site"
}
```

#### Additions (20% probability)
```lua
STRINGS.SIGNS.ADDITIONS = {
    "of Perilousness", "of Danger", "of Shadows",
    "infested with Monsters", "full of Bees", ...
}
```

### Format Strings
```lua
STRINGS.SIGNS.ADJ_NOUN_FMT = "{adjective} {noun}"
STRINGS.SIGNS.ADJ_NOUN_ADD_FMT = "{adjective} {noun} {addition}"
STRINGS.SIGNS.QUANT_ADJ_NOUN_FMT = "{quantifier} {adjective} {noun}"
STRINGS.SIGNS.QUANT_ADJ_NOUN_ADD_FMT = "{quantifier} {adjective} {noun} {addition}"
```

## Integration Points

### Ground Type Detection
The module uses `doer:GetCurrentTileType()` to determine the appropriate noun category. This integrates with:
- **Tile System**: Ground tile type constants
- **Player Entity**: Current position and tile detection

### String Formatting
Uses `subfmt()` function for string interpolation with named parameters.

### Usage Context
This module is typically used by:
- **Sign Entities**: When players choose random text generation
- **Menu Systems**: Random button functionality in sign writing interface

## Common Usage Patterns

### Manual Integration
```lua
local signgenerator = require("signgenerator")

-- In sign interaction code
local function OnRandomPressed(inst, doer, widget)
    local description = signgenerator(inst, doer)
    widget:SetText(description)
end
```

### Probability Customization
The module uses fixed probabilities:
- Quantifier: 40% chance (`math.random() < .4`)
- Addition: 20% chance (`math.random() < .2`)
- Adjective and Noun: 100% chance (always included)

## Related Modules

- [**Strings**](./strings.md): Contains all the text data used by the generator
- [**Writeables**](./writeables.md): Implements sign writing interface that uses this generator
- [**Constants**](./constants.md): Defines ground tile type values used for noun selection
