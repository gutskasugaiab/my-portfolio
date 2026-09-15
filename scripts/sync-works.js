// portfolio/img/designers/<slug>/ 以下の画像（直下のファイル、またはプロジェクトごとのサブフォルダ）と、
// portfolio/works/<slug>/<work-slug>/index.html のLP・HPフォルダを、
// 自動でdesigner-works.jsonに反映するスクリプト。
// GitHub Actions（.github/workflows/sync-works.yml）がpush時に実行する。
// 手動で追加した動画などの項目（auto: true が付いていないもの）はそのまま残す。

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'portfolio');
const IMG_DESIGNERS_DIR = path.join(ROOT, 'img', 'designers');
const WORKS_DIR = path.join(ROOT, 'works');
const DATA_FILE = path.join(ROOT, 'data', 'designer-works.json');

const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

function loadJson(file, fallback) {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function isDir(p) {
    return fs.existsSync(p) && fs.statSync(p).isDirectory();
}

function titleFromFilename(name) {
    const base = name.replace(/\.[^.]+$/, '');
    return base.replace(/[-_]+/g, ' ').trim();
}

function collectImageWorks() {
    const items = [];
    if (!isDir(IMG_DESIGNERS_DIR)) return items;

    const slugs = fs.readdirSync(IMG_DESIGNERS_DIR).filter(f =>
        isDir(path.join(IMG_DESIGNERS_DIR, f))
    );

    slugs.forEach(slug => {
        const dir = path.join(IMG_DESIGNERS_DIR, slug);
        const entries = fs.readdirSync(dir).sort((a, b) => a.localeCompare(b, 'ja'));
        let order = 0;

        entries.forEach(entry => {
            const entryPath = path.join(dir, entry);

            if (isDir(entryPath)) {
                // ── サブフォルダ＝1つの作品として扱う（中の最初の画像を代表画像にする）
                const innerFiles = fs.readdirSync(entryPath)
                    .filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
                    .sort((a, b) => a.localeCompare(b, 'ja'));
                if (innerFiles.length === 0) return; // 画像が1枚も無いフォルダは無視

                order += 1;
                const meta = loadJson(path.join(entryPath, 'meta.json'), {});
                items.push({
                    designerSlug: slug,
                    title: meta.title || titleFromFilename(entry),
                    description: meta.description || '',
                    image: `img/designers/${slug}/${entry}/${innerFiles[0]}`,
                    sitePath: '',
                    videoUrl: '',
                    order: meta.order || order,
                    auto: true
                });
                return;
            }

            if (IMAGE_EXTS.includes(path.extname(entry).toLowerCase())) {
                // ── フラットな画像ファイル＝1つの作品として扱う
                order += 1;
                const metaFile = path.join(dir, entry.replace(/\.[^.]+$/, '') + '.meta.json');
                const meta = loadJson(metaFile, {});
                items.push({
                    designerSlug: slug,
                    title: meta.title || titleFromFilename(entry),
                    description: meta.description || '',
                    image: `img/designers/${slug}/${entry}`,
                    sitePath: '',
                    videoUrl: '',
                    order: meta.order || order,
                    auto: true
                });
            }
        });
    });

    return items;
}

function collectLpWorks() {
    const items = [];
    if (!isDir(WORKS_DIR)) return items;

    // works/_example のようにアンダースコアで始まるフォルダは見本用として無視する
    const slugs = fs.readdirSync(WORKS_DIR).filter(f =>
        isDir(path.join(WORKS_DIR, f)) && !f.startsWith('_')
    );

    slugs.forEach(slug => {
        const designerDir = path.join(WORKS_DIR, slug);
        const workSlugs = fs.readdirSync(designerDir)
            .filter(f => isDir(path.join(designerDir, f)))
            .filter(f => fs.existsSync(path.join(designerDir, f, 'index.html')))
            .sort((a, b) => a.localeCompare(b, 'ja'));

        workSlugs.forEach((workSlug, index) => {
            const workDir = path.join(designerDir, workSlug);
            const meta = loadJson(path.join(workDir, 'meta.json'), {});
            items.push({
                designerSlug: slug,
                title: meta.title || titleFromFilename(workSlug),
                description: meta.description || '',
                image: meta.thumbnail || '',
                sitePath: `works/${slug}/${workSlug}/index.html`,
                videoUrl: '',
                order: meta.order || (index + 1),
                auto: true
            });
        });
    });

    return items;
}

function main() {
    const existing = loadJson(DATA_FILE, []);
    // 手動追加した項目（autoフラグが無いもの＝動画など）はそのまま維持する
    const manual = existing.filter(item => !item.auto);

    const autoItems = [...collectImageWorks(), ...collectLpWorks()];

    const merged = [...manual, ...autoItems];
    fs.writeFileSync(DATA_FILE, JSON.stringify(merged, null, 2) + '\n', 'utf8');

    const designerCount = new Set(autoItems.map(i => i.designerSlug)).size;
    console.log(`synced ${autoItems.length} auto work(s) (image + LP/HP) across ${designerCount} designer folder(s)`);
}

main();
