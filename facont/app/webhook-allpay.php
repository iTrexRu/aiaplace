<?php
/**
 * AllPay Webhook Proxy
 * Receives notification from AllPay and forwards it to n8n router.
 */

// AllPay endpoint URL (matching the one in api.js)
$n8n_url = "https://itrex-auto-prod.up.railway.app/webhook/d3499289-9710-47bc-bd72-8aa9ccbd1426";

// 1. Get raw input from AllPay
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// If not JSON, try $_POST (some systems send form-data)
if (!$data) {
    $data = $_POST;
}

if (!$data) {
    http_response_code(400);
    exit('No data received');
}

// 2. Prepare payload for n8n
$payload = array_merge($data, [
    'cmd' => 'payment_confirm',
    'proxy' => 'php-webhook'
]);

// 3. Forward to n8n
$ch = curl_init($n8n_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// 4. Respond to AllPay
// AllPay expects 200 OK to stop retrying
http_response_code(200);
echo "OK";

// Optional: Log for debugging
// file_put_contents('webhook_log.txt', date('Y-m-d H:i:s') . " - " . json_encode($payload) . " - Status: $http_code\n", FILE_APPEND);
