import { motion } from 'framer-motion';
import { ArrowLeft, Bold, Edit3, Eye, Heading, Italic, List, Plus, Save, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
	createPost,
	deletePost,
	getBlogPosts,
	importPosts,
	updatePost,
} from '../../data/blogStorage';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';
const ADMIN_CONFIGURED = Boolean(ADMIN_PASSWORD);

const Admin = () => {
	const [authed, setAuthed] = useState(() => sessionStorage.getItem('kishor_admin') === 'true');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [view, setView] = useState('dashboard');
	const [posts, setPosts] = useState([]);
	const [editing, setEditing] = useState(null);

	useEffect(() => {
		if (authed) setPosts(getBlogPosts());
	}, [authed]);

	const handleLogin = (e) => {
		e.preventDefault();
		if (!ADMIN_CONFIGURED) {
			setError('Admin password is not configured. Set VITE_ADMIN_PASSWORD and rebuild.');
			return;
		}
		if (password === ADMIN_PASSWORD) {
			sessionStorage.setItem('kishor_admin', 'true');
			setAuthed(true);
			setError('');
		} else {
			setError('Wrong password');
		}
	};

	const handleLogout = () => {
		sessionStorage.removeItem('kishor_admin');
		setAuthed(false);
	};

	if (!authed) {
		return (
			<div className="min-h-screen bg-dark flex items-center justify-center px-4">
				<div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(236,72,153,0.1),transparent_24%),linear-gradient(180deg,#14081f_0%,#0f0518_48%,#09030f_100%)]" />
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="relative w-full max-w-sm"
				>
					<div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl blur opacity-30" />
					<div className="relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
						<div className="text-center mb-8">
							<div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
								<Edit3 size={24} className="text-primary" />
							</div>
							<h1 className="text-2xl font-bold text-white">Admin</h1>
							<p className="text-sm text-gray-400 mt-1">Sign in to manage your blog</p>
						</div>
						<form onSubmit={handleLogin} className="space-y-4">
							<div>
								<input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Password"
									autoComplete="current-password"
									disabled={!ADMIN_CONFIGURED}
									className="w-full px-4 py-3 text-white text-sm rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-400 disabled:opacity-50"
									autoFocus
								/>
							</div>
							{!ADMIN_CONFIGURED && (
								<p className="text-amber-300 text-xs text-center">
									Set VITE_ADMIN_PASSWORD to enable sign in.
								</p>
							)}
							{error && (
								<p role="alert" className="text-red-400 text-sm text-center">{error}</p>
							)}
							<button
								type="submit"
								disabled={!ADMIN_CONFIGURED}
								className="w-full py-3 font-bold text-sm text-dark bg-primary rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
							>
								Sign In
							</button>
						</form>
					</div>
				</motion.div>
			</div>
		);
	}

	if (view === 'editor') {
		return (
			<PostEditor
				post={editing}
				onBack={() => {
					setView('dashboard');
					setEditing(null);
					setPosts(getBlogPosts());
				}}
			/>
		);
	}

	return (
		<Dashboard
			posts={posts}
			onNew={() => {
				setEditing(null);
				setView('editor');
			}}
			onEdit={(post) => {
				setEditing(post);
				setView('editor');
			}}
			onDelete={(slug) => {
				deletePost(slug);
				setPosts(getBlogPosts());
			}}
			onLogout={handleLogout}
		/>
	);
};

const Dashboard = ({ posts, onNew, onEdit, onDelete, onLogout }) => {
	const [importing, setImporting] = useState(false);
	const [importData, setImportData] = useState('');

	const handleExport = () => {
		const blob = new Blob([JSON.stringify(posts, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'blog-posts.json';
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleImport = () => {
		try {
			const parsed = JSON.parse(importData);
			if (!Array.isArray(parsed)) throw new Error('Must be an array');
			importPosts(parsed);
			setImporting(false);
			setImportData('');
			window.location.reload();
		} catch (err) {
			alert('Invalid JSON: ' + err.message);
		}
	};

	return (
		<div className="min-h-screen bg-dark text-white selection:bg-primary/30">
			<div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(236,72,153,0.1),transparent_24%),linear-gradient(180deg,#14081f_0%,#0f0518_48%,#09030f_100%)]" />
			<div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
				<div className="flex items-center justify-between mb-10">
					<div>
						<h1 className="text-3xl font-bold">Blog Admin</h1>
						<p className="text-gray-400 text-sm mt-1">
							{posts.length} {posts.length === 1 ? 'post' : 'posts'} total
						</p>
					</div>
					<div className="flex items-center gap-3">
						<button
							onClick={() => setImporting(true)}
							className="px-4 py-2 text-sm font-semibold text-gray-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
						>
							Import
						</button>
						<button
							onClick={handleExport}
							className="px-4 py-2 text-sm font-semibold text-gray-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
						>
							Export
						</button>
						<button
							onClick={onNew}
							className="px-5 py-2.5 text-sm font-bold text-dark bg-primary rounded-xl hover:scale-[1.02] transition-all flex items-center gap-2"
						>
							<Plus size={16} /> New Post
						</button>
						<button
							onClick={onLogout}
							className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-all"
						>
							Logout
						</button>
					</div>
				</div>

				{importing && (
					<div className="mb-8 p-6 rounded-2xl border border-white/10 bg-white/5">
						<div className="flex items-center justify-between mb-4">
							<h3 className="font-semibold">Import Posts (JSON)</h3>
							<button
								onClick={() => { setImporting(false); setImportData(''); }}
								className="text-gray-400 hover:text-white"
							>
								<X size={18} />
							</button>
						</div>
						<textarea
							value={importData}
							onChange={(e) => setImportData(e.target.value)}
							rows={6}
							className="w-full px-4 py-3 text-white text-sm rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-400 font-mono"
							placeholder='[{"slug": "my-post", "title": "My Post", ...}]'
						/>
						<button
							onClick={handleImport}
							className="mt-3 px-5 py-2.5 text-sm font-bold text-dark bg-primary rounded-xl hover:scale-[1.02] transition-all"
						>
							Import
						</button>
					</div>
				)}

				{posts.length === 0 ? (
					<div className="text-center py-20">
						<p className="text-gray-400 text-lg">No posts yet.</p>
						<button
							onClick={onNew}
							className="mt-4 px-6 py-3 text-sm font-bold text-dark bg-primary rounded-xl hover:scale-[1.02] transition-all inline-flex items-center gap-2"
						>
							<Plus size={16} /> Create your first post
						</button>
					</div>
				) : (
					<div className="space-y-3">
						{posts.map((post) => (
							<motion.div
								key={post.slug}
								layout
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/[0.07] transition-all group"
							>
								<div
									className="w-1 h-12 rounded-full shrink-0"
									style={{ backgroundColor: post.hoverColor || '#a78bfa' }}
								/>
								<div className="flex-1 min-w-0">
									<h3 className="font-semibold text-white truncate">
										{post.title}
									</h3>
									<p className="text-xs text-gray-400 mt-0.5">
										{post.category} &middot; {post.readingTime} &middot; {post.publishedAt}
									</p>
								</div>
								<div className="flex items-center gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
									<a
										href={post.path}
										target="_blank"
										rel="noopener noreferrer"
										className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
										title="View"
									>
										<Eye size={16} />
									</a>
									<button
										onClick={() => onEdit(post)}
										className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
										title="Edit"
									>
										<Edit3 size={16} />
									</button>
									<button
										onClick={() => {
											if (confirm(`Delete "${post.title}"?`)) onDelete(post.slug);
										}}
										className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/10 transition-all"
										title="Delete"
									>
										<Trash2 size={16} />
									</button>
								</div>
							</motion.div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

const PostEditor = ({ post, onBack }) => {
	const [form, setForm] = useState({
		slug: '',
		path: '',
		title: '',
		description: '',
		excerpt: '',
		hoverColor: '#a78bfa',
		category: '',
		readingTime: '',
		publishedAt: new Date().toISOString().split('T')[0],
		updatedAt: new Date().toISOString().split('T')[0],
		tags: [],
		hero: '',
		sections: [{ heading: '', paragraphs: [''], bullets: [''] }],
	});
	const [tagInput, setTagInput] = useState('');
	const [contentMode, setContentMode] = useState('structured');
	const [simpleContent, setSimpleContent] = useState('');
	const simpleRef = useRef(null);

	const formatText = (before, after) => {
		const ta = simpleRef.current;
		if (!ta) return;
		const start = ta.selectionStart;
		const end = ta.selectionEnd;
		const text = simpleContent;
		const selected = text.slice(start, end);
		const wrapped = before + selected + after;
		setSimpleContent(text.slice(0, start) + wrapped + text.slice(end));
		setTimeout(() => {
			ta.focus();
			ta.setSelectionRange(start + before.length, start + before.length + selected.length);
		}, 0);
	};

	const renderPreview = (text) => {
		if (!text) return '';
		const blocks = text.split(/\n---\n/).filter(Boolean);
		return blocks
			.map((block) => {
				const lines = block.split('\n').filter(Boolean);
				let html = '';
				let inList = false;
				for (const line of lines) {
					if (line.startsWith('## ')) {
						if (inList) { html += '</ul>'; inList = false; }
						html += `<h2 class="text-xl font-bold text-white mt-6 mb-3">${inlineFormat(line.replace(/^## /, ''))}</h2>`;
					} else if (line.startsWith('- ')) {
						if (!inList) { html += '<ul class="space-y-1 mb-3">'; inList = true; }
						html += `<li class="text-gray-300 ml-5 list-disc">${inlineFormat(line.replace(/^- /, ''))}</li>`;
					} else if (line.trim()) {
						if (inList) { html += '</ul>'; inList = false; }
						html += `<p class="text-gray-300 mb-2 leading-relaxed">${inlineFormat(line)}</p>`;
					}
				}
				if (inList) html += '</ul>';
				return html;
			})
			.join('<hr class="border-white/10 my-6" />');
	};

	const inlineFormat = (text) =>
		text
			.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
			.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
			.replace(/`(.+?)`/g, '<code class="text-primary bg-primary/10 px-1.5 rounded text-xs">$1</code>');

	useEffect(() => {
		if (post) {
			const sections = post.sections?.length > 0
				? post.sections.map((s) => ({
					heading: s.heading || '',
					paragraphs: s.paragraphs?.length > 0 ? s.paragraphs : [''],
					bullets: s.bullets?.length > 0 ? s.bullets : [''],
				}))
				: [{ heading: '', paragraphs: [''], bullets: [''] }];
			setForm({
				slug: post.slug || '',
				path: post.path || '',
				title: post.title || '',
				description: post.description || '',
				excerpt: post.excerpt || '',
				hoverColor: post.hoverColor || '#a78bfa',
				category: post.category || '',
				readingTime: post.readingTime || '',
				publishedAt: post.publishedAt || '',
				updatedAt: post.updatedAt || '',
				tags: post.tags || [],
				hero: post.hero || '',
				sections,
			});
			setSimpleContent(
				sections
					.map((s) => {
						let block = s.heading ? `## ${s.heading}` : '';
						if (s.paragraphs.filter(Boolean).length > 0) {
							block += (block ? '\n\n' : '') + s.paragraphs.filter(Boolean).join('\n\n');
						}
						if (s.bullets.filter(Boolean).length > 0) {
							block += (block ? '\n\n' : '') + s.bullets.filter(Boolean).map((b) => `- ${b}`).join('\n');
						}
						return block;
					})
					.join('\n\n---\n\n'),
			);
		}
	}, [post]);

	const computeReadingTime = (text) => {
		const words = text.split(/\s+/).filter(Boolean).length;
		const minutes = Math.max(1, Math.round(words / 200));
		return `${minutes} min read`;
	};

	const parseSimpleContent = (text) => {
		const blocks = text.split(/\n---\n/).filter(Boolean);
		return blocks.map((block) => {
			const lines = block.split('\n').filter(Boolean);
			const heading = lines.find((l) => l.startsWith('## '))?.replace(/^## /, '') || '';
			const bullets = lines.filter((l) => l.startsWith('- ')).map((l) => l.replace(/^- /, ''));
			const paragraphs = lines.filter((l) => !l.startsWith('## ') && !l.startsWith('- '));
			return { heading, paragraphs, bullets };
		});
	};

	const autoSlug = (title) =>
		title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');

	const addTag = (value) => {
		const tag = value.trim();
		if (tag && !form.tags.includes(tag)) {
			setForm({ ...form, tags: [...form.tags, tag] });
		}
		setTagInput('');
	};

	const removeTag = (tag) => {
		setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
	};

	const handleChange = (field, value) => {
		const updated = { ...form, [field]: value };
		if (field === 'title') {
			updated.slug = autoSlug(value);
			updated.path = `/blog/${autoSlug(value)}/`;
		}
		setForm(updated);
	};

	const handleSectionChange = (idx, field, value) => {
		const sections = [...form.sections];
		sections[idx] = { ...sections[idx], [field]: value };
		setForm({ ...form, sections });
	};

	const addSection = () => {
		setForm({
			...form,
			sections: [...form.sections, { heading: '', paragraphs: [''], bullets: [''] }],
		});
	};

	const removeSection = (idx) => {
		if (form.sections.length <= 1) return;
		setForm({
			...form,
			sections: form.sections.filter((_, i) => i !== idx),
		});
	};

	const handleSave = () => {
		if (!form.title.trim()) { alert('Title is required'); return; }
		if (!form.slug.trim()) { alert('Slug is required'); return; }

		let sections;
		if (contentMode === 'simple') {
			sections = parseSimpleContent(simpleContent);
		} else {
			sections = form.sections.map((s) => ({
				heading: s.heading,
				paragraphs: s.paragraphs.filter(Boolean),
				bullets: s.bullets.filter(Boolean),
			}));
		}

		const totalText = sections
			.map((s) => `${s.heading} ${s.paragraphs.join(' ')} ${s.bullets.join(' ')}`)
			.join(' ');
		const rt = form.readingTime || computeReadingTime(totalText);

		const payload = {
			...form,
			readingTime: rt,
			sections,
		};

		if (post) {
			updatePost(post.slug, payload);
		} else {
			createPost(payload);
		}

		onBack();
	};

	return (
		<div className="min-h-screen bg-dark text-white selection:bg-primary/30">
			<div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(236,72,153,0.1),transparent_24%),linear-gradient(180deg,#14081f_0%,#0f0518_48%,#09030f_100%)]" />
			<div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
				<div className="flex items-center justify-between mb-8">
					<button
						onClick={onBack}
						className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
					>
						<ArrowLeft size={16} /> Back
					</button>
					<div className="flex items-center gap-3">
						{post && (
							<a
								href={post.path}
								target="_blank"
								rel="noopener noreferrer"
								className="px-4 py-2.5 text-sm font-semibold text-gray-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all inline-flex items-center gap-2"
							>
								<Eye size={14} /> Preview
							</a>
						)}
						<button
							onClick={handleSave}
							className="px-5 py-2.5 text-sm font-bold text-dark bg-primary rounded-xl hover:scale-[1.02] transition-all inline-flex items-center gap-2"
						>
							<Save size={16} /> {post ? 'Update' : 'Publish'}
						</button>
					</div>
				</div>

				<div className="space-y-6">
					<div className="grid md:grid-cols-2 gap-4">
						<div className="md:col-span-2">
							<label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Title</label>
							<input
								type="text"
								value={form.title}
								onChange={(e) => handleChange('title', e.target.value)}
								className="w-full px-4 py-3 text-white rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-400"
								placeholder="Post title"
							/>
						</div>
						<div>
							<label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Slug</label>
							<input
								type="text"
								value={form.slug}
								onChange={(e) => {
									const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
									setForm({ ...form, slug, path: `/blog/${slug}/` });
								}}
								className="w-full px-4 py-3 text-white text-sm rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-400 font-mono"
								placeholder="my-post-slug"
							/>
						</div>
						<div>
							<label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Category</label>
							<input
								type="text"
								value={form.category}
								onChange={(e) => handleChange('category', e.target.value)}
								className="w-full px-4 py-3 text-white text-sm rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-400"
								placeholder="SEO, Performance, etc."
							/>
						</div>
						<div>
							<label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Reading Time</label>
							<input
								type="text"
								value={form.readingTime}
								onChange={(e) => handleChange('readingTime', e.target.value)}
								className="w-full px-4 py-3 text-white text-sm rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-400"
								placeholder="Auto-calculated"
							/>
						</div>
						<div>
							<label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Published Date</label>
							<input
								type="date"
								value={form.publishedAt}
								onChange={(e) => setForm({ ...form, publishedAt: e.target.value, updatedAt: e.target.value })}
								className="w-full px-4 py-3 text-white text-sm rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 transition-all"
							/>
						</div>
						<div>
							<label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Hover Color</label>
							<div className="flex items-center gap-3">
								<input
									type="color"
									value={form.hoverColor}
									onChange={(e) => handleChange('hoverColor', e.target.value)}
									className="w-10 h-10 rounded-xl bg-transparent border border-white/10 cursor-pointer"
								/>
								<input
									type="text"
									value={form.hoverColor}
									onChange={(e) => handleChange('hoverColor', e.target.value)}
									className="flex-1 px-4 py-3 text-white text-sm rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-400 font-mono"
								/>
							</div>
						</div>
						<div className="md:col-span-2">
							<label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Tags</label>
							<div className="flex flex-wrap gap-2 mb-2">
								{form.tags.map((tag) => (
									<span
										key={tag}
										className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 border border-primary/20 text-primary"
									>
										{tag}
										<button
											onClick={() => removeTag(tag)}
											className="hover:text-white transition-colors"
										>
											<X size={12} />
										</button>
									</span>
								))}
							</div>
							<input
								type="text"
								value={tagInput}
								onChange={(e) => setTagInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === ',' || e.key === 'Enter') {
										e.preventDefault();
										addTag(e.key === ',' ? tagInput.slice(0, -1) : tagInput);
									}
									if (e.key === 'Backspace' && !tagInput && form.tags.length > 0) {
										removeTag(form.tags[form.tags.length - 1]);
									}
								}}
								className="w-full px-4 py-3 text-white text-sm rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-400"
								placeholder="Type a tag and press comma or Enter"
							/>
						</div>
						<div className="md:col-span-2">
							<label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Description (meta / SEO)</label>
							<textarea
								value={form.description}
								onChange={(e) => handleChange('description', e.target.value)}
								rows={2}
								className="w-full px-4 py-3 text-white text-sm rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-400 resize-none"
								placeholder="Short description for SEO and card previews"
							/>
						</div>
						<div className="md:col-span-2">
							<label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Excerpt (card preview)</label>
							<textarea
								value={form.excerpt}
								onChange={(e) => handleChange('excerpt', e.target.value)}
								rows={2}
								className="w-full px-4 py-3 text-white text-sm rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-400 resize-none"
								placeholder="Shown on blog cards"
							/>
						</div>
						<div className="md:col-span-2">
							<label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Hero Text</label>
							<textarea
								value={form.hero}
								onChange={(e) => handleChange('hero', e.target.value)}
								rows={2}
								className="w-full px-4 py-3 text-white text-sm rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-400 resize-none"
								placeholder="Hero quote shown at the top of the article"
							/>
						</div>
					</div>

					<div className="border-t border-white/10 pt-8">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-3">
								<h2 className="text-lg font-bold text-white">Content</h2>
								<div className="flex rounded-xl border border-white/10 overflow-hidden">
									<button
										onClick={() => setContentMode('simple')}
										className={`px-4 py-1.5 text-xs font-semibold transition-all ${contentMode === 'simple' ? 'bg-primary text-dark' : 'text-gray-400 hover:text-white'}`}
									>
										Simple
									</button>
									<button
										onClick={() => setContentMode('structured')}
										className={`px-4 py-1.5 text-xs font-semibold transition-all ${contentMode === 'structured' ? 'bg-primary text-dark' : 'text-gray-400 hover:text-white'}`}
									>
										Structured
									</button>
								</div>
							</div>
							{contentMode === 'structured' && (
								<button
									onClick={addSection}
									className="px-4 py-2 text-sm font-semibold text-primary bg-primary/10 border border-primary/20 rounded-xl hover:bg-primary/20 transition-all inline-flex items-center gap-2"
								>
									<Plus size={14} /> Add Section
								</button>
							)}
						</div>

						{contentMode === 'simple' ? (
							<div>
								<p className="text-xs text-gray-400 mb-3">
									Format with toolbar buttons or type directly. See live preview below.
								</p>
								<div className="flex items-center gap-1 mb-2 p-1.5 rounded-xl bg-white/[0.03] border border-white/10 w-fit">
									<button
										onClick={() => formatText('**', '**')}
										className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
										title="Bold"
									><Bold size={15} /></button>
									<button
										onClick={() => formatText('*', '*')}
										className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
										title="Italic"
									><Italic size={15} /></button>
									<button
										onClick={() => formatText('## ', '')}
										className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
										title="Heading"
									><Heading size={15} /></button>
									<button
										onClick={() => formatText('\n- ', '')}
										className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
										title="Bullet List"
									><List size={15} /></button>
								</div>
								<textarea
									ref={simpleRef}
									value={simpleContent}
									onChange={(e) => setSimpleContent(e.target.value)}
									rows={16}
									className="w-full px-4 py-3 text-white text-sm rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-400 resize-none font-mono leading-relaxed"
									placeholder="## Section Heading&#10;&#10;Paragraph text here...&#10;&#10;Another paragraph...&#10;&#10;- bullet one&#10;- bullet two&#10;&#10;---&#10;&#10;## Next Section&#10;&#10;More content..."
								/>
								{simpleContent.trim() && (
									<div className="mt-4 p-5 rounded-xl bg-white/[0.02] border border-white/5">
										<p className="text-xs uppercase tracking-wider text-gray-400 mb-3 font-semibold">Preview</p>
										<div
											className="rich-text max-w-none"
											dangerouslySetInnerHTML={{ __html: renderPreview(simpleContent) }}
										/>
									</div>
								)}
							</div>
						) : (
							<>
								{form.sections.map((section, idx) => (
									<div
										key={idx}
										className="mb-6 p-5 rounded-2xl border border-white/10 bg-white/[0.03]"
									>
										<div className="flex items-center justify-between mb-4">
											<span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
												Section {idx + 1}
											</span>
											{form.sections.length > 1 && (
												<button
													onClick={() => removeSection(idx)}
													className="text-gray-400 hover:text-red-400 transition-colors"
												>
													<X size={16} />
												</button>
											)}
										</div>
										<div className="space-y-4">
											<div>
												<label className="block text-xs text-gray-400 mb-1">Heading</label>
												<input
													type="text"
													value={section.heading}
													onChange={(e) => handleSectionChange(idx, 'heading', e.target.value)}
													className="w-full px-4 py-2.5 text-white text-sm rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-400"
													placeholder="Section heading"
												/>
											</div>
											<div>
												<label className="block text-xs text-gray-400 mb-1">Paragraphs (one per line)</label>
												<textarea
													value={section.paragraphs.join('\n')}
													onChange={(e) => handleSectionChange(idx, 'paragraphs', e.target.value.split('\n'))}
													rows={3}
													className="w-full px-4 py-2.5 text-white text-sm rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-400 resize-none"
													placeholder="Paragraph text..."
												/>
											</div>
											<div>
												<label className="block text-xs text-gray-400 mb-1">Bullets (one per line)</label>
												<textarea
													value={section.bullets.join('\n')}
													onChange={(e) => handleSectionChange(idx, 'bullets', e.target.value.split('\n'))}
													rows={2}
													className="w-full px-4 py-2.5 text-white text-sm rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-400 resize-none"
													placeholder="Bullet point..."
												/>
											</div>
										</div>
									</div>
								))}
							</>
						)}
					</div>
				</div>

				<div className="mt-10 flex items-center justify-between border-t border-white/10 pt-8">
					<button
						onClick={onBack}
						className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2"
					>
						<ArrowLeft size={16} /> Cancel
					</button>
					<button
						onClick={handleSave}
						className="px-6 py-3 text-sm font-bold text-dark bg-primary rounded-xl hover:scale-[1.02] transition-all inline-flex items-center gap-2"
					>
						<Save size={16} /> {post ? 'Update Post' : 'Publish Post'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Admin;
