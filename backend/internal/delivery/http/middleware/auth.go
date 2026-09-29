package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/google/uuid"
)

type contextKey string

const (
	UserIDKey contextKey = "user_id"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// First check X-User-ID header (dev/testing shortcut)
		if uid := r.Header.Get("X-User-ID"); uid != "" {
			if parsed, err := uuid.Parse(uid); err == nil {
				ctx := context.WithValue(r.Context(), UserIDKey, parsed)
				next.ServeHTTP(w, r.WithContext(ctx))
				return
			}
			http.Error(w, "invalid X-User-ID", http.StatusUnauthorized)
			return
		}

		// Then check Authorization: Bearer <uuid>
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "missing authorization", http.StatusUnauthorized)
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == authHeader {
			http.Error(w, "invalid token format", http.StatusUnauthorized)
			return
		}

		// For now, expect the token to be a user UUID (dev mode)
		parsed, err := uuid.Parse(token)
		if err != nil {
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), UserIDKey, parsed)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
