# Folder Structure Tree Plugin

This plugin for Obsidian generates a folder structure tree based on a provided JSON file. It parses the JSON file and creates folders and files within the Obsidian vault according to the specified structure.

## Features

- Parse a JSON file to define a hierarchical folder and file structure.
- Automatically create folders and files in the current vault.
- Supports nested subfolders and files at multiple levels.

## JSON Format

The plugin uses a specific JSON format to define the folder structure. Below is an example:

```json
{
  "Folder 1": {
    "Subfolder 1": ["file1.md", "file2.md"],
    "Subfolder 2": ["file3.md", "file4.md"]
  },
  "Folder 2": {
    "Subfolder 3": {
      "Subsubfolder 1": ["file5.md", "file6.md"],
      "Subsubfolder 2": ["file7.md", "file8.md"]
    }
  }
}
```

### Rules for the JSON Format:

- Each key represents a folder.
- Values can be:
  - An array of strings, representing file names inside the folder.
  - Another nested object, representing subfolders.

## First Time Developing Plugins?

Quick starting guide for new plugin devs:

1. Check for existing plugins to avoid duplication.
2. Use this repository template to create your plugin.
3. Follow the setup steps for development, testing, and deployment.

## How to Use

1. Clone the repository.
2. Ensure your NodeJS version is at least 16 (`node --version`).
3. Install dependencies with `npm i` or `yarn`.
4. Start the development server with `npm run dev`.

## Plugin Usage

### Enable the Plugin

1. Install the plugin by copying `main.js`, `styles.css`, and `manifest.json` to `VaultFolder/.obsidian/plugins/folder-structure-tree/`.
2. Reload Obsidian and enable the plugin in the settings.

### Provide JSON Input

1. Place the JSON file describing the folder structure in your vault.
2. Use the ribbon icon or command palette to trigger the plugin.

### Generate the Folder Structure

1. Click the ribbon icon or use the command palette to load the JSON file.
2. The plugin will create folders and files according to the JSON hierarchy.

## Plugin API Features

- **Ribbon Icon**: Adds an icon to the ribbon for quick access to the folder generation feature.
- **Command Palette Command**: "Generate Folder Tree from JSON" allows you to trigger folder generation.
- **Plugin Settings**: Configure the default path for the JSON file and additional options.
- **Event Logging**: Logs actions such as folder and file creation in the console for debugging purposes.

## Releasing New Versions

1. Update the `manifest.json` file with the new version.
2. Add an entry to `versions.json` for compatibility with older Obsidian versions.
3. Publish the release on GitHub with all required files attached (`manifest.json`, `main.js`, `styles.css`).

## Improve Code Quality with ESLint (Optional)

1. Install ESLint: `npm install -g eslint`
2. Analyze the code: `eslint main.ts`
3. Address any issues highlighted in the report.

## Funding URL

Support the development of this plugin by using the following funding links:

```json
{
  "fundingUrl": {
    "Buy Me a Coffee": "https://buymeacoffee.com",
    "GitHub Sponsor": "https://github.com/sponsors",
    "Patreon": "https://www.patreon.com/"
  }
}
```

## Example JSON Input and Output

### Input JSON:

```json
{
  "Projects": {
    "Obsidian Plugin": ["readme.md", "changelog.md"],
    "Templates": {
      "Meeting Notes": ["template.md"],
      "Project Plan": ["plan.md"]
    }
  },
  "Notes": ["personal.md", "work.md"]
}
```

### Result in Vault:

```plaintext
Vault/
├── Projects/
│   ├── Obsidian Plugin/
│   │   ├── readme.md
│   │   └── changelog.md
│   ├── Templates/
│   │   ├── Meeting Notes/
│   │   │   └── template.md
│   │   └── Project Plan/
│   │       └── plan.md
├── Notes/
│   ├── personal.md
│   └── work.md
```
