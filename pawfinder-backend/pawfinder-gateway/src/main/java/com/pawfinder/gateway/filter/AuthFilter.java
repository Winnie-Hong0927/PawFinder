package com.pawfinder.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Authentication filter for API Gateway
 */
@Component
public class AuthFilter implements GlobalFilter, Ordered {

    @Value("${jwt.secret:pawfinder-secret-key-for-jwt-token-generation-2024}")
    private String jwtSecret;

    private static final List<String> WHITE_LIST = List.of(
            "/api/auth/send-code",
            "/api/auth/verify-code",
            "/api/pets",
            "/api/pets/",
            "/api/institutions",
            "/api/institutions/",
            "/swagger-ui",
            "/v3/api-docs"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        // Skip whitelist paths
        for (String whitePath : WHITE_LIST) {
            if (path.startsWith(whitePath)) {
                return chain.filter(exchange);
            }
        }

        // Get token from header
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        token = token.substring(7);

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String userId = claims.getSubject();
            String role = claims.get("role", String.class);

            // Add user info to headers
            ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                    .header("X-User-Id", userId)
                    .header("X-User-Role", role != null ? role : "user")
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        } catch (Exception e) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }

    @Override
    public int getOrder() {
        return -100;
    }
}
