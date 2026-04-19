package com.pawfinder.common.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

/**
 * JWT utility class
 */
public class JwtUtil {

    private static final String SECRET = "pawfinder-secret-key-for-jwt-token-generation-2024";
    private static final long EXPIRATION = 7 * 24 * 60 * 60 * 1000L; // 7 days
    private static final SecretKey KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    /**
     * Generate JWT token
     */
    public static String generateToken(String userId, Map<String, Object> claims) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + EXPIRATION);

        JwtBuilder builder = Jwts.builder()
                .subject(userId)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(KEY);

        if (claims != null) {
            claims.forEach(builder::claim);
        }

        return builder.compact();
    }

    /**
     * Generate simple token
     */
    public static String generateToken(String userId) {
        return generateToken(userId, null);
    }

    /**
     * Parse token and get claims
     */
    public static Claims parseToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(KEY)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            System.out.println("JWT token expired");
            throw e;
        } catch (JwtException e) {
            System.out.println("Invalid JWT token: " + e.getMessage());
            throw e;
        }
    }

    /**
     * Get user ID from token
     */
    public static String getUserId(String token) {
        return parseToken(token).getSubject();
    }

    /**
     * Get claim value
     */
    public static <T> T getClaim(String token, String claimName, Class<T> clazz) {
        return parseToken(token).get(claimName, clazz);
    }
}
