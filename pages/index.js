import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [meta, setMeta] = useState(95);
  const [dados, setDados] = useState([]);

  const [form, setForm] = useState({
    data: "",
    peso: "",
    gordura: "",
    massa: "",
    cintura: "",
    abdomen: "",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedDados = localStorage.getItem("dados");
    if (savedUser) setUser(savedUser);
    if (savedDados) setDados(JSON.parse(savedDados));
  }, []);

  useEffect(() => {
    localStorage.setItem("dados", JSON.stringify(dados));
  }, [dados]);

  const login = () => {
    if (!email || !senha) return;
    localStorage.setItem("user", email);
    setUser(email);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const adicionar = () => {
    if (!form.data) return;
    setDados([...dados, form]);
    setForm({ data: "", peso: "", gordura: "", massa: "", cintura: "", abdomen: "" });
  };

  const calcularDiferenca = (index, campo) => {
    if (index === 0) return "-";
    const atual = parseFloat(dados[index][campo]);
    const anterior = parseFloat(dados[index - 1][campo]);
    return (atual - anterior).toFixed(2);
  };

  const ultimo = dados[dados.length - 1];

  const progressoMeta = () => {
    if (!ultimo) return 0;
    const pesoInicial = parseFloat(dados[0].peso);
    const atual = parseFloat(ultimo.peso);
    return (((pesoInicial - atual) / (pesoInicial - meta)) * 100).toFixed(1);
  };

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login</h2>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Senha" type="password" onChange={(e) => setSenha(e.target.value)} />
        <button onClick={login}>Entrar</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Lucas Fitness Pro</h1>
      <button onClick={logout}>Sair</button>

      <p>Meta: {meta} kg</p>
      <p>Progresso: {progressoMeta()}%</p>

      <input name="data" placeholder="Data" value={form.data} onChange={handleChange} />
      <input name="peso" placeholder="Peso" value={form.peso} onChange={handleChange} />
      <input name="gordura" placeholder="Gordura %" value={form.gordura} onChange={handleChange} />
      <input name="massa" placeholder="Massa muscular" value={form.massa} onChange={handleChange} />
      <button onClick={adicionar}>Salvar</button>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={dados}>
          <XAxis dataKey="data" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="peso" />
        </LineChart>
      </ResponsiveContainer>

      {dados.map((item, index) => (
        <div key={index}>
          <p>{item.data}</p>
          <p>Peso: {item.peso} (Δ {calcularDiferenca(index, "peso")})</p>
        </div>
      ))}
    </div>
  );
}
