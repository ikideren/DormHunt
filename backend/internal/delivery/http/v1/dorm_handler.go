package v1

import (
	"encoding/json"
	"net/http"

	"github.com/Devounn/DormHunt/internal/entity"
	"github.com/Devounn/DormHunt/internal/usecase"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type DormHandler struct {
	useCase *usecase.DormUseCase
}

func NewDormHandler(u *usecase.DormUseCase) *DormHandler {
	return &DormHandler{
		useCase: u,
	}
}

func (h *DormHandler) Routes() chi.Router {
	r := chi.NewRouter()
	r.Get("/", h.ListApproved)
	r.Post("/", h.Create)
	r.Get("/{id}", h.GetByID)
	return r
}

// Create godoc
// @Summary Create a new dorm listing
// @Description Create a new dorm listing with the provided details.
// @Tags dorms
// @Accept  json
// @Produce  json
// @Param dorm body entity.Dorm true "Dorm object"
// @Success 201 {object} entity.Dorm
// @Failure 400 {string} string "Bad Request"
// @Failure 500 {string} string "Internal Server Error"
// @Router /dorms [post]
func (h *DormHandler) Create(w http.ResponseWriter, r *http.Request) {
	var dorm entity.Dorm
	if err := json.NewDecoder(r.Body).Decode(&dorm); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// In a real app, we would get the seller_id from the context (via Auth middleware)
	// For now, we assume it's provided in the body or use a dummy
	if dorm.SellerID == uuid.Nil {
		dorm.SellerID = uuid.New() // Dummy
	}

	if err := h.useCase.CreateDorm(r.Context(), &dorm); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(dorm)
}

// ListApproved godoc
// @Summary List all approved dorms
// @Description Get a list of all dorms that have been approved.
// @Tags dorms
// @Produce  json
// @Success 200 {array} entity.Dorm
// @Failure 500 {string} string "Internal Server Error"
// @Router /dorms [get]
func (h *DormHandler) ListApproved(w http.ResponseWriter, r *http.Request) {
	dorms, err := h.useCase.ListApprovedDorms(r.Context(), nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(dorms)
}

// GetByID godoc
// @Summary Get a dorm by ID
// @Description Get detailed information about a specific dorm listing.
// @Tags dorms
// @Produce  json
// @Param id path string true "Dorm ID"
// @Success 200 {object} entity.Dorm
// @Failure 400 {string} string "Invalid ID"
// @Failure 404 {string} string "Dorm not found"
// @Router /dorms/{id} [get]
func (h *DormHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	dorm, err := h.useCase.GetDormByID(r.Context(), id)
	if err != nil {
		http.Error(w, "dorm not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(dorm)
}
