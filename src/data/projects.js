// HOW TO ADD A DEMO:
// 1. Copy one block below, change id/title/desc/link/tags/image.
// 2. For a live demo tab, add demoUrl: 'https://your-live-site.com'
//    -> card gets an Open Demo button opening the real site in a window.
//    No demoUrl = no demo button, just GitHub + Live links.
// 3. files: [{ path, language, code }] = tabs in the Real code view.
//    Paste real snippets (30-60 lines each is enough).
export const PROJECTS = [
	{
		id: 'chiya-puff',
		title: 'Chiya and Puff',
		desc: 'A full-stack restaurant operations platform featuring QR-based table ordering, real-time dashboards for staff, and integrated billing. Built with Next.js and Prisma, it optimizes the dining experience from order to payment.',
		link: 'https://github.com/Kishor0513/Chiya-and-Puff',
		live: '#',
		tags: ['Next.js', 'Prisma', 'PostgreSQL'],
		image: '/assets/projects/chiya-screenshot.png',
		className: 'md:col-span-2',
		hoverColor: '#f97316',
		files: [
			{
				path: 'app/page.tsx',
				language: 'tsx',
				code: `import { MenuGrid } from '@/components/MenuGrid';
import { CartProvider } from '@/store/cart';

export default async function Home({ searchParams }) {
  const table = searchParams.table ?? 'T-01';
  const menu = await db.menu.findMany({ where: { available: true } });

  return (
    <CartProvider tableId={table}>
      <main className="min-h-screen bg-amber-50">
        <TableBanner table={table} />
        <MenuGrid items={menu} />
        <CheckoutBar />
      </main>
    </CartProvider>
  );
}`,
			},
			{
				path: 'store/cart.ts',
				language: 'ts',
				code: `import { create } from 'zustand';

type Item = { id: string; qty: number };

export const useCart = create((set) => ({
  tableId: 'T-01',
  items: [] as Item[],
  add: (id: string) => set((s) => ({
    items: [...s.items, { id, qty: 1 }],
  })),
  total: () => 0,
}));`,
			},
			{
				path: 'app/api/order/route.ts',
				language: 'ts',
				code: `import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const { tableId, items } = await req.json();
  const order = await prisma.order.create({
    data: {
      tableId,
      status: 'PENDING',
      items: { create: items },
    },
  });
  // push realtime update to kitchen dashboard
  await pusher.trigger('kitchen', 'new-order', order);
  return NextResponse.json(order);
}`,
			},
		],
	},
	{
		id: 'social',
		title: 'Social Media',
		desc: '"Super Social" is a real-time networking app with features like disappearning stories, WebRTC video calls, and instant messaging. It uses Socket.IO and Prisma for a modern, fluid social experience.',
		link: 'https://github.com/Kishor0513/Social-Media',
		live: '#',
		tags: ['React', 'Node.js', 'Socket.io'],
		image: '/assets/social_media.png',
		className: 'md:col-span-1',
		hoverColor: '#22d3ee',
		files: [
			{
				path: 'client/src/Feed.jsx',
				language: 'jsx',
				code: `import { useSocket } from './hooks/useSocket';

export function Feed() {
  const { posts, like } = useSocket('feed');

  return posts.map((p) => (
    <article key={p.id} className="post">
      <header>@{p.author}</header>
      <p>{p.text}</p>
      <button onClick={() => like(p.id)}>
        ♥ {p.likes}
      </button>
    </article>
  ));
}`,
			},
			{
				path: 'server/socket.js',
				language: 'js',
				code: `io.on('connection', (socket) => {
  socket.join('feed');

  socket.on('like', async ({ postId, userId }) => {
    const post = await prisma.post.update({
      where: { id: postId },
      data: { likes: { increment: 1 } },
    });
    io.to('feed').emit('post:liked', post);
  });

  socket.on('typing', (u) => socket.broadcast.emit('typing', u));
});`,
			},
			{
				path: 'client/src/Call.jsx',
				language: 'jsx',
				code: `const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

export async function startCall(remoteId) {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  stream.getTracks().forEach((t) => pc.addTrack(t, stream));
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  socket.emit('call:offer', { to: remoteId, offer });
}`,
			},
		],
	},
	{
		id: 'weavers',
		title: 'Weavers',
		desc: 'A comprehensive PHP-based E-commerce platform. It features full cart functionality, secure checkout, and back-office management, showcasing the power of traditional web stacks for scalable retail.',
		link: 'https://github.com/Kishor0513/Weavers',
		live: '#',
		tags: ['PHP', 'MySQL', 'Ecommerce'],
		image: '/assets/ecommerce.png',
		className: 'md:col-span-1',
		hoverColor: '#15803d',
		files: [
			{
				path: 'cart.php',
				language: 'php',
				code: `<?php
session_start();
require 'db.php';

function addToCart($id, $qty = 1) {
  $_SESSION['cart'][$id] = ($_SESSION['cart'][$id] ?? 0) + $qty;
}

if ($_POST['action'] === 'add') {
  addToCart($_POST['id']);
  header('Location: /cart.php');
}`,
			},
			{
				path: 'checkout.php',
				language: 'php',
				code: `<?php
$stmt = $pdo->prepare("INSERT INTO orders (user_id, total) VALUES (?, ?)");
$stmt->execute([$userId, $total]);
$orderId = $pdo->lastInsertId();

foreach ($_SESSION['cart'] as $id => $qty) {
  $pdo->prepare("INSERT INTO order_items VALUES (?, ?, ?)")
      ->execute([$orderId, $id, $qty]);
}
$_SESSION['cart'] = [];`,
			},
		],
	},
	{
		id: 'dahlia',
		title: 'Dahlia Classification (FYP)',
		desc: 'My Final Year Project: An AI-driven application that classifies Dahlia flower types using a pre-trained VGG16 CNN model. This Flask web app provides high-confidence results by analyzing flower image data in real-time.',
		link: 'https://github.com/Kishor0513/App',
		live: '#',
		tags: ['Python', 'CNN', 'Deep Learning'],
		image: '/assets/projects/dahlia-flower.jpg',
		className: 'md:col-span-1',
		hoverColor: '#a855f7',
		files: [
			{
				path: 'app.py',
				language: 'python',
				code: `from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np

app = Flask(__name__)
model = load_model('vgg16_dahlia.h5')
CLASSES = ['Cactus', 'Dinnerplate', 'Pompon', 'Waterlily']

@app.route('/predict', methods=['POST'])
def predict():
    img = Image.open(request.files['file']).resize((224, 224))
    x = np.expand_dims(np.array(img) / 255.0, 0)
    probs = model.predict(x)[0]
    i = int(np.argmax(probs))
    return jsonify({"label": CLASSES[i], "confidence": float(probs[i])})`,
			},
			{
				path: 'model/train.py',
				language: 'python',
				code: `base = VGG16(weights='imagenet', include_top=False, input_shape=(224,224,3))
for layer in base.layers[:-4]:
    layer.trainable = False

x = GlobalAveragePooling2D()(base.output)
out = Dense(4, activation='softmax')(Dropout(0.3)(x))
model.compile(optimizer=Adam(1e-4), loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(train_gen, validation_data=val_gen, epochs=25)`,
			},
		],
	},
	{
		id: 'habit-tracker',
		title: 'Habit Tracker',
		desc: 'A macOS-inspired productivity system with habit tracking, GitHub-style heatmaps, streak analytics, Spotify-linked focus sessions, and daily reviews. Built with React, Supabase, and Recharts.',
		link: 'https://github.com/Kishor0513/Habit-tracker',
		live: 'https://habit-tracker-peach-three-53.vercel.app',
		demoUrl: 'https://habit-tracker-peach-three-53.vercel.app',
		tags: ['React', 'Supabase', 'Recharts'],
		image: '/assets/projects/habit-tracker.png',
		className: 'md:col-span-1 lg:col-span-1',
		hoverColor: '#ec4899',
		files: [
			{
				path: 'src/api.js',
				language: 'js',
				code: `import { del, get, getAll, openDb, put, tx } from "./db.js";
import { uid } from "./lib/ids.js";
import { isoToday } from "./lib/date.js";

export class HabitApi {
  constructor(db) {
    this.db = db;
  }

  static async create() {
    const db = await openDb();
    return new HabitApi(db);
  }

  async listHabits() {
    return tx(this.db, "habits", "readonly",
      async ({ habits }) => getAll(habits));
  }

  async completeHabit(id) {
    return this.upsertEntry({ habitId: id, date: isoToday(), done: true });
  }
}`,
			},
			{
				path: 'src/components/StreakHeatmap.jsx',
				language: 'jsx',
				code: `export function StreakHeatmap({ weeks }) {
  return (
    <div className="heatmap">
      {weeks.map((week, i) => (
        <div key={i} className="week">
          {week.map((day) => (
            <span
              key={day.date}
              title={\`\${day.date}: \${day.count}\`}
              className={\`cell level-\${day.level}\`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}`,
			},
		],
	},
];
