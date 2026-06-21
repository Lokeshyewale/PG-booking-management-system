package com.pgbooking.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import java.nio.charset.StandardCharsets;

import java.util.Base64;
import java.util.HexFormat;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    /**
     * Create Razorpay Order
     */
    public Map<String, Object> createOrder(
            long amountPaise,
            String currency,
            String receipt) {

        try {

            String body = String.format(
                    "{\"amount\":%d,\"currency\":\"%s\",\"receipt\":\"%s\"}",
                    amountPaise,
                    currency,
                    receipt);

            HttpClient client = HttpClient.newHttpClient();

            String credentials = Base64.getEncoder()
                    .encodeToString(
                            (keyId + ":" + keySecret)
                                    .getBytes(StandardCharsets.UTF_8));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.razorpay.com/v1/orders"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Basic " + credentials)
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = client.send(
                    request,
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200 &&
                    response.statusCode() != 201) {

                throw new RuntimeException(
                        "Razorpay API Error: " + response.body());
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(response.body());

            return Map.of(
                    "id", node.get("id").asText(),
                    "amount", node.get("amount").asLong(),
                    "currency", node.get("currency").asText(),
                    "receipt", node.get("receipt").asText());
        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to create Razorpay order",
                    e);
        }
    }

    /**
     * Verify Razorpay Payment Signature
     */
    public boolean verifySignature(
            String orderId,
            String paymentId,
            String razorpaySignature) {

        try {

            String data = orderId + "|" + paymentId;

            Mac mac = Mac.getInstance("HmacSHA256");

            SecretKeySpec secretKey = new SecretKeySpec(
                    keySecret.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256");

            mac.init(secretKey);

            byte[] hash = mac.doFinal(
                    data.getBytes(StandardCharsets.UTF_8));

            String generatedSignature =
                    HexFormat.of().formatHex(hash);

            return generatedSignature.equalsIgnoreCase(
                    razorpaySignature);

        } catch (Exception e) {
            return false;
        }
    }
}