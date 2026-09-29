package entity

import (
	"time"

	"github.com/google/uuid"
)

type ReportStatus string

const (
	ReportOpen       ReportStatus = "open"
	ReportInProgress ReportStatus = "in_progress"
	ReportResolved   ReportStatus = "resolved"
	ReportDismissed  ReportStatus = "dismissed"
)

type Report struct {
	ID               uuid.UUID    `json:"id"`
	ReporterID       uuid.UUID    `json:"reporter_id"`
	ReportedItemID   uuid.UUID    `json:"reported_item_id"`
	ReportedItemType string       `json:"reported_item_type"`
	Reason           string       `json:"reason"`
	Details          string       `json:"details,omitempty"`
	Status           ReportStatus `json:"status"`
	CreatedAt        time.Time    `json:"created_at"`
}

type ReportRepository interface {
	Create(report *Report) error
	ListOpen() ([]*Report, error)
	UpdateStatus(id uuid.UUID, status ReportStatus) error
}
