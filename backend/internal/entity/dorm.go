package entity

import (
	"time"

	"github.com/google/uuid"
)

type DormStatus string

const (
	StatusPending  DormStatus = "pending"
	StatusApproved DormStatus = "approved"
	StatusRejected DormStatus = "rejected"
)

type Dorm struct {
	ID          uuid.UUID  `json:"id"`
	SellerID    uuid.UUID  `json:"seller_id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Price       float64    `json:"price"`
	Facilities  []string   `json:"facilities"`
	Images      []string   `json:"images"`
	Address     string     `json:"address"`
	Latitude    float64    `json:"latitude"`
	Longitude   float64    `json:"longitude"`
	Status      DormStatus `json:"status"`
	CreatedAt   time.Time  `json:"created_at"`
}

type DormRepository interface {
	Create(dorm *Dorm) error
	GetByID(id uuid.UUID) (*Dorm, error)
	ListApproved(filters map[string]interface{}) ([]*Dorm, error)
	UpdateStatus(id uuid.UUID, status DormStatus) error
}
