package repository

import (
	"context"
	"fmt"

	"github.com/Devounn/DormHunt/internal/entity"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresMessageRepository struct {
	db *pgxpool.Pool
}

func NewPostgresMessageRepository(db *pgxpool.Pool) *PostgresMessageRepository {
	return &PostgresMessageRepository{db: db}
}

func (r *PostgresMessageRepository) Create(msg *entity.Message) error {
	query := `INSERT INTO messages (id, sender_id, receiver_id, dorm_id, content, metadata, is_read, created_at)
              VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`
	_, err := r.db.Exec(context.Background(), query, msg.ID, msg.SenderID, msg.ReceiverID, msg.DormID, msg.Content, msg.Metadata, msg.IsRead, msg.CreatedAt)
	if err != nil {
		return fmt.Errorf("failed to create message: %w", err)
	}
	return nil
}

func (r *PostgresMessageRepository) ListByConversation(userA, userB uuid.UUID, limit int) ([]*entity.Message, error) {
	query := `SELECT id, sender_id, receiver_id, dorm_id, content, metadata, is_read, created_at FROM messages
              WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
              ORDER BY created_at DESC LIMIT $3`
	rows, err := r.db.Query(context.Background(), query, userA, userB, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to query messages: %w", err)
	}
	defer rows.Close()

	var out []*entity.Message
	for rows.Next() {
		m := &entity.Message{}
		if err := rows.Scan(&m.ID, &m.SenderID, &m.ReceiverID, &m.DormID, &m.Content, &m.Metadata, &m.IsRead, &m.CreatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan message: %w", err)
		}
		out = append(out, m)
	}
	return out, nil
}

func (r *PostgresMessageRepository) MarkRead(id uuid.UUID) error {
	query := `UPDATE messages SET is_read = true WHERE id = $1`
	_, err := r.db.Exec(context.Background(), query, id)
	if err != nil {
		return fmt.Errorf("failed to mark message read: %w", err)
	}
	return nil
}
