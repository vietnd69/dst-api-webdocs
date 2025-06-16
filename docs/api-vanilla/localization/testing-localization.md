---
id: testing-localization
title: Testing Localized Content
sidebar_position: 6
last_updated: 2023-07-06
version: 619045
---
*Last Update: 2023-07-06*
# Testing Localized Content

This guide covers comprehensive approaches for testing localized content in your Don't Starve Together mods to ensure high quality across all supported languages.

## Why Testing Localization Matters

Thorough localization testing helps you:

- **Catch missing translations** before players do
- **Identify visual issues** like text overflow or improper line breaks
- **Ensure functionality** works correctly across languages
- **Verify cultural appropriateness** of content
- **Maintain consistent quality** across all supported languages

## Testing Preparation

### Create a Testing Plan

Before testing, develop a structured plan:

1. **Identify test scenarios** covering all localized content
2. **Create a test matrix** for each supported language
3. **Set up testing environments** for each language
4. **Prepare test data** including edge cases
5. **Define acceptance criteria** for passing tests

### Set Up Testing Environments

Configure your testing environment to easily switch between languages:

```lua
-- In modmain.lua for testing
local function SetupTestingEnvironment()
    -- List of languages to test
    local test_languages = {"en", "zh", "ru", "es", "pt", "de", "fr"}
    
    -- Create a global function to switch languages for testing
    GLOBAL.SwitchLanguageForTesting = function(language_code)
        if table.contains(test_languages, language_code) then
            print("Switching to test language: " .. language_code)
            
            -- Override the default language
            GLOBAL.LanguageTranslator.defaultlanguage = language_code
            
            -- Load the appropriate language file
            local language_file = "scripts/languages/strings_" .. language_code .. ".lua"
            if GLOBAL.kleifileexists(language_file) then
                modimport(language_file)
                return true
            else
                print("Warning: Language file not found for " .. language_code)
                return false
            end
        else
            print("Error: Unsupported test language: " .. language_code)
            return false
        end
    end
    
    -- Add a console command for easy language switching
    GLOBAL.TheInput:AddKeyDownHandler(GLOBAL.KEY_F7, function()
        -- Cycle through test languages
        local current_idx = table.indexof(test_languages, GLOBAL.LanguageTranslator.defaultlanguage) or 0
        local next_idx = (current_idx % #test_languages) + 1
        GLOBAL.SwitchLanguageForTesting(test_languages[next_idx])
        
        -- Refresh UI if needed
        if GLOBAL.TheFrontEnd and GLOBAL.TheFrontEnd:GetActiveScreen() then
            GLOBAL.TheFrontEnd:GetActiveScreen():RefreshLanguage()
        end
    end)
end

-- Only enable in development
if GLOBAL.DEVELOPMENT_BUILD then
    SetupTestingEnvironment()
end
```

## Automated Testing

### String Validation

Create scripts to automatically validate translations:

```lua
-- Check for missing translations
local function ValidateMissingTranslations()
    local results = {}
    
    -- Base language (English)
    local base_strings = STRINGS.MY_MOD
    
    -- Check each supported language
    local supported_languages = {"zh", "ru", "es", "pt", "de", "fr"}
    
    for _, lang in ipairs(supported_languages) do
        -- Load language strings
        local language_file = "scripts/languages/strings_" .. lang .. ".lua"
        local success = pcall(modimport, language_file)
        
        if success then
            -- Compare with base language
            local missing = {}
            local function CheckStrings(base, translated, path)
                path = path or ""
                for key, value in pairs(base) do
                    local current_path = path .. (path ~= "" and "." or "") .. key
                    
                    if type(value) == "table" then
                        -- Recursive check for nested tables
                        if translated[key] == nil then
                            table.insert(missing, current_path)
                        else
                            CheckStrings(value, translated[key], current_path)
                        end
                    else
                        -- Check string value
                        if translated[key] == nil then
                            table.insert(missing, current_path)
                        elseif translated[key] == value then
                            -- Untranslated string (same as English)
                            table.insert(missing, current_path .. " (untranslated)")
                        end
                    end
                end
            end
            
            -- Store original strings
            local original_strings = STRINGS.MY_MOD
            
            -- Check strings
            CheckStrings(base_strings, STRINGS.MY_MOD)
            
            -- Restore original strings
            STRINGS.MY_MOD = original_strings
            
            -- Store results
            results[lang] = missing
        else
            print("Failed to load language file: " .. language_file)
        end
    end
    
    -- Print results
    for lang, missing in pairs(results) do
        print("=== Missing translations for " .. lang .. " ===")
        if #missing == 0 then
            print("No missing translations!")
        else
            for _, path in ipairs(missing) do
                print("  - " .. path)
            end
        end
        print("")
    end
end
```

### Placeholder Validation

Check that all placeholders are properly handled:

```lua
-- Validate placeholder usage
local function ValidatePlaceholders()
    local issues = {}
    
    -- Find strings with placeholders
    local function FindPlaceholders(strings, path)
        path = path or ""
        for key, value in pairs(strings) do
            local current_path = path .. (path ~= "" and "." or "") .. key
            
            if type(value) == "string" then
                -- Check for placeholders like {name}
                local placeholders = {}
                for placeholder in value:gmatch("{([^}]+)}") do
                    table.insert(placeholders, placeholder)
                end
                
                if #placeholders > 0 then
                    -- Store string with placeholders
                    table.insert(issues, {
                        path = current_path,
                        string = value,
                        placeholders = placeholders
                    })
                end
            elseif type(value) == "table" then
                -- Recursive check
                FindPlaceholders(value, current_path)
            end
        end
    end
    
    -- Check base language
    FindPlaceholders(STRINGS.MY_MOD)
    
    -- Print results
    print("=== Strings with placeholders ===")
    for _, issue in ipairs(issues) do
        print(issue.path .. ": \"" .. issue.string .. "\"")
        print("  Placeholders: " .. table.concat(issue.placeholders, ", "))
    end
    
    -- Now check each language for missing placeholders
    local supported_languages = {"zh", "ru", "es", "pt", "de", "fr"}
    
    for _, lang in ipairs(supported_languages) do
        -- Load language strings
        local language_file = "scripts/languages/strings_" .. lang .. ".lua"
        local success = pcall(modimport, language_file)
        
        if success then
            local lang_issues = {}
            
            -- Check each string with placeholders
            for _, issue in ipairs(issues) do
                -- Navigate to the translated string
                local path_parts = {}
                for part in issue.path:gmatch("[^.]+") do
                    table.insert(path_parts, part)
                end
                
                local translated_string = STRINGS.MY_MOD
                local found = true
                
                for _, part in ipairs(path_parts) do
                    if translated_string[part] ~= nil then
                        translated_string = translated_string[part]
                    else
                        found = false
                        break
                    end
                end
                
                if found and type(translated_string) == "string" then
                    -- Check for each placeholder
                    for _, placeholder in ipairs(issue.placeholders) do
                        if not translated_string:find("{" .. placeholder .. "}") then
                            table.insert(lang_issues, {
                                path = issue.path,
                                missing = placeholder,
                                string = translated_string
                            })
                        end
                    end
                end
            end
            
            -- Print results for this language
            if #lang_issues > 0 then
                print("\n=== Placeholder issues in " .. lang .. " ===")
                for _, issue in ipairs(lang_issues) do
                    print(issue.path .. ": Missing placeholder {" .. issue.missing .. "}")
                    print("  String: \"" .. issue.string .. "\"")
                end
            end
        end
    end
end
```

### Length Validation

Check for text that might be too long for UI elements:

```lua
-- Validate string lengths
local function ValidateStringLengths()
    -- Define maximum lengths for different UI elements
    local max_lengths = {
        BUTTON = 15,
        TITLE = 30,
        TOOLTIP = 100,
        DESCRIPTION = 200
    }
    
    local issues = {}
    
    -- Check string lengths
    local function CheckLengths(strings, path, category)
        path = path or ""
        for key, value in pairs(strings) do
            local current_path = path .. (path ~= "" and "." or "") .. key
            local current_category = category
            
            -- Try to determine category from path
            if not current_category then
                if current_path:find("BUTTON") then
                    current_category = "BUTTON"
                elseif current_path:find("TITLE") then
                    current_category = "TITLE"
                elseif current_path:find("TOOLTIP") then
                    current_category = "TOOLTIP"
                elseif current_path:find("DESCRIPTION") then
                    current_category = "DESCRIPTION"
                end
            end
            
            if type(value) == "string" and current_category and max_lengths[current_category] then
                -- Check length
                if value:len() > max_lengths[current_category] then
                    table.insert(issues, {
                        path = current_path,
                        category = current_category,
                        length = value:len(),
                        max_length = max_lengths[current_category],
                        string = value
                    })
                end
            elseif type(value) == "table" then
                -- Recursive check
                local next_category = current_category
                if key == "BUTTONS" then
                    next_category = "BUTTON"
                elseif key == "TITLES" then
                    next_category = "TITLE"
                elseif key == "TOOLTIPS" then
                    next_category = "TOOLTIP"
                elseif key == "DESCRIPTIONS" or key == "DESCRIPTION" then
                    next_category = "DESCRIPTION"
                end
                
                CheckLengths(value, current_path, next_category)
            end
        end
    end
    
    -- Check each language
    local supported_languages = {"en", "zh", "ru", "es", "pt", "de", "fr"}
    
    for _, lang in ipairs(supported_languages) do
        -- Load language strings
        local original_strings = STRINGS.MY_MOD
        
        if lang ~= "en" then
            local language_file = "scripts/languages/strings_" .. lang .. ".lua"
            local success = pcall(modimport, language_file)
            if not success then
                print("Failed to load language file: " .. language_file)
                goto continue
            end
        end
        
        -- Check lengths
        local lang_issues = {}
        CheckLengths(STRINGS.MY_MOD)
        
        -- Print results
        if #issues > 0 then
            print("\n=== String length issues in " .. lang .. " ===")
            for _, issue in ipairs(issues) do
                print(issue.path .. " (" .. issue.length .. "/" .. issue.max_length .. ")")
                print("  \"" .. issue.string .. "\"")
            end
        end
        
        -- Restore original strings
        STRINGS.MY_MOD = original_strings
        
        ::continue::
    end
end
```

## Manual Testing

### Visual Inspection

Conduct visual inspections of all UI elements:

1. **Screenshot Comparison**:
   - Take screenshots of UI in each language
   - Compare side by side for visual issues

2. **UI Element Checklist**:
   - Buttons and labels
   - Tooltips and descriptions
   - Menus and dialogs
   - Error messages
   - Status indicators

3. **Dynamic Text**:
   - Test with variable content (long names, numbers)
   - Check text wrapping and truncation
   - Verify animations and transitions

### Functional Testing

Test all functionality that involves localized content:

1. **Gameplay Features**:
   - Character dialogue
   - Item descriptions
   - Quest text
   - Tutorial instructions

2. **User Interactions**:
   - Input prompts
   - Feedback messages
   - Error handling
   - Help text

3. **Edge Cases**:
   - Very long text
   - Special characters
   - Right-to-left text (if supported)
   - Mixed language content

## In-Game Testing Tools

Create in-game tools to help with localization testing:

```lua
-- Add a debug screen for localization testing
local function CreateLocalizationTestScreen()
    local LocTestScreen = Class(Screen, function(self)
        Screen._ctor(self, "LocTestScreen")
        
        -- Background
        self.bg = self:AddChild(Image("images/ui.xml", "bg_plain.tex"))
        self.bg:SetSize(GLOBAL.RESOLUTION_X, GLOBAL.RESOLUTION_Y)
        self.bg:SetTint(0, 0, 0, 0.7)
        
        -- Title
        self.title = self:AddChild(Text(GLOBAL.TITLEFONT, 40))
        self.title:SetPosition(0, GLOBAL.RESOLUTION_Y/2 - 50)
        self.title:SetString("Localization Test Screen")
        
        -- Current language
        self.lang_text = self:AddChild(Text(GLOBAL.DIALOGFONT, 30))
        self.lang_text:SetPosition(0, GLOBAL.RESOLUTION_Y/2 - 100)
        self.lang_text:SetString("Current Language: " .. GLOBAL.LanguageTranslator.defaultlanguage)
        
        -- Test categories
        self:CreateTestCategories()
        
        -- Close button
        self.close_button = self:AddChild(TextButton())
        self.close_button:SetPosition(0, -GLOBAL.RESOLUTION_Y/2 + 50)
        self.close_button:SetText("Close")
        self.close_button:SetOnClick(function() self:Close() end)
        
        -- Language switcher
        self.lang_button = self:AddChild(TextButton())
        self.lang_button:SetPosition(200, -GLOBAL.RESOLUTION_Y/2 + 50)
        self.lang_button:SetText("Switch Language")
        self.lang_button:SetOnClick(function() self:SwitchLanguage() end)
    end)
    
    function LocTestScreen:CreateTestCategories()
        local categories = {
            {name = "UI Elements", strings = STRINGS.MY_MOD.UI},
            {name = "Items", strings = STRINGS.MY_MOD.ITEMS},
            {name = "Characters", strings = STRINGS.MY_MOD.CHARACTERS},
            -- Add more categories as needed
        }
        
        self.category_widgets = {}
        local y_pos = GLOBAL.RESOLUTION_Y/2 - 150
        local spacing = 40
        
        for i, category in ipairs(categories) do
            local widget = self:AddChild(Widget("CategoryWidget"))
            widget:SetPosition(0, y_pos - (i-1) * spacing * 3)
            
            -- Category title
            local title = widget:AddChild(Text(GLOBAL.DIALOGFONT, 30))
            title:SetPosition(0, spacing)
            title:SetString(category.name)
            
            -- Sample strings
            local sample_count = 0
            local function AddSampleString(key, value, depth)
                depth = depth or 0
                if type(value) == "string" then
                    local sample = widget:AddChild(Text(GLOBAL.DIALOGFONT, 20))
                    sample:SetPosition(50 * depth, spacing - (sample_count + 1) * spacing)
                    sample:SetString(key .. ": " .. value)
                    sample_count = sample_count + 1
                    
                    -- Limit samples per category
                    if sample_count >= 5 then
                        return false
                    end
                    return true
                elseif type(value) == "table" then
                    for k, v in pairs(value) do
                        if not AddSampleString(k, v, depth + 1) then
                            return false
                        end
                    end
                end
                return true
            end
            
            -- Add sample strings from this category
            for k, v in pairs(category.strings) do
                if not AddSampleString(k, v) then
                    break
                end
            end
            
            table.insert(self.category_widgets, widget)
        end
    end
    
    function LocTestScreen:RefreshLanguage()
        -- Update language display
        self.lang_text:SetString("Current Language: " .. GLOBAL.LanguageTranslator.defaultlanguage)
        
        -- Remove old category widgets
        for _, widget in ipairs(self.category_widgets) do
            widget:Kill()
        end
        
        -- Recreate with new language
        self:CreateTestCategories()
    end
    
    function LocTestScreen:SwitchLanguage()
        local supported_languages = {"en", "zh", "ru", "es", "pt", "de", "fr"}
        local current_idx = table.indexof(supported_languages, GLOBAL.LanguageTranslator.defaultlanguage) or 0
        local next_idx = (current_idx % #supported_languages) + 1
        
        if GLOBAL.SwitchLanguageForTesting then
            GLOBAL.SwitchLanguageForTesting(supported_languages[next_idx])
            self:RefreshLanguage()
        end
    end
    
    function LocTestScreen:Close()
        GLOBAL.TheFrontEnd:PopScreen()
    end
    
    return LocTestScreen
end

-- Add a console command to open the test screen
GLOBAL.TheInput:AddKeyDownHandler(GLOBAL.KEY_F8, function()
    if GLOBAL.DEVELOPMENT_BUILD and GLOBAL.TheFrontEnd then
        local LocTestScreen = CreateLocalizationTestScreen()
        GLOBAL.TheFrontEnd:PushScreen(LocTestScreen())
    end
end)
```

## Pseudo-Localization Testing

Pseudo-localization helps identify issues before real translations:

```lua
-- Create a pseudo-localization function
local function PseudoLocalize(text)
    if type(text) ~= "string" then
        return text
    end
    
    -- Map for pseudo-localization
    local char_map = {
        a = "ä", b = "ḅ", c = "ç", d = "ḍ", e = "ë", f = "ḟ",
        g = "ġ", h = "ḥ", i = "ï", j = "ĵ", k = "ḳ", l = "ḷ",
        m = "ṃ", n = "ñ", o = "ö", p = "ṗ", q = "q̇", r = "ṛ",
        s = "ṡ", t = "ṭ", u = "ü", v = "ṿ", w = "ẇ", x = "ẋ",
        y = "ÿ", z = "ż", A = "Ä", B = "Ḅ", C = "Ç", D = "Ḍ",
        E = "Ë", F = "Ḟ", G = "Ġ", H = "Ḥ", I = "Ï", J = "Ĵ",
        K = "Ḳ", L = "Ḷ", M = "Ṃ", N = "Ñ", O = "Ö", P = "Ṗ",
        Q = "Q̇", R = "Ṛ", S = "Ṡ", T = "Ṭ", U = "Ü", V = "Ṿ",
        W = "Ẇ", X = "Ẋ", Y = "Ÿ", Z = "Ż"
    }
    
    -- Replace characters and expand length by ~30%
    local result = ""
    for i = 1, string.len(text) do
        local char = string.sub(text, i, i)
        result = result .. (char_map[char] or char)
    end
    
    -- Expand by ~30% to simulate longer translations
    return "[" .. result .. "...]"
end

-- Apply pseudo-localization to all strings
local function PseudoLocalizeStrings(strings)
    for key, value in pairs(strings) do
        if type(value) == "string" then
            strings[key] = PseudoLocalize(value)
        elseif type(value) == "table" then
            PseudoLocalizeStrings(value)
        end
    end
end

-- Create a pseudo-localized version for testing
local function CreatePseudoLocalization()
    -- Make a deep copy of English strings
    local function DeepCopy(orig)
        local copy
        if type(orig) == "table" then
            copy = {}
            for orig_key, orig_value in pairs(orig) do
                copy[orig_key] = DeepCopy(orig_value)
            end
        else
            copy = orig
        end
        return copy
    end
    
    local pseudo_strings = DeepCopy(STRINGS.MY_MOD)
    
    -- Apply pseudo-localization
    PseudoLocalizeStrings(pseudo_strings)
    
    -- Save to a file for testing
    local file = io.open("scripts/languages/strings_pseudo.lua", "w")
    if file then
        file:write("-- Pseudo-localized strings for testing\n\n")
        file:write("STRINGS = GLOBAL.STRINGS\n\n")
        
        -- Write strings table
        local function WriteTable(tbl, name, indent)
            indent = indent or ""
            file:write(indent .. name .. " = {\n")
            
            for k, v in pairs(tbl) do
                if type(v) == "table" then
                    WriteTable(v, k, indent .. "    ")
                else
                    file:write(indent .. "    " .. k .. " = \"" .. tostring(v):gsub("\"", "\\\"") .. "\",\n")
                end
            end
            
            file:write(indent .. "},\n")
        end
        
        WriteTable(pseudo_strings, "STRINGS.MY_MOD")
        file:close()
        
        print("Pseudo-localization file created: scripts/languages/strings_pseudo.lua")
    else
        print("Failed to create pseudo-localization file")
    end
end

-- Add a console command to create pseudo-localization
if GLOBAL.DEVELOPMENT_BUILD then
    GLOBAL.TheInput:AddKeyDownHandler(GLOBAL.KEY_F9, function()
        CreatePseudoLocalization()
    end)
end
```

## Regression Testing

Implement regression testing for localization:

1. **Automated Screenshot Comparison**:
   - Take screenshots of key UI elements in each language
   - Compare with baseline images to detect changes

2. **String Validation After Updates**:
   - Run validation scripts after each content update
   - Ensure new content is properly localized

3. **Version Control Integration**:
   - Add localization tests to your CI/CD pipeline
   - Block merges that break localization

## Community Testing

Leverage the community for additional testing:

1. **Beta Testing Program**:
   - Invite native speakers to test your mod
   - Provide clear reporting guidelines

2. **Feedback Channels**:
   - Create a dedicated channel for translation issues
   - Make it easy to report problems

3. **Continuous Improvement**:
   - Regularly update translations based on feedback
   - Credit community contributors

## Localization Testing Checklist

Use this checklist for comprehensive testing:

- [ ] **Completeness**: All strings are translated in all supported languages
- [ ] **Accuracy**: Translations correctly convey the original meaning
- [ ] **Formatting**: Placeholders, line breaks, and special characters work correctly
- [ ] **Visual**: No text overflow, improper wrapping, or truncation
- [ ] **Functionality**: All features work correctly in all languages
- [ ] **Performance**: No significant performance impact from localization
- [ ] **Cultural**: Content is culturally appropriate in all languages
- [ ] **Consistency**: Terminology is consistent throughout the mod
- [ ] **Accessibility**: Text is readable and appropriately sized
- [ ] **Documentation**: All documentation is updated for all languages

## Conclusion

Thorough localization testing is essential for creating a high-quality multilingual mod. By implementing automated tests, conducting manual inspections, and leveraging community feedback, you can ensure your mod provides an excellent experience for players worldwide.

Remember that localization is an ongoing process. As you update your mod with new content, continue to apply these testing practices to maintain quality across all supported languages. 
