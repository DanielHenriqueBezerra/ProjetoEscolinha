const WHATSAPP_NUMBER = "557991211159";

function escapeText(str) {
  return String(str || "").replace(/[^\w\s.,!?@()-]/gi, "");
}

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

// Máscara do telefone
const telInput = document.getElementById("telefone");
telInput.addEventListener("input", () => {
  let v = telInput.value.replace(/\D/g, "");
  v = v.substring(0, 11);
  telInput.value = v.length > 5 ? v.substring(0, 5) + "-" + v.substring(5) : v;
});

// ALERT CUSTOMIZADO
function showAlert(title, message) {
  document.getElementById("alert-title").textContent = title;
  document.getElementById("alert-message").textContent = message;
  document.getElementById("custom-alert").classList.add("show");
}

function closeAlert() {
  document.getElementById("custom-alert").classList.remove("show");
}

// Fechar alerta
document.getElementById("alertOkBtn").addEventListener("click", closeAlert);

// ENVIO DO FORMULÁRIO
document.getElementById("matriculaForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = document.getElementById("btnEnviar");
  btn.disabled = true;

  const aluno = escapeText(document.getElementById("nomeAluno").value.trim());
  const serieTxt = escapeText(document.getElementById("serie").value.trim());
  const turnoTxt = escapeText(document.getElementById("turno").value.trim());
  const responsavel = escapeText(document.getElementById("responsavel").value.trim());
  const obsTxt = escapeText(document.getElementById("obs").value.trim() || "Nenhuma");
  const consent = document.getElementById("lgpdConsent").checked;

  let tel = document.getElementById("telefone").value.trim().replace(/\D/g, "");

  // Validações
  if (!consent) { 
    showAlert("Termo obrigatório", "É necessário aceitar o Termo de Consentimento (LGPD)."); 
    btn.disabled = false; 
    return; 
  }
  if (!aluno || !serieTxt || !turnoTxt || !responsavel || !tel) { 
    showAlert("Campos vazios", "Preencha todos os campos obrigatórios."); 
    btn.disabled = false; 
    return; 
  }
  if (tel.length < 10) { 
    showAlert("Telefone inválido", "Digite um número válido para contato."); 
    btn.disabled = false; 
    return; 
  }

  const finalTel = decrypt(encrypt(tel));

  // Monta a mensagem do WhatsApp
  const mensagem = `📚 *Reserva de Vaga - Quero Aprender*\n\n*Responsável:* ${responsavel}\n*Aluno:* ${aluno}\n*Série:* ${serieTxt}\n*Turno:* ${turnoTxt}\n*Telefone:* ${finalTel}\n\n*Observações:* ${obsTxt}\n\nO valor da reserva é *30% da mensalidade* (abatido na primeira).`;

  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(mensagem), "_blank");

  setTimeout(() => btn.disabled = false, 1200);
});
