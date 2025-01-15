import { App, Editor, MarkdownView, Menu, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';	

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('plus', 'Add JSON', () => {
			
		});

		  ribbonIconEl.addEventListener('contextmenu', (event: MouseEvent) => {
			event.preventDefault(); // Prevent the default right-click behavior.
			const menu = new Menu();

			// Add a "Pick a JSON" button to the menu.
			menu.addItem((item) => {
				item.setTitle('Pick a JSON')
					.setIcon('document') // You can use an icon of your choice.
					.onClick(() => {
						// Handle the "Pick a JSON" action here.
						this.pickJsonFile();
					});
			});
		
			// Show the menu at the cursor position.
			menu.showAtMouseEvent(event);
		});

		this.pickJsonFile = async () => {
			return new Promise((resolve) => {
				// Create an invisible input element of type 'file'
				const input = document.createElement('input');
				input.type = 'file';
				input.accept = 'application/json'; // Restrict to JSON files only
		
				// Trigger the file picker dialog
				input.addEventListener('change', (event) => {
					const file = (event.target as HTMLInputElement).files?.[0] || null;
					this.generateFolderStructure(file);
					resolve(file);
				});
		
				input.click(); // Simulate a click to open the dialog
			});
		};
		
		
		// Define the `pickJsonFile` method.
		
		

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});

		this.addCommand({
			id: "generate-folder-structure",
			name: "Generate Folder Structure from JSON",
			checkCallback: (checking: boolean) => {
				if (checking) {
					// If the condition is met, show the command.
					return true;
				}
				// Call the logic for creating folder/file structure.
				// this.generateFolderStructure();
			},
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	private async generateFolderStructure(file: File | null) {
		const activeFolder = this.app.fileManager.getNewFileParent(this.app.workspace.getActiveFile()?.path || "");
	
		// Example JSON structure.
		const jsonStructure = file ? JSON.parse(await file.text()) : {};
	
		const createStructure = async (basePath: string, structure: any) => {
			for (const [key, value] of Object.entries(structure)) {
				if (Array.isArray(value)) {
					const newFolderPath = `${basePath}/${key}`;
					await this.app.vault.createFolder(newFolderPath);
					// Create files in the current folder.
					for (const fileName of value) {
						const filePath = `${newFolderPath}/${fileName}`;
						if (!filePath.endsWith(".md")) {
							throw new Error(`File ${fileName} does not have a proper ".md" extension.`);
						}
						// Ensure the file doesn't already exist.
						if (!await this.app.vault.adapter.exists(filePath)) {
							await this.app.vault.create(filePath, "");
						}
					}
				} else if (typeof value === "object") {
					// Create subfolder and recurse.
					const newFolderPath = `${basePath}/${key}`;
					// Ensure the folder doesn't already exist.
					if (!await this.app.vault.adapter.exists(newFolderPath)) {
						await this.app.vault.createFolder(newFolderPath);
					}
					// Recurse into the subfolder structure.
					await createStructure(newFolderPath, value);
				} else {
					throw new Error(`Invalid structure for key: ${key}`);
				}
			}
		};
	
		// Start creating the folder/file structure.
		await createStructure(activeFolder.path, jsonStructure);
	}
	
	

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}



public async pickJsonFile() : Promise<File | null> {
	return new Promise((resolve) => {
        // Create an invisible input element of type 'file'
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json'; // Restrict to JSON files only

        // Trigger the file picker dialog
        input.addEventListener('change', (event) => {
            const file = (event.target as HTMLInputElement).files?.[0] || null;
            resolve(file);
        });

        input.click(); // Simulate a click to open the dialog
    });

}

}



class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
