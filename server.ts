import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Lazy initialize Stripe
let stripe: Stripe | null = null;
function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is required");
    stripe = new Stripe(key);
  }
  return stripe;
}

app.use(express.json());

// In-memory "database" for the demo
const users: any[] = [
  // Mock Lawyers
  {
    id: "l1",
    name: "Dr. Roberto Silva",
    email: "roberto@aurex.law",
    password: "hashed",
    role: "ADVOGADO",
    oab: "SP 123456",
    specialties: ["Civil", "Digital"],
    plan: "ELITE",
    subscriptionStatus: "ACTIVE",
    lat: -23.5505,
    long: -46.6333,
    rating: 4.9
  },
  {
    id: "l2",
    name: "Dra. Ana Paula Oliveira",
    email: "ana@aurex.law",
    password: "hashed",
    role: "ADVOGADO",
    oab: "RJ 654321",
    specialties: ["Trabalhista", "Família"],
    plan: "PROFESSIONAL",
    subscriptionStatus: "ACTIVE",
    lat: -22.9068,
    long: -43.1729,
    rating: 4.8
  }
];

// Initial mock cases
let cases: any[] = [
  { 
    id: '1', 
    title: 'Inventário - Família Souza', 
    client: 'Carlos Souza', 
    status: 'Ativo', 
    priority: 'Alta', 
    description: 'Processo de inventário referente ao espólio de João Souza.',
    documents: [
      { name: 'Certidao_Obito.pdf', size: '1.2 MB', date: '12/04/2026', owner: 'Cliente' },
      { name: 'Escritura_Imovel.pdf', size: '4.5 MB', date: '13/04/2026', owner: 'Advogado' }
    ]
  },
  { 
    id: '2', 
    title: 'Consultoria Contratual Tech', 
    client: 'Startup X', 
    status: 'Priority', 
    priority: 'Alta', 
    description: 'Análise de contratos de prestação de serviços internacionais.',
    documents: []
  },
];

// Helper to simulate sending email
async function sendWelcomeEmail(email: string, name: string, role: string) {
  console.log(`[EMAIL SIMULATOR] Enviando e-mail de boas-vindas para: ${email}`);
  console.log(`Assunto: Bem-vindo à Aurex Law, ${name}!`);
  console.log(`Conteúdo: Olá ${name}, sua conta como ${role} foi criada com sucesso. Acesse o painel para configurar seu perfil.`);
}

// OAB Validation Helper
function isValidOAB(oab: string) {
  // Pattern: UF + Space + 4 to 6 numbers (e.g., SP 123456)
  const regex = /^[A-Z]{2}\s\d{4,8}$/;
  return regex.test(oab);
}

// JWT Helper
const JWT_SECRET = process.env.JWT_SECRET || "aurex-law-secret-lux-2024";

// --- API ROUTES ---

// 0. Discovery: Search Lawyers
app.get("/api/lawyers/search", (req, res) => {
  try {
    const { specialty, lat, long, radius = 50, q } = req.query;
    
    let results = users.filter(u => u.role === "ADVOGADO");

    if (specialty) {
      results = results.filter(u => u.specialties?.includes(specialty as string));
    }

    if (q) {
      const query = (q as string).toLowerCase();
      results = results.filter(u => 
        u.name.toLowerCase().includes(query) || 
        u.oab?.toLowerCase().includes(query)
      );
    }

    // Simple haversine-ish filter if lat/long provided
    if (lat && long) {
      const userLat = parseFloat(lat as string);
      const userLong = parseFloat(long as string);
      
      results = results.map(lawyer => {
        // Calculate distance (very rough approximation for demo)
        const d = Math.sqrt(Math.pow(lawyer.lat - userLat, 2) + Math.pow(lawyer.long - userLong, 2)) * 111;
        return { ...lawyer, distance: d };
      }).filter(lawyer => lawyer.distance <= (parseFloat(radius as string)));
      
      results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    res.json(results);
  } catch (err: any) {
    console.error("Search Error:", err);
    res.status(500).json({ error: "Erro interno na busca" });
  }
});

// 1. Auth: Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role, oab, specialties } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios" });
    }

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: "Este e-mail já está cadastrado" });
    }

    if (role === 'ADVOGADO' && oab && !isValidOAB(oab)) {
      return res.status(400).json({ error: "Formato de OAB inválido. Use 'UF 123456' (Ex: SP 123456)" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password: hashedPassword,
      role: role || "CLIENTE",
      oab,
      specialties,
      plan: "ESSENTIAL",
      subscriptionStatus: "INACTIVE"
    };

    users.push(newUser);
    
    // Simulate Email Sending
    await sendWelcomeEmail(email, name, newUser.role);

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET);
    
    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ user: userWithoutPassword, token });
  } catch (err: any) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Erro interno no servidor ao registrar" });
  }
});

// 5. Cases API
app.get("/api/cases", (req, res) => {
  res.json(cases);
});

app.get("/api/cases/:id", (req, res) => {
  const caseItem = cases.find(c => c.id === req.params.id);
  if (!caseItem) return res.status(404).json({ error: "Caso não encontrado" });
  res.json(caseItem);
});

app.post("/api/cases", (req, res) => {
  const newCaseItem = {
    id: Math.random().toString(36).substr(2, 9),
    ...req.body,
    status: 'Ativo',
    documents: []
  };
  cases.unshift(newCaseItem);
  res.json(newCaseItem);
});

app.delete("/api/cases/:id", (req, res) => {
  const index = cases.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    cases.splice(index, 1);
    return res.json({ success: true });
  }
  res.status(404).json({ error: "Caso não encontrado" });
});

app.delete("/api/cases/:caseId/documents/:docName", (req, res) => {
  const caseItem = cases.find(c => c.id === req.params.caseId);
  if (caseItem) {
    caseItem.documents = caseItem.documents.filter((d: any) => d.name !== req.params.docName);
    return res.json({ success: true });
  }
  res.status(404).json({ error: "Documento não encontrado" });
});

// 2. Auth: Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, token });
});

// 4. Stripe: Create Checkout Session
app.post("/api/checkout/create-session", async (req, res) => {
  const { planPriceId, userId } = req.body;

  try {
    const stripeClient = getStripe();
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: planPriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.APP_URL || "http://localhost:3000"}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL || "http://localhost:3000"}/pricing`,
      metadata: { userId },
    });

    res.json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- VITE MIDDLEWARE ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
