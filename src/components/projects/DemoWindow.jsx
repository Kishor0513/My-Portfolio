import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, ChevronRight, Copy, ExternalLink, FileCode2, FolderOpen, Github, Loader2, RotateCw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

const treeCache = new Map();

const parseRepo = (url = '') => {
	const m = url.match(/github\.com\/([^/]+)\/([^/#?]+)/);
	return m ? { owner: m[1], repo: m[2].replace(/\.git$/, '') } : null;
};

const extColor = (n = '') => {
	if (/\.(tsx|jsx)$/.test(n)) return 'text-cyan-300';
	if (/\.ts$/.test(n)) return 'text-blue-300';
	if (/\.py$/.test(n)) return 'text-yellow-300';
	if (/\.php$/.test(n)) return 'text-indigo-300';
	if (/\.mdx?$/.test(n)) return 'text-pink-300';
	if (/\.json$/.test(n)) return 'text-amber-300';
	return 'text-gray-400';
};

function highlight(code) {
	const esc = (code || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	return esc
		.replace(/(&lt;\/?[A-Za-z][^&]*?&gt;)/g, '<span class="text-[#4ec9b0]">$1</span>')
		.replace(/(\/\*[\s\S]*?\*\/|\/\/.*|#[^\n]*|&lt;!--[\s\S]*?--&gt;)/g, '<span class="text-[#6a9955]">$1</span>')
		.replace(/('[^'\n]*'|"[^"\n]*"|`[^`]*`)/g, '<span class="text-[#ce9178]">$1</span>')
		.replace(/\b(import|from|export|default|return|const|let|function|async|await|new|if|else|for|class|type|require|session_start|echo|def|print)\b/g, '<span class="text-[#c586c0]">$1</span>')
		.replace(/\b(true|false|null|None|POST|GET)\b/g, '<span class="text-[#569cd6]">$1</span>')
		.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-[#b5cea8]">$1</span>');
}

function buildTree(paths) {
	const root = {};
	for (const p of paths) {
		const parts = p.split('/');
		let node = root;
		for (let i = 0; i < parts.length; i++) {
			if (i === parts.length - 1) {
				node.__files = node.__files || [];
				node.__files.push(p);
			} else {
				node[parts[i]] = node[parts[i]] || {};
				node = node[parts[i]];
			}
		}
	}
	return root;
}

function TreeNode({ node, depth, open, toggle, onFile, active }) {
	const folders = Object.keys(node).filter((k) => k !== '__files').sort();
	const files = node.__files || [];
	return (
		<div>
			{folders.map((name) => {
				const key = `${depth}-${name}`;
				const isOpen = open.has(key);
				return (
					<div key={key}>
						<button onClick={() => toggle(key)} className="w-full flex items-center gap-1 px-2 py-1 text-[11px] font-mono text-gray-300 hover:bg-white/5 rounded" style={{ paddingLeft: 8 + depth * 12 }}>
							{isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
							<FolderOpen size={12} className="text-amber-300/80" /> {name}
						</button>
						{isOpen && <TreeNode node={node[name]} depth={depth + 1} open={open} toggle={toggle} onFile={onFile} active={active} />}
					</div>
				);
			})}
			{files.map((f) => (
				<button key={f} onClick={() => onFile(f)} title={f} className={`w-full flex items-center gap-1.5 text-[11px] font-mono truncate px-2 py-1 rounded hover:bg-white/5 ${active === f ? 'bg-white/10 text-white' : 'text-gray-400'}`} style={{ paddingLeft: 10 + depth * 12 }}>
					<FileCode2 size={11} className={extColor(f)} /> <span className="truncate">{f.split('/').pop()}</span>
				</button>
			))}
		</div>
	);
}

function Traffic({ onClose, onMin, onMax, maximized }) {
	const btn = 'group w-3.5 h-3.5 rounded-full flex items-center justify-center transition';
	const icon = 'opacity-0 group-hover:opacity-100 text-[9px] font-black leading-none text-black/60';
	return (
		<span className="flex gap-2 shrink-0">
			<button aria-label="Close" title="Close" onClick={onClose} className={`${btn} bg-[#ff5f57] hover:brightness-110`}><span className={icon}>✕</span></button>
			<button aria-label="Minimize" title="Minimize" onClick={onMin} className={`${btn} bg-[#febc2e] hover:brightness-110`}><span className={icon}>–</span></button>
			<button aria-label="Zoom" title={maximized ? 'Restore' : 'Maximize'} onClick={onMax} className={`${btn} bg-[#28c840] hover:brightness-110`}><span className={icon}>+</span></button>
		</span>
	);
}

export default function DemoWindow({ project, onClose }) {
	const [tab, setTab] = useState('demo');
	const [activeFile, setActiveFile] = useState(0);
	const [query, setQuery] = useState('');
	const [copied, setCopied] = useState(false);
	const [maximized, setMaximized] = useState(false);
	const [minimized, setMinimized] = useState(false);
	const [ghPaths, setGhPaths] = useState(null);
	const [ghLoading, setGhLoading] = useState(false);
	const [ghError, setGhError] = useState('');
	const [ghFile, setGhFile] = useState(null);
	const [ghFileLoading, setGhFileLoading] = useState(false);
	const [open, setOpen] = useState(new Set());
	const [reloadKey, setReloadKey] = useState(0);

	const meta = useMemo(() => parseRepo(project?.link), [project?.link]);
	const bundled = useMemo(() => project?.files ?? [], [project]);
	const activeBundled = bundled[activeFile];
	const editorPath = ghFile?.path || activeBundled?.path || '';
	const editorCode = ghFile?.code ?? activeBundled?.code ?? '// select a file';
	const html = useMemo(() => highlight(editorCode), [editorCode]);
	const demoUrl = project?.demoUrl;
	const tree = useMemo(() => (ghPaths ? buildTree(ghPaths.filter((p) => p.toLowerCase().includes(query.toLowerCase()))) : null), [ghPaths, query]);
	const filteredBundled = bundled.filter((f) => f.path.toLowerCase().includes(query.toLowerCase()));
	const githubFileUrl = meta && ghFile ? `https://github.com/${meta.owner}/${meta.repo}/blob/HEAD/${ghFile.path}` : project?.link;

	useEffect(() => {
		setTab('demo'); setActiveFile(0); setQuery('');
		setGhFile(null); setGhError(''); setMaximized(false); setMinimized(false); setReloadKey(0);
		setGhPaths(treeCache.get(project?.id) || null);
	}, [project?.id]);

	const importAll = useCallback(async () => {
		if (!meta || ghLoading) return;
		if (treeCache.get(project.id)) { setGhPaths(treeCache.get(project.id)); return; }
		setGhLoading(true); setGhError('');
		try {
			const res = await fetch(`https://api.github.com/repos/${meta.owner}/${meta.repo}/git/trees/HEAD?recursive=1`);
			if (!res.ok) throw new Error();
			const data = await res.json();
			const paths = (data.tree || [])
				.filter((t) => t.type === 'blob' && (t.size || 0) < 150 * 1024)
				.map((t) => t.path)
				.filter((p) => !/node_modules\/|dist\/|\.next\/|\.git\/|package-lock|yarn\.lock|\.(png|jpg|jpeg|gif|ico|woff2?|ttf|mp4|pdf)$/i.test(p))
				.slice(0, 600);
			treeCache.set(project.id, paths);
			setGhPaths(paths);
			if (!paths.length) setGhError('Repo empty or private');
		} catch {
			setGhError('GitHub limit / offline — curated files below');
		} finally {
			setGhLoading(false);
		}
	}, [meta, ghLoading, project?.id]);

	useEffect(() => {
		if (!project) return;
		const t = setTimeout(importAll, 500);
		return () => clearTimeout(t);
	}, [project?.id, importAll]);

	useEffect(() => {
		const fn = (e) => e.key === 'Escape' && onClose();
		window.addEventListener('keydown', fn);
		document.body.style.overflow = project ? 'hidden' : '';
		return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
	}, [project, onClose]);

	const openGhFile = async (path) => {
		if (!meta) return;
		setGhFileLoading(true);
		try {
			const res = await fetch(`https://raw.githubusercontent.com/${meta.owner}/${meta.repo}/HEAD/${path}`);
			const text = await res.text();
			setGhFile({ path, code: text.slice(0, 12000) });
		} finally {
			setGhFileLoading(false);
		}
	};

	const toggle = (k) => setOpen((s) => { const n = new Set(s); if (n.has(k)) n.delete(k); else n.add(k); return n; });
	if (!project) return null;

	return createPortal(
		<AnimatePresence>
			{project && (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] overflow-y-auto bg-black/75 backdrop-blur-md p-3 md:p-6" onClick={onClose}>
					{minimized ? (
						<div className="min-h-full flex items-center justify-center">
							<motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={(e) => { e.stopPropagation(); setMinimized(false); }} className="flex items-center gap-3 bg-[#16161a] border border-white/15 rounded-full pl-2 pr-5 py-1.5 shadow-2xl">
								<span className="flex gap-1.5 px-2"><i className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] block" /><i className="w-2.5 h-2.5 rounded-full bg-[#febc2e] block" /><i className="w-2.5 h-2.5 rounded-full bg-[#28c840] block" /></span>
								<span className="text-xs font-bold text-white">{project.title} — restore</span>
							</motion.button>
						</div>
					) : (
						<div className="min-h-full flex items-start sm:items-center justify-center py-2">
							<motion.div
								initial={{ scale: 0.92, opacity: 0, y: 24 }}
								animate={{ scale: 1, opacity: 1, y: 0 }}
								exit={{ scale: 0.94, opacity: 0, y: 16 }}
								transition={{ type: 'spring', damping: 28, stiffness: 320 }}
								onClick={(e) => e.stopPropagation()}
								className={`w-full flex flex-col overflow-hidden border border-white/15 bg-[#16161a] shadow-[0_50px_140px_rgba(0,0,0,0.8)] ring-1 ring-white/10 ${maximized ? 'max-w-6xl min-h-[86vh] rounded-xl' : 'max-w-5xl max-h-[90vh] rounded-2xl'}`}
							>
								<div className="flex items-center gap-3 px-4 h-12 shrink-0 bg-[#2d2d30] border-b border-black/50">
									<Traffic onClose={onClose} onMin={() => setMinimized(true)} onMax={() => setMaximized((m) => !m)} maximized={maximized} />
									<div className="flex items-center bg-black/40 border border-white/10 rounded-lg p-0.5 mx-auto">
										{[['demo', 'Live demo'], ['code', 'Real code']].map(([k, l]) => (
											<button key={k} onClick={() => setTab(k)} className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition ${tab === k ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}>{l}</button>
										))}
									</div>
									<a href={project.link} target="_blank" rel="noreferrer" title="Open repo on GitHub" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"><Github size={15} /></a>
								</div>

								{tab === 'demo' ? (
									<div className={`flex flex-col min-h-0 bg-[#0b0b0e] ${maximized ? 'flex-1' : 'h-[62vh] md:h-[540px] max-h-[calc(90vh-48px)]'}`}>
									<div className="flex items-center gap-2 px-3 h-10 shrink-0 bg-[#1c1c1f] border-b border-white/10 text-[11px]">
										<button onClick={() => setReloadKey((k) => k + 1)} title="Reload" className="p-1 text-gray-500 hover:text-white shrink-0"><RotateCw size={12} /></button>
										<div className="hidden sm:flex flex-1 items-center gap-1.5 bg-black/40 border border-white/10 rounded-md px-2.5 py-1 font-mono text-gray-300 truncate">
											<span className="text-emerald-400 text-[10px]">🔒</span>
											<span className="truncate">{demoUrl}</span>
										</div>
										<span className="text-[10px] bg-green-500/15 text-green-300 px-2 py-0.5 rounded-full shrink-0">● LIVE</span>
									</div>
									<div className="flex-1 min-h-0 overflow-auto p-3 md:p-4" key={reloadKey}>
										<iframe src={demoUrl} title={`${project.title} live`} className="w-full h-full min-h-[300px] rounded-xl bg-white border border-white/10" loading="lazy" />
									</div>
									</div>
								) : (
									<div className={`flex text-left min-h-0 ${maximized ? 'flex-1' : 'h-[62vh] md:h-[540px] max-h-[calc(90vh-48px)]'}`}>
										<div className="w-56 shrink-0 hidden sm:flex flex-col min-h-0 bg-[#212124] border-r border-black/40">
											<div className="p-2.5 shrink-0">
												<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search files…" className="w-full bg-black/30 rounded-lg px-2.5 py-2 text-[11px] text-white outline-none border border-white/10 focus:border-primary/50" />
											</div>
											<div className="flex-1 min-h-0 overflow-auto px-1.5 pb-2">
												<div className="px-1.5 py-1 text-[10px] font-bold text-gray-500 uppercase">Curated</div>
												{filteredBundled.map((f) => {
													const i = bundled.indexOf(f);
													return (
														<button key={f.path} onClick={() => { setActiveFile(i); setGhFile(null); }} className={`w-full flex items-center gap-1.5 text-[11px] font-mono truncate px-2 py-1 rounded-md ${!ghFile && i === activeFile ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>
															<FileCode2 size={11} className={extColor(f.path)} /> {f.path}
														</button>
													);
												})}
												<div className="px-1.5 pt-2 pb-1 flex items-center justify-between">
													<span className="text-[10px] font-bold text-gray-500 uppercase">GitHub — all files</span>
													{ghLoading && <Loader2 size={11} className="animate-spin text-primary" />}
												</div>
												{ghError && <div className="mx-1.5 text-[10px] text-amber-300/90 bg-amber-400/10 rounded-md p-2">{ghError}</div>}
												{!ghPaths && !ghLoading && !ghError && (
													<button onClick={importAll} className="mx-1.5 w-[calc(100%-12px)] text-[11px] font-bold border border-white/10 rounded-lg py-1.5 text-gray-300 hover:bg-white/5">Import all files</button>
												)}
												{tree && <TreeNode node={tree} depth={0} open={open} toggle={toggle} onFile={openGhFile} active={ghFile?.path} />}
											</div>
										</div>
										<div className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#1e1e20]">
											<div className="flex items-center gap-2 px-3 h-10 shrink-0 border-b border-white/10 text-[11px]">
												<FileCode2 size={13} className={extColor(editorPath)} />
												<span className="font-mono text-gray-200 truncate">{editorPath}</span>
												{ghFile && <span className="text-[9px] font-bold bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 rounded shrink-0">LIVE FROM GITHUB</span>}
												<span className="ml-auto flex items-center gap-0.5 shrink-0">
													<button title="Copy" onClick={() => { navigator.clipboard?.writeText(editorCode); setCopied(true); setTimeout(() => setCopied(false), 1200); }} className="p-1.5 text-gray-400 hover:text-white">{copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}</button>
													<a title="Open real file on GitHub" href={githubFileUrl} target="_blank" rel="noreferrer" className="p-1.5 text-gray-400 hover:text-white"><ExternalLink size={13} /></a>
												</span>
											</div>
											<div className="flex-1 min-h-0 overflow-auto">
												{ghFileLoading ? (
													<div className="h-full flex items-center justify-center text-gray-500 text-xs gap-2"><Loader2 size={14} className="animate-spin" /> Loading real file…</div>
												) : (
													<pre className="text-[11.5px] leading-5 font-mono p-4 pr-6 flex">
														<code className="text-gray-600 text-right pr-4 select-none shrink-0">{editorCode.split('\n').map((_, i) => <span key={i} className="block">{i + 1}</span>)}</code>
														<code className="text-gray-200 whitespace-pre" dangerouslySetInnerHTML={{ __html: html }} />
													</pre>
												)}
											</div>
											<div className="sm:hidden border-t border-white/10 p-2 shrink-0">
												<div className="text-[10px] text-gray-500 font-mono mb-1">Files</div>
												<div className="flex gap-1.5 overflow-x-auto">
													{filteredBundled.map((f) => (
														<button key={f.path} onClick={() => { setActiveFile(bundled.indexOf(f)); setGhFile(null); }} className="shrink-0 text-[10px] font-mono px-2 py-1 rounded bg-white/5 text-gray-300">{f.path.split('/').pop()}</button>
													))}
												</div>
											</div>
										</div>
									</div>
								)}
							</motion.div>
						</div>
					)}
				</motion.div>
			)}
		</AnimatePresence>,
		document.body
	);
}
