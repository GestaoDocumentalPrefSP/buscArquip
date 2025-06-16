const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

/* num teste
2000-0.188.203-8 retirado
1978-0.000.195-4 ACERVO
*/

const btn_busca = document.getElementById("buscarProcesso"); 
let saida = "";

document.addEventListener('keydown',  (pressiona) => { 
    if (pressiona.keyCode === 13) { 
        btn_busca.click(); 
    }
});

async function buscarProcesso() {
  const numeroProcesso = document.getElementById('input-processo').value.trim();
  const resultadoDiv = document.getElementById('resultado');

  if (!numeroProcesso) {
    resultadoDiv.innerHTML = '<p>Digite um número de processo.</p>';
    return;
  }

  try {
    const response = await fetch("https://arquip.prefeitura.sp.gov.br/Assets/busca_arquip/status.json");
    const statusData = await response.json();
    
    console.log(statusData)
    console.log("Buscando número:", numeroProcesso);

    if (statusData[numeroProcesso] === "SAIU") {
        console.log(statusData[numeroProcesso],"🟥 O processo está FORA do acervo.");
        saida = "🟥 O processo está FORA do acervo.";
      resultadoDiv.textContent = saida;
    } else if (statusData[numeroProcesso] === "ACERVO") {
      saida = "🟩 O processo está NO ACERVO.";
      resultadoDiv.textContent = saida;
        console.log(statusData[numeroProcesso],"🟩 O processo está NO ACERVO.");
    } else {
      saida = "❌ Processo não encontrado.";
      resultadoDiv.textContent = saida;
        console.log(statusData[numeroProcesso],"❌ Processo não encontrado.");
    }

  } catch (error) {
    resultadoDiv.textContent = "Erro ao acessar o status. Verifique sua conexão.";
    console.error(error);
  }
  // Caminho da planilha
  const filePath = path.join(__dirname, 'data', 'processos.xlsx');

  // Lê a planilha
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const dados = XLSX.utils.sheet_to_json(sheet);

  // Busca o processo
  const processo = dados.find(p => String(p.PROCESSOS).trim() === numeroProcesso);

  if (processo) {
    const situacao = saida;

    resultadoDiv.innerHTML = `
      <p><strong>Processo:</strong> ${processo.PROCESSOS}</p>
      <p><strong>Localização:</strong> Rua ${processo.RUA}, Estante ${processo.ESTANTE}, Pacote ${processo.PACOTE}</p>
      <p><strong>Situação:</strong><span id="situacao-texto">${situacao}</span> </p>
      <button id="btn-toggle" style="margin-top: 10px;">Alterar Situação</button>

      <div id="confirmacao-overlay" class="overlay hidden">
  <div class="caixa-confirmacao">
    <p id="confirmacao-texto">Deseja realmente alterar o status deste processo?</p>
    <div class="botoes">
      <button id="btn-confirmar">Sim</button>
      <button id="btn-cancelar">Cancelar</button>
    </div>
  </div>
</div>
    `;
  } else {
    resultadoDiv.innerHTML = '<p>Processo não encontrado.</p>';
  }
}

const input = document.getElementById('input-processo');

input.addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número

  if (value.length > 12) value = value.slice(0, 12); // Limita a 12 números

  // Aplica a máscara: 9999-0.999.999-9
  let formatted = value;
  if (value.length > 4) formatted = value.slice(0, 4) + '-' + value.slice(4);
  if (value.length > 5) formatted = formatted.slice(0, 6) + '.' + formatted.slice(6);
  if (value.length > 7) formatted = formatted.slice(0, 10) + '.' + formatted.slice(10);
  if (value.length > 11) formatted = formatted.slice(0, 14) + '-' + formatted.slice(14);

  e.target.value = formatted;
});

