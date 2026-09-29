package v1

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/Devounn/DormHunt/internal/delivery/http/middleware"
	"github.com/Devounn/DormHunt/internal/entity"
	"github.com/Devounn/DormHunt/internal/usecase"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type MessageHandler struct {
	useCase *usecase.MessageUseCase
}

func NewMessageHandler(u *usecase.MessageUseCase) *MessageHandler {
	return &MessageHandler{useCase: u}
}

func (h *MessageHandler) Routes() chi.Router {
	r := chi.NewRouter()
	r.Post("/", h.Send)
	r.Get("/conversation/{user_id}", h.Conversation)
	return r
}

func (h *MessageHandler) Send(w http.ResponseWriter, r *http.Request) {
	var req entity.Message
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	val := r.Context().Value(middleware.UserIDKey)
	if val == nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	senderID, ok := val.(uuid.UUID)
	if !ok {
		http.Error(w, "invalid user id", http.StatusUnauthorized)
		return
	}

	req.SenderID = senderID
	req.ID = uuid.New()
	req.CreatedAt = time.Now()

	if err := h.useCase.SendMessage(r.Context(), &req); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(req)
}

func (h *MessageHandler) Conversation(w http.ResponseWriter, r *http.Request) {
	other := chi.URLParam(r, "user_id")
	otherID, err := uuid.Parse(other)
	if err != nil {
		http.Error(w, "invalid user id", http.StatusBadRequest)
		return
	}

	limit := 50
	if l := r.URL.Query().Get("limit"); l != "" {
		if v, err := strconv.Atoi(l); err == nil && v > 0 {
			limit = v
		}
	}

	val := r.Context().Value(middleware.UserIDKey)
	if val == nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	userID, ok := val.(uuid.UUID)
	if !ok {
		http.Error(w, "invalid user id", http.StatusUnauthorized)
		return
	}

	msgs, err := h.useCase.Conversation(r.Context(), userID, otherID, limit)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(msgs)
}
