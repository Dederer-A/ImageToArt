import os
import re
import pyperclip

# Default mandatory files and directories (from the Core Documents section of your index)
CORE_FILES = [
    "AGENTS.md",
    "ai/AI_PHILOSOPHY.md",
    "ai/AI_RULES.md",
    "ai/CODING_STANDARDS.md",
    "ai/GIT_WORKFLOW.md"
]

def resolve_path_to_files(path_entry):
    """If the entry is a directory, recursively collect all files inside it. 
       If it's a file, return it as a single-item list.
       Supports wildcards like docs/30-decisions/* as well."""
    collected_files = set()
    
    # Handle wildcard paths (e.g., docs/30-decisions/*)
    if '*' in path_entry:
        base_dir = path_entry.split('*')[0]
        if os.path.exists(base_dir):
            for root, _, filenames in os.walk(base_dir):
                for file in filenames:
                    collected_files.add(os.path.join(root, file))
    elif os.path.isdir(path_entry):
        for root, _, filenames in os.walk(path_entry):
            for file in filenames:
                collected_files.add(os.path.join(root, file))
    elif os.path.isfile(path_entry):
        collected_files.add(path_entry)
        
    return list(collected_files)

def parse_ai_index(index_path="AI_INDEX.md"):
    """Parses AI_INDEX.md and extracts conditional workflow blocks."""
    if not os.path.exists(index_path):
        print(f"Warning: {index_path} not found.")
        return []
    
    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()

    rules = []
    pattern = r"If you (.*?):\s*Read:\s*((?:\s+-?\s*[\w\./\-\*]+)+)"
    matches = re.findall(pattern, content, re.IGNORECASE)

    for condition, files_block in matches:
        files = [line.strip().lstrip('- ') for line in files_block.split('\n') if line.strip()]
        rules.append({
            "condition": condition.lower(),
            "files": files
        })
        
    return rules

def select_dynamic_files(task_description, rules):
    """Matches the task description against condition keywords from the index."""
    task_lower = task_description.lower()
    selected_files = set()
    matched_conditions = []

    for rule in rules:
        cond = rule["condition"]
        keywords = [w for w in re.findall(r'\w+', cond) if len(w) > 3]
        
        match_count = sum(1 for kw in keywords if kw in task_lower)
        if match_count >= 2 or cond in task_lower:
            matched_conditions.append(rule['condition'])
            for f in rule["files"]:
                resolved = resolve_path_to_files(f)
                selected_files.update(resolved)

    return list(selected_files), matched_conditions

def generate_targeted_prompt(task_description, manual_entries):
    output = []
    
    output.append(f"# Task Context\n**Task:** {task_description}\n\n---\n")
    
    # 1. Compile final file list (Core + Auto-matched + Manual)
    files_to_load = set()
    
    # Process CORE_FILES (expanding directories if specified)
    for core_entry in CORE_FILES:
        files_to_load.update(resolve_path_to_files(core_entry))
    
    rules = parse_ai_index()
    dynamic_files, matched_conditions = select_dynamic_files(task_description, rules)
    files_to_load.update(dynamic_files)
    
    # Report matching status
    print("\n[AI_INDEX Analysis]")
    if matched_conditions:
        print("  Found matching workflow sections:")
        for cond in matched_conditions:
            print(f"    - If you {cond}")
    else:
        print("  No matching conditional workflows found in AI_INDEX.md for this task.")
    
    # Add manually specified files or directories
    for entry in manual_entries:
        entry = entry.strip()
        if entry:
            files_to_load.update(resolve_path_to_files(entry))
    
    print("\n[Final set of files included in the prompt]")
    for f in sorted(files_to_load):
        print(f"  - {f}")
    print("-" * 40)

    # 2. Append file contents
    for file_path in sorted(files_to_load):
        if os.path.exists(file_path) and os.path.isfile(file_path):
            output.append(f"## File: `{file_path}`\n")
            ext = os.path.splitext(file_path)[1].lstrip('.')
            lang_map = {'py': 'python', 'md': 'markdown', 'json': 'json', 'ts': 'typescript', 'js': 'javascript'}
            lang = lang_map.get(ext, '')
            
            output.append(f"```{lang}")
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    output.append(f.read())
            except Exception as e:
                output.append(f"# Error reading file: {e}")
            output.append("```\n\n")
        else:
            print(f"[Warning] Path not found or is a directory skipping: {file_path}")

    return "\n".join(output)

if __name__ == "__main__":
    print("--- Smart Prompt Builder via AI_INDEX ---")
    user_task = input("What task are you going to work on? (e.g., 'modify image engine'): ")
    
    if not user_task.strip():
        print("Task description cannot be empty.")
        exit()

    additional_input = input("Additional files or directories separated by comma or space (leave empty if none): ")
    manual_entries = re.split(r'[,;\s]+', additional_input) if additional_input.strip() else []

    prompt_text = generate_targeted_prompt(user_task, manual_entries)
    
    # Calculate statistics
    prompt_bytes = prompt_text.encode('utf-8')
    size_kb = len(prompt_bytes) / 1024
    approx_tokens = len(prompt_text) // 4  # Standard rough heuristic: ~4 characters per token

    pyperclip.copy(prompt_text)
    
    print("\n[Prompt Statistics]")
    print(f"  - Size: {size_kb:.2f} KB")
    print(f"  - Estimated tokens: ~{approx_tokens}")
    print("\n[Done] The tailored minimum context has been copied to your clipboard.")