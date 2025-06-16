<?php
header('Content-Type: application/json');

// Permitir apenas POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Método não permitido
    echo json_encode(['erro' => 'Método não permitido.']);
    exit;
}

// Coleta os dados do POST (esperando JSON no corpo)
$data = json_decode(file_get_contents('php://input'), true);

// Verifica se os dados estão completos
if (!isset($data['numero']) || !isset($data['status'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'Campos "numero" e "status" são obrigatórios.']);
    exit;
}

$numero = $data['numero'];
$novoStatus = $data['status'];
$arquivo = __DIR__ . '/status.json';


// Lê o arquivo JSON atual
if (!file_exists($arquivo)) {
    http_response_code(500);
    echo json_encode(['erro' => 'Arquivo status.json não encontrado.']);
    exit;
}

$json = file_get_contents($arquivo);
$statusData = json_decode($json, true);

// Atualiza ou adiciona o novo status
$statusData[$numero] = $novoStatus;

// Grava o novo JSON no arquivo
if (file_put_contents($arquivo, json_encode($statusData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode(['sucesso' => true, 'mensagem' => 'Status atualizado com sucesso.']);
} else {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao salvar o arquivo JSON.']);
}
?>
