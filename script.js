// =============================
// CONFIG
// =============================
const WHATSAPP_NUMBER = "557991211159"; // insira o número real

// =============================
// ESCAPE SEGURO (ANTI-XSS)
// =============================
function escapeText(str) {
  return String(str || "").replace(/[*_`~<>]/g, "");
}

// =============================
// CRIPTOGRAFIA XOR + BASE64
// =============================
const KEY = 73;

function shuffle(str) {
  return str.split("").sort(() => Math.random() - 0.5).join("");
}

function encrypt(value) {
  let xor = "";
  for (let i = 0; i < value.length; i++) {
    xor += String.fromCharCode(value.charCodeAt(i) ^ KEY);
  }
  return btoa(shuffle(xor));
}

function decrypt(enc) {
  const unshuffle = atob(enc);
  let result = "";
  for (let i = 0; i < unshuffle.length; i++) {
    result += String.fromCharCode(unshuffle.charCodeAt(i) ^ KEY);
  }
  return result;
}

// =============================
// MÁSCARA DE TELEFONE
// =============================
const telInput = document.getElementById("telefone");

telInput.addEventListener("input", () => {
  let v = telInput.value.replace(/\D/g, "");
  v = v.substring(0, 11);
  if (v.length > 5) telInput.value = v.substring(0,5) + "-" + v.substring(5);
  else telInput.value = v;
});

// =============================
// ENVIO
// =============================
document.getElementById("matriculaForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = document.getElementById("btnEnviar");
  btn.disabled = true;

  // coleta + sanitização
  const responsavel = escapeText(document.getElementById("responsavel").value.trim());
  const aluno = escapeText(document.getElementById("nomeAluno").value.trim());
  const serieTxt = escapeText(document.getElementById("serie").value.trim());
  const turnoTxt = escapeText(document.getElementById("turno").value.trim());
  const obsTxt = escapeText(document.getElementById("obs").value.trim() || "Nenhuma");
  let tel = escapeText(document.getElementById("telefone").value.trim());

  if (!responsavel || !aluno || !serieTxt || !turnoTxt || !tel) {
    alert("Preencha todos os campos obrigatórios.");
    btn.disabled = false;
    return;
  }

  if (tel.replace(/\D/g, "").length < 10) {
    alert("Telefone inválido.");
    btn.disabled = false;
    return;
  }

  const encryptedTel = encrypt(tel);
  tel = decrypt(encryptedTel);

  const mensagem = `📚 *Reserva de Vaga - Quero Aprender*\n\n*Responsável:* ${responsavel}\n*Aluno:* ${aluno}\n*Série:* ${serieTxt}\n*Turno:* ${turnoTxt}\n*Telefone:* ${tel}\n\n*Observações:* ${obsTxt}\n\nO valor da reserva é *30% da mensalidade* (abatido na primeira).`;

  const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(mensagem);
  window.open(url, "_blank");

  setTimeout(() => btn.disabled = false, 1200);
});
