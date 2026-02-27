// scripts/migrate-mdx.mjs
// Script chạy 1 lần duy nhất để migrate các bài viết từ file .mdx sang Supabase
// Chạy: node scripts/migrate-mdx.mjs

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ⚠️ Thay bằng Service Role Key từ Supabase → Project Settings → API
// (Service Role Key mới có quyền bypass RLS để insert data)
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co'
const SERVICE_ROLE_KEY = 'YOUR_SERVICE_ROLE_KEY'

// Đường dẫn đến thư mục bài viết MDX của project Next.js cũ
const POSTS_DIR = path.resolve(__dirname, '../src/content/posts')

// Hàm parse frontmatter đơn giản (không cần gray-matter)
function parseFrontmatter(raw) {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)/)
    if (!match) return { data: {}, content: raw }

    const frontmatter = match[1]
    const content = match[2].trim()

    const data = {}
    for (const line of frontmatter.split('\n')) {
        const colonIdx = line.indexOf(':')
        if (colonIdx === -1) continue
        let key = line.slice(0, colonIdx).trim()
        let value = line.slice(colonIdx + 1).trim()

        // Remove surrounding quotes
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1)
        }

        // Parse arrays
        if (value.startsWith('[') && value.endsWith(']')) {
            value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, ''))
        }

        // Parse booleans
        if (value === 'true') value = true
        if (value === 'false') value = false

        data[key] = value
    }

    return { data, content }
}

async function migrate() {
    console.log('🚀 Bắt đầu migrate bài viết MDX → Supabase...\n')

    if (!fs.existsSync(POSTS_DIR)) {
        console.error(`❌ Không tìm thấy thư mục: ${POSTS_DIR}`)
        console.log('   Cập nhật POSTS_DIR trong script này.')
        process.exit(1)
    }

    const files = fs.readdirSync(POSTS_DIR)
        .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))

    if (files.length === 0) {
        console.log('⚠️ Không tìm thấy file .mdx nào.')
        process.exit(0)
    }

    console.log(`📄 Tìm thấy ${files.length} bài viết:\n`)

    const posts = files.map(fileName => {
        const filePath = path.join(POSTS_DIR, fileName)
        const raw = fs.readFileSync(filePath, 'utf8')
        const { data, content } = parseFrontmatter(raw)

        return {
            title: data.title || fileName.replace(/\.(mdx|md)$/, ''),
            slug: data.slug || fileName.replace(/\.(mdx|md)$/, ''),
            excerpt: data.excerpt || '',
            content: content,
            tags: Array.isArray(data.tags) ? data.tags : [],
            draft: data.draft === true || data.draft === 'true',
            cover_image: data.coverImage || null,
            created_at: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    })

    // Insert vào Supabase bằng REST API trực tiếp (không cần npm install supabase)
    for (const post of posts) {
        process.stdout.write(`   Đang migrate: "${post.title}"... `)

        const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
            method: 'POST',
            headers: {
                'apikey': SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify(post)
        })

        if (res.ok) {
            console.log('✅')
        } else {
            const err = await res.json()
            console.log(`❌ Lỗi: ${err.message || JSON.stringify(err)}`)
        }
    }

    console.log('\n🎉 Migrate hoàn tất!')
    console.log('📊 Kiểm tra dữ liệu tại: Supabase Dashboard → Table Editor → posts')
}

migrate()
