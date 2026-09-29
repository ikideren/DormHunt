package entity

import (
	"time"

	"github.com/google/uuid"
)

type Message struct {
	ID         uuid.UUID  `json:"id"`
	SenderID   uuid.UUID  `json:"sender_id"`
	ReceiverID uuid.UUID  `json:"receiver_id"`
	DormID     *uuid.UUID `json:"dorm_id,omitempty"`
	Content    string     `json:"content"`
	Metadata   []byte     `json:"metadata,omitempty"`
	IsRead     bool       `json:"is_read"`
	CreatedAt  time.Time  `json:"created_at"`
}

type MessageRepository interface {
	Create(msg *Message) error
	ListByConversation(userA, userB uuid.UUID, limit int) ([]*Message, error)
	MarkRead(id uuid.UUID) error
}
