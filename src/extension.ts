import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    const serialVersionUIDProvider: vscode.CompletionItemProvider<vscode.CompletionItem> = {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
            const text = document.getText();
            const className = extractClassName(text);

            if (!className) {
                return [];
            }

            const serialVersionUID = generateSerialVersionUID(className);
            const snippetCompletion = new vscode.CompletionItem("serialVersionUID", vscode.CompletionItemKind.Snippet);
            snippetCompletion.insertText = new vscode.SnippetString(`private static final long serialVersionUID = ${serialVersionUID}L;`);
            snippetCompletion.documentation = new vscode.MarkdownString(`serialVersionUID with long type random number based on class name ${className}`);

            return [snippetCompletion];
        }
    };

    const providerSerialVersionUID = vscode.languages.registerCompletionItemProvider(
        ["java"],
        serialVersionUIDProvider
    );

    context.subscriptions.push(providerSerialVersionUID);
}

export function deactivate() {}

function extractClassName(text: string): string | null {
    const classNameRegex = /class\s+(\w+)/;
    const match = classNameRegex.exec(text);
    return match ? match[1] : null;
}

function generateSerialVersionUID(className: string): string {
    //generate number from class name
    const seed = className.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = Math.abs(Math.sin(seed) * 1000000000);
    return Math.floor(random).toString();
}
