
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'btn-toggle') {
        const situacaoSpan = document.getElementById('situacao-texto');
        const processo = document.getElementById('input-processo').value.trim();
        const situacaoAtual = situacaoSpan.textContent.trim();

        let novoTexto, novoStatus;

        if (situacaoAtual.includes('🟥 FORA do acervo.')) {
            novoTexto = '🟩 NO ACERVO.';
            novoStatus = 'ACERVO';
        } else if (situacaoAtual.includes('🟩 NO ACERVO.')) {
            novoTexto = '🟥 FORA do acervo.';
            novoStatus = 'SAIU';
        } else {
            alert("Situação desconhecida.");
            return;
        }
        mostrarConfirmacao(() => {
        situacaoSpan.textContent = novoTexto;
        atualizarStatus(processo, novoStatus);
    });
    }
});

function mostrarConfirmacao(callbackSim) {
  const overlay = document.getElementById('confirmacao-overlay');
  overlay.classList.remove('hidden');

  const btnSim = document.getElementById('btn-confirmar');
  const btnCancelar = document.getElementById('btn-cancelar');

  // Evita múltiplos listeners
  btnSim.onclick = () => {
    overlay.classList.add('hidden');
    callbackSim(); // Executa a ação confirmada
  };

  btnCancelar.onclick = () => {
    overlay.classList.add('hidden');
  };
}

async function atualizarStatus(numero, novoStatus) {
    try {
        const response = await fetch('https://arquip.prefeitura.sp.gov.br/Assets/busca_arquip/atualizar_status.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                numero: numero,
                status: novoStatus
            })
        });

        const result = await response.json();

        if (response.ok) {
            console.log(`Status processo ${numero} atualizado com sucesso para: ${novoStatus}`, result);
        } else {
            console.error('Erro ao atualizar:', result);
            console.error('Erro ao atualizar numero:', numero);
            console.error('Erro ao atualizar status:', novoStatus);
        }

    } catch (error) {
        console.error('Erro de conexão:', error);
    }
}

