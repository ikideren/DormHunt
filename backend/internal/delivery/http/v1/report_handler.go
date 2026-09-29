package v1

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/Devounn/DormHunt/internal/delivery/http/middleware"
	"github.com/Devounn/DormHunt/internal/entity"
	"github.com/Devounn/DormHunt/internal/usecase"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type ReportHandler struct {
	useCase *usecase.ReportUseCase
}

func NewReportHandler(u *usecase.ReportUseCase) *ReportHandler {
	return &ReportHandler{useCase: u}
}

func (h *ReportHandler) Routes() chi.Router {
	r := chi.NewRouter()
	r.Post("/", h.Submit)
	r.Get("/open", h.ListOpen)
	r.Patch("/{id}/resolve", h.Resolve)
	return r
}

func (h *ReportHandler) Submit(w http.ResponseWriter, r *http.Request) {
	var req entity.Report
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// attach reporter from context
	val := r.Context().Value(middleware.UserIDKey)
	if val == nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	reporterID, ok := val.(uuid.UUID)
	if !ok {
		http.Error(w, "invalid user id", http.StatusUnauthorized)
		return
	}

	req.ReporterID = reporterID
	req.ID = uuid.New()
	req.CreatedAt = time.Now()
	req.Status = entity.ReportOpen

	if err := h.useCase.SubmitReport(r.Context(), &req); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(req)
}

func (h *ReportHandler) ListOpen(w http.ResponseWriter, r *http.Request) {
	reports, err := h.useCase.ListOpenReports(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reports)
}

func (h *ReportHandler) Resolve(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	if err := h.useCase.ResolveReport(r.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
