import { useState, useEffect } from "react";
import perfil1 from "./assets/perfil1.jpg";
import perfil2 from "./assets/perfil2.jpg";
import perfil3 from "./assets/perfil3.jpg";

function App() {
  const fotos = [perfil1, perfil2, perfil3];

  const [fotoIndex, setFotoIndex] = useState(() => {
    return JSON.parse(localStorage.getItem("fotoIndex")) || 0;
  });

  const [mostrarFotos, setMostrarFotos] = useState(false);

  const [nome, setNome] = useState(() => {
    return localStorage.getItem("nome") || "Meu Perfil";
  });

  const [editandoNome, setEditandoNome] = useState(false);

  const [notas, setNotas] = useState(() => {
    const notasSalvas = localStorage.getItem("notas");
    return notasSalvas ? JSON.parse(notasSalvas) : [];
  });

  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    localStorage.setItem("notas", JSON.stringify(notas));
  }, [notas]);

  useEffect(() => {
    localStorage.setItem("fotoIndex", JSON.stringify(fotoIndex));
  }, [fotoIndex]);

  useEffect(() => {
    localStorage.setItem("nome", nome);
  }, [nome]);

  function adicionarNota() {
    if (!titulo.trim() || !conteudo.trim()) return;

    const novaNota = {
      id: Date.now(),
      titulo,
      conteudo,
    };

    setNotas([...notas, novaNota]);
    setTitulo("");
    setConteudo("");
  }

  function deletarNota(id) {
    setNotas(notas.filter((nota) => nota.id !== id));
  }

  function iniciarEdicao(nota) {
    setEditandoId(nota.id);
    setTitulo(nota.titulo);
    setConteudo(nota.conteudo);
  }

  function salvarEdicao() {
    setNotas(
      notas.map((nota) =>
        nota.id === editandoId
          ? { ...nota, titulo, conteudo }
          : nota
      )
    );

    setEditandoId(null);
    setTitulo("");
    setConteudo("");
  }

  return (
    <div style={styles.page}>
      <div style={styles.app}>

        {/* HEADER */}
        <div style={styles.header}>

          {/* FOTO */}
          <div style={styles.fotoContainer}>
            <img
              src={fotos[fotoIndex]}
              alt="perfil"
              style={styles.logo}
            />

            <span
              style={styles.editIconFoto}
              onClick={() => setMostrarFotos(!mostrarFotos)}
            >
              ✏️
            </span>
          </div>

          {/* NOME */}
          <div>
            {editandoNome ? (
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                onBlur={() => setEditandoNome(false)}
                style={styles.nomeInput}
                autoFocus
              />
            ) : (
              <div
                style={styles.nomeContainer}
                onClick={() => setEditandoNome(true)}
              >
                <h1 style={styles.nome}>{nome}</h1>
                <span style={styles.editIcon}>✏️</span>
              </div>
            )}

            <p style={styles.sub}>Aplicativo de Notas</p>
          </div>
        </div>

        {/* ESCOLHER FOTO (SÓ APARECE SE CLICAR) */}
        {mostrarFotos && (
          <div style={styles.fotos}>
            {fotos.map((foto, index) => (
              <img
                key={index}
                src={foto}
                alt="perfil opção"
                style={{
                  ...styles.fotoMini,
                  border:
                    fotoIndex === index
                      ? "3px solid #667eea"
                      : "2px solid #ccc",
                }}
                onClick={() => {
                  setFotoIndex(index);
                  setMostrarFotos(false); // fecha depois
                }}
              />
            ))}
          </div>
        )}

        {/* INPUT */}
        <div style={styles.inputArea}>
          <input
            style={styles.input}
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <textarea
            style={styles.textarea}
            placeholder="Conteúdo"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
          />

          {editandoId ? (
            <button style={styles.saveButton} onClick={salvarEdicao}>
              💾 Salvar
            </button>
          ) : (
            <button style={styles.addButton} onClick={adicionarNota}>
              ➕ Adicionar
            </button>
          )}
        </div>

        {/* GRID */}
        <div style={styles.grid}>
          {notas.map((nota) => (
            <div key={nota.id} style={styles.card}>
              <h3>{nota.titulo}</h3>
              <p>{nota.conteudo}</p>

              <div style={styles.actions}>
                <button
                  style={styles.editButton}
                  onClick={() => iniciarEdicao(nota)}
                >
                  ✏️
                </button>

                <button
                  style={styles.deleteButton}
                  onClick={() => deletarNota(nota.id)}
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    padding: 30,
    fontFamily: "Arial",
  },

  app: {
    width: "100%",
    maxWidth: 900,
    background: "#fff",
    borderRadius: 20,
    padding: 25,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    marginBottom: 10,
  },

  fotoContainer: {
    position: "relative",
  },

  logo: {
    width: 70,
    height: 70,
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #667eea",
  },

  editIconFoto: {
    position: "absolute",
    bottom: 0,
    right: 0,
    background: "#667eea",
    color: "#fff",
    borderRadius: "50%",
    padding: "4px",
    fontSize: 12,
    cursor: "pointer",
  },

  nomeContainer: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
  },

  nome: {
    margin: 0,
  },

  editIcon: {
    fontSize: 14,
    color: "#667eea",
  },

  nomeInput: {
    fontSize: 20,
    padding: 5,
    borderRadius: 5,
    border: "1px solid #ccc",
  },

  sub: {
    margin: 0,
    color: "#777",
  },

  fotos: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },

  fotoMini: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    objectFit: "cover",
    cursor: "pointer",
  },

  inputArea: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 20,
  },

  input: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ddd",
  },

  textarea: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ddd",
    minHeight: 80,
  },

  addButton: {
    padding: 12,
    border: "none",
    borderRadius: 10,
    background: "#667eea",
    color: "#fff",
    cursor: "pointer",
  },

  saveButton: {
    padding: 12,
    border: "none",
    borderRadius: 10,
    background: "#28a745",
    color: "#fff",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: 15,
  },

  card: {
    background: "#f9f9f9",
    padding: 15,
    borderRadius: 15,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  actions: {
    marginTop: 10,
    display: "flex",
    gap: 10,
  },

  editButton: {
    border: "none",
    padding: "6px 10px",
    borderRadius: 8,
    background: "#FFC107",
    cursor: "pointer",
  },

  deleteButton: {
    border: "none",
    padding: "6px 10px",
    borderRadius: 8,
    background: "#E53935",
    color: "#fff",
    cursor: "pointer",
  },
};

export default App;