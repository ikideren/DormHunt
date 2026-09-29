package usecase

import (
	"context"
	"time"

	"github.com/Devounn/DormHunt/internal/entity"
	"github.com/google/uuid"
)

type MessageUseCase struct {
	repo entity.MessageRepository
}

func NewMessageUseCase(r entity.MessageRepository) *MessageUseCase {
	return &MessageUseCase{repo: r}
}

func (u *MessageUseCase) SendMessage(ctx context.Context, m *entity.Message) error {
	m.ID = uuid.New()
	m.CreatedAt = time.Now()
	m.IsRead = false
	return u.repo.Create(m)
}

func (u *MessageUseCase) Conversation(ctx context.Context, a, b uuid.UUID, limit int) ([]*entity.Message, error) {
	return u.repo.ListByConversation(a, b, limit)
}

func (u *MessageUseCase) MarkRead(ctx context.Context, id uuid.UUID) error {
	return u.repo.MarkRead(id)
}
