# dump.py
import os
import fnmatch
from pathlib import Path

# Директории, которые нужно пропустить
IGNORE_DIRS = {
    'node_modules', 'dist', 'build', '.next', '.nuxt', '.output',
    '.git', '.vite', '.cache', 'coverage', '.turbo', 'public',
    '__pycache__', '.pytest_cache', 'venv', 'env', '.venv'
}

# Файлы, которые нужно пропустить (поддерживает wildcard-паттерны)
IGNORE_FILES = {
    '*.log', '*.map', '.env', '.env.*', 'package-lock.json',
    'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb', '.DS_Store',
    '*.png', '*.jpg', '*.jpeg', '*.gif', '*.svg', '*.ico',
    '*.woff', '*.woff2', '*.ttf', '*.eot', '*.otf',
    '*.pdf', '*.zip', '*.tar', '*.gz', '*.exe', '*.dll', '*.so',
    'project_dump.txt', 'dump.py'  # исключаем сам дамп и этот скрипт
}

# Расширения текстовых файлов, которые точно можно читать
TEXT_EXTENSIONS = {
    '.ts', '.js', '.tsx', '.jsx', '.html', '.htm', '.css', '.scss', '.sass',
    '.less', '.json', '.md', '.txt', '.py', '.sh', '.bash', '.zsh',
    '.yml', '.yaml', '.toml', '.ini', '.cfg', '.conf', '.env.example',
    '.gitignore', '.dockerignore', '.editorconfig', '.prettierrc',
    '.eslintrc', '.babelrc', 'tsconfig.json', 'vite.config.ts'
}

def should_skip(name, patterns):
    """Проверяет, попадает ли имя файла в список игнорируемых паттернов"""
    return any(fnmatch.fnmatch(name, pat) for pat in patterns)

def is_text_file(filepath):
    """Определяет, является ли файл текстовым по расширению"""
    return Path(filepath).suffix.lower() in TEXT_EXTENSIONS

def read_file_safely(filepath):
    """Пытается прочитать файл, возвращает содержимое или None"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError:
        # Пробуем другие кодировки
        for enc in ['cp1251', 'latin-1', 'iso-8859-1']:
            try:
                with open(filepath, 'r', encoding=enc) as f:
                    return f.read()
            except:
                continue
    except Exception:
        pass
    return None

def main():
    output_file = 'project_dump.txt'
    project_root = Path('.').resolve()
    
    print(f"🔍 Сканирую проект: {project_root}")
    
    files_processed = 0
    files_skipped = 0
    
    with open(output_file, 'w', encoding='utf-8') as out:
        # Заголовок файла
        out.write(f"# Дамп проекта: {project_root.name}\n")
        out.write(f"# Сгенерировано: {Path(output_file).stat().st_mtime}\n")
        out.write(f"# Всего файлов: будет подсчитано...\n\n")
        out.write("=" * 80 + "\n\n")
        
        for root, dirs, files in os.walk('.'):
            # Пропускаем игнорируемые директории
            dirs[:] = [
                d for d in dirs 
                if d not in IGNORE_DIRS 
                and not d.startswith('.')
                and not d.startswith('_')
            ]
            
            # Сортируем файлы для консистентного вывода
            for f in sorted(files):
                # Пропускаем игнорируемые файлы
                if should_skip(f, IGNORE_FILES):
                    files_skipped += 1
                    continue
                
                filepath = os.path.join(root, f)
                rel_path = os.path.relpath(filepath, '.')
                
                # Пропускаем бинарные файлы (если расширение не в списке текстовых)
                if not is_text_file(filepath):
                    # Но всё равно пробуем прочитать - вдруг это текстовый файл без расширения
                    content = read_file_safely(filepath)
                    if content is None:
                        files_skipped += 1
                        continue
                else:
                    content = read_file_safely(filepath)
                    if content is None:
                        files_skipped += 1
                        out.write(f"📄 {rel_path} [⚠️ не удалось прочитать]\n")
                        out.write("-" * 40 + "\n\n")
                        continue
                
                # Записываем файл в дамп
                out.write(f"📄 {rel_path}\n")
                out.write("=" * 40 + "\n")
                out.write(content)
                out.write("\n\n" + "-" * 40 + "\n\n")
                
                files_processed += 1
                
                # Прогресс в консоль
                if files_processed % 10 == 0:
                    print(f"   Обработано файлов: {files_processed}")
        
        # Финальная статистика
        out.write("\n" + "=" * 80 + "\n")
        out.write(f"# Статистика:\n")
        out.write(f"# Обработано файлов: {files_processed}\n")
        out.write(f"# Пропущено файлов: {files_skipped}\n")
    
    print(f"\n✅ Готово!")
    print(f"📊 Обработано файлов: {files_processed}")
    print(f"⏭️  Пропущено файлов: {files_skipped}")
    print(f"💾 Результат сохранён в: {output_file}")
    print(f"\n📤 Теперь вы можете отправить содержимое {output_file} или сам файл.")

if __name__ == '__main__':
    main()